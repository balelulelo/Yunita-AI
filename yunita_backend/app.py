from flask import Flask, request, jsonify
from flask_cors import CORS
from core_logic import get_yunita_response # We are importing our "brain"

# 1. Create the Flask App
app = Flask(__name__)

# 2. Add CORS permission for the website to talk to the server
# This allows requests from any origin (*).
CORS(app)

# 3. Define the API endpoint for the chat
# This creates a URL like your-server.com/chat
@app.route('/chat', methods=['POST'])
def chat():
    # Get the user's message from the incoming request
    user_message = request.json['message']

    # Make sure a message was actually sent
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Get Yunita's response by calling our core logic function
    message, emotion = get_yunita_response(user_message)

    # Package the response in a JSON format and send it back
    response = {
        "message": message,
        "emotion": emotion
    }
    return jsonify(response)

# This part is for running the app locally for testing
if __name__ == '__main__':
    app.run(debug=True, port=5000)