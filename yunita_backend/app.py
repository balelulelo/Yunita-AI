from flask import Flask, request, jsonify
from flask_cors import CORS
from core_logic import get_yunita_response, PROMPTS # Import the new PROMPTS dictionary

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    history = data.get('history', [])
    language = data.get('language', 'en') # Get language from frontend, default to 'en'

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Choose the correct initial greeting based on language
    initial_greeting = {
        "en": "[neutral] Hmph. You're here. What do you want?",
        "id": "[neutral] Hmph. Kamu di sini. Mau apa?"
    }

    # Format the history with the correct system prompt for the selected language
    formatted_history = [
        {'role': 'user', 'parts': [PROMPTS[language]]},
        {'role': 'model', 'parts': [initial_greeting[language]]}
    ]
    for item in history:
        role = 'model' if item['sender'] == 'yunita' else 'user'
        formatted_history.append({'role': role, 'parts': [item['text']]})

    message, emotion = get_yunita_response(user_message, formatted_history, language)

    response = {"message": message, "emotion": emotion}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8000)