from flask import Flask, request, jsonify
from flask_cors import CORS
from core_logic import get_yunita_response, PROMPTS

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '') # Default ke string kosong jika tidak ada
    history_from_frontend = data.get('history', []) 
    language = data.get('language', 'en')
    user_name = data.get('userName', 'User')

    # Jika pesan kosong, beri prompt khusus agar Yunita melanjutkan percakapan
    if not user_message.strip():
        if language == 'id':
            user_message = "..." # Prompt untuk melanjutkan dalam Bahasa Indonesia
        else:
            user_message = "..." # Prompt to continue in English

    # Dapatkan prompt dasar dan tambahkan informasi pengguna
    system_prompt_template = PROMPTS[language]
    system_prompt_text = f"Your user's name is {user_name}. {system_prompt_template}"
    
    system_prompt = {'role': 'user', 'parts': [system_prompt_text]}
    
    full_history = [system_prompt] + history_from_frontend

    # ... (di dalam fungsi chat di app.py)
    message, emotion = get_yunita_response(user_message, full_history, language)

    # Pisahkan pesan jika ada simbol '||'
    messages = [m.strip() for m in message.split('||')]

    response = {"messages": messages, "emotion": emotion} # Ubah 'message' menjadi 'messages'
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8000)