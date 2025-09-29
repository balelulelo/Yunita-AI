from flask import Flask, request, jsonify
from flask_cors import CORS
from core_logic import get_yunita_response, PROMPTS

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history_from_frontend = data.get('history', []) 
    language = data.get('language', 'en')
    user_name = data.get('userName', 'User') # Ambil nama pengguna

    if user_message is None:
        return jsonify({"error": "No message provided"}), 400

    # Dapatkan prompt dasar dan tambahkan informasi pengguna
    system_prompt_template = PROMPTS[language]
    system_prompt_text = f"Your user's name is {user_name}. {system_prompt_template}"
    
    system_prompt = {'role': 'user', 'parts': [system_prompt_text]}
    
    full_history = [system_prompt] + history_from_frontend

    # Panggil core logic dengan riwayat yang sudah diformat
    message, emotion = get_yunita_response(user_message, full_history, language)

    response = {"message": message, "emotion": emotion}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8000)