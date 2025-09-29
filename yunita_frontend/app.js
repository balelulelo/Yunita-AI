// --- 1. GET references to our HTML elements ---
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const yunitaImage = document.getElementById('yunita-image');
const connectionStatus = document.getElementById('connection-status');
const langEnBtn = document.getElementById('lang-en'); // NEW
const langIdBtn = document.getElementById('lang-id'); // NEW

const backendUrl = 'http://127.0.0.1:8000/chat';

// --- NEW: State variables for history and language ---
let chatHistory = [];
let currentLanguage = 'en'; // Default to English

// --- 2. The core function to handle sending a message ---
async function sendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    appendMessage('user', messageText);
    chatHistory.push({ sender: 'user', text: messageText });

    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: messageText,
                history: chatHistory,
                language: currentLanguage // NEW: Send the current language
            }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        updateConnectionStatus(true);
        const data = await response.json();

        appendMessage('yunita', data.message);
        chatHistory.push({ sender: 'yunita', text: data.message });
        updateYunitaImage(data.emotion);

    } catch (error) {
        console.error("Error fetching from backend:", error);
        const errorMsg = currentLanguage === 'id' ? "Hmph. Aku kesulitan terhubung..." : "Hmph. I'm having trouble connecting...";
        appendMessage('yunita', errorMsg);
        updateYunitaImage('annoyed');
        updateConnectionStatus(false);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// --- Helper functions (appendMessage, updateYunitaImage, updateConnectionStatus) remain the same ---

function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'yunita-message');
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function updateYunitaImage(emotion) {
    const validEmotions = ['neutral', 'annoyed', 'blushing', 'smug', 'concerned'];
    if (validEmotions.includes(emotion)) {
        yunitaImage.src = `images/${emotion}.png`;
    } else {
        yunitaImage.src = 'images/neutral.png';
    }
}

function updateConnectionStatus(isOnline) {
    if (isOnline) {
        connectionStatus.textContent = 'Online';
        connectionStatus.classList.remove('offline');
        connectionStatus.classList.add('online');
    } else {
        connectionStatus.textContent = 'Offline';
        connectionStatus.classList.remove('online');
        connectionStatus.classList.add('offline');
    }
}


// --- NEW: Function to handle language change ---
function setLanguage(lang) {
    currentLanguage = lang;
    
    // Update button styles
    langEnBtn.classList.toggle('active', lang === 'en');
    langIdBtn.classList.toggle('active', lang === 'id');

    // Update UI text
    userInput.placeholder = lang === 'id' ? "Katakan sesuatu..." : "Say something...";

    // Clear chat and reset history for a new conversation
    chatLog.innerHTML = '';
    const initialMessage = lang === 'id' ? "Hmph. Kamu di sini. Mau apa?" : "Hmph. You're here. What do you want?";
    appendMessage('yunita', initialMessage);
    chatHistory = [{ sender: 'yunita', text: initialMessage }];
}

// --- Event Listeners ---
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

// NEW: Event listeners for language buttons
langEnBtn.addEventListener('click', () => setLanguage('en'));
langIdBtn.addEventListener('click', () => setLanguage('id'));


window.onload = () => {
    // Set the initial state
    setLanguage('en'); 

    // Check connection status
    fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '', language: currentLanguage }),
    }).then(res => updateConnectionStatus(res.ok))
      .catch(() => updateConnectionStatus(false));
};