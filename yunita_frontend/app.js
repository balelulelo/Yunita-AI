// --- 1. GET references to our HTML elements ---
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const yunitaImage = document.getElementById('yunita-image');

// The URL where our Flask backend is running
const backendUrl = 'http://127.0.0.1:8000/chat';

// --- 2. The core function to handle sending a message ---
async function sendMessage() {
    const message = userInput.value.trim();

    // If there's no message, do nothing
    if (!message) {
        return;
    }

    // Display the user's message in the chat log
    appendMessage('user', message);

    // Clear the input field and disable it while waiting for a response
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    try {
        // --- 3. Send the message to the Flask backend ---
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        // Check if the server responded correctly
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // --- 4. Display Yunita's response and update her image ---
        appendMessage('yunita', data.message);
        updateYunitaImage(data.emotion);

    } catch (error) {
        console.error("Error fetching from backend:", error);
        // Display an error message in the chat if something goes wrong
        appendMessage('yunita', "Hmph. I'm having trouble connecting... Check the console for errors.");
        updateYunitaImage('annoyed'); // Show an annoyed face for errors
    } finally {
        // Re-enable the input field and button after getting a response
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus(); // Put the cursor back in the input box
    }
}

// --- 5. Helper function to add messages to the chat log ---
function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'yunita-message');
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);

    // Automatically scroll to the newest message
    chatLog.scrollTop = chatLog.scrollHeight;
}

// --- 6. Helper function to change Yunita's image ---
function updateYunitaImage(emotion) {
    // Make sure you have images named 'neutral.png', 'annoyed.png', etc. in your images folder!
    const validEmotions = ['neutral', 'annoyed', 'blushing', 'smug', 'concerned'];
    if (validEmotions.includes(emotion)) {
        yunitaImage.src = `images/${emotion}.png`;
    } else {
        yunitaImage.src = 'images/neutral.png'; // Default to neutral if emotion is unknown
    }
}


// --- 7. Set up event listeners ---
// Allow sending message by clicking the button
sendBtn.addEventListener('click', sendMessage);

// Allow sending message by pressing "Enter" in the input field
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Add a welcoming message when the page loads
window.onload = () => {
    appendMessage('yunita', "Hmph. You're here. What do you want?");
};