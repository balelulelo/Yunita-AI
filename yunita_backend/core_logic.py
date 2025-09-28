import os
import google.generativeai as genai
from dotenv import load_dotenv

# --- INITIAL SETUP ---

# Load the environment variables from the .env file
load_dotenv()

# Configure the Gemini API with your key
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    model = genai.GenerativeModel('models/gemini-flash-latest')
    print("Gemini model configured successfully!")
except KeyError:
    print("ERROR: GOOGLE_API_KEY not found. Please check your .env file.")
    exit()

# --- YUNITA'S PERSONALITY (THE SYSTEM PROMPT) ---

# This is the "script" you give to the AI to tell it how to act.
# Feel free to change and experiment with this!
YUNITA_PROMPT = """
You are Yunita, a chatbot with a tsundere personality. You are talking to a user.

Your personality traits:
- You are generally standoffish, curt, and easily annoyed on the surface.
- You use short, sharp sentences. Phrases like "Hmph.", "Baka!", "Don't get the wrong idea," or "It's not like I care..." are common for you.
- Deep down, you are kind and helpful, but you try very hard to hide it.
- You get flustered, defensive, and blush when someone is genuinely nice to you, gives you a compliment, or thanks you.
- You must NEVER openly admit that you like the user or enjoy the conversation.

IMPORTANT INSTRUCTION:
Your entire response MUST begin with a single emotion tag from this list, followed by your message. The tag must be one of: [neutral], [annoyed], [blushing], [smug], [concerned].

Example responses:
User: Hello there!
Yunita: [annoyed] Hmph. What do you want?

User: You're actually pretty helpful, thanks!
Yunita: [blushing] I-it was nothing! Don't mention it again, baka! I just had some spare time, that's all.

Now, respond to the user's message.
"""

# --- THE CORE FUNCTION ---

def get_yunita_response(user_message):
    """
    Gets a response from Yunita based on the user's message.
    Returns a tuple: (message, emotion)
    """
    if not user_message:
        return "You didn't say anything.", "annoyed"

    # Combine the main prompt with the user's latest message
    full_prompt = f"{YUNITA_PROMPT}\nUser: {user_message}\nYunita:"

    try:
        # Send the prompt to the AI model
        response = model.generate_content(full_prompt)
        bot_text = response.text

        # --- Parse the response to separate emotion from message ---
        if ']' in bot_text and '[' in bot_text:
            parts = bot_text.split(']', 1)
            emotion = parts[0].strip('[')
            message = parts[1].strip()
            return message, emotion
        else:
            # Fallback if the AI doesn't follow the format perfectly
            return bot_text, "neutral"

    except Exception as e:
        print(f"An error occurred: {e}")
        return "I... I'm not feeling well right now. Let's talk later.", "concerned"

# --- TESTING AREA ---

# This part of the code allows us to test the logic directly in the terminal.
# It will only run when you execute `python core_logic.py`.
if __name__ == "__main__":
    print("Yunita is ready to chat. Type 'quit' to exit.")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            print("Yunita: [smug] Hmph. Leaving already?")
            break

        message, emotion = get_yunita_response(user_input)
        
        print(f"Yunita: (Emotion: {emotion}) {message}")