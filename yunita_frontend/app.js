// --- 1. GET references to our HTML elements ---
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const yunitaImage = document.getElementById('yunita-image');
const connectionStatus = document.getElementById('connection-status');
const langEnBtn = document.getElementById('lang-en');
const langIdBtn = document.getElementById('lang-id');
const mainMenuOverlay = document.getElementById('main-menu-overlay');
const nameInput = document.getElementById('name-input');
const startChatBtn = document.getElementById('start-chat-btn');
const loadingScreen = document.getElementById('loading-screen');
const appContainer = document.getElementById('app-container');

const backendUrl = 'http://127.0.0.1:8000/chat';

// --- State variables ---
let chatHistory = [];
let currentLanguage = 'en';
let userName = 'User';

// --- Core function to send a message ---
async function sendMessage() {
    const messageText = userInput.value.trim();
    if (messageText) {
        appendMessage('user', messageText);
        chatHistory.push({ "role": "user", "parts": [messageText] });
    }

    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;

    try {
        const historyToSend = messageText ? chatHistory.slice(0, -1) : chatHistory;
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: messageText,
                history: historyToSend,
                language: currentLanguage,
                userName: userName
            }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        updateConnectionStatus(true);
        const data = await response.json();

        for (const msg of data.messages) {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 700 + 300));
            appendMessage('yunita', msg);
            chatHistory.push({ "role": "model", "parts": [msg] });
        }
        updateYunitaImage(data.emotion);

    } catch (error) {
        console.error("Error fetching from backend:", error);
        const errorMsg = "Oh, sorry, there seems to be a connection issue...";
        appendMessage('yunita', errorMsg);
        updateYunitaImage('concerned');
        updateConnectionStatus(false);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// --- Helper Functions ---
function appendMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'yunita-message');
    messageElement.textContent = text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function updateYunitaImage(emotion) {
    const validEmotions = ['neutral', 'happy', 'blushing', 'concerned', 'curious'];
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

// --- Application Flow Functions ---
function startNewChat(lang) {
    currentLanguage = lang;
    chatLog.innerHTML = '';
    
    langEnBtn.classList.toggle('active', lang === 'en');
    langIdBtn.classList.toggle('active', lang === 'id');
    userInput.placeholder = lang === 'id' ? `Katakan sesuatu pada ${userName}...` : `Say something to ${userName}...`;

    const initialMessage = lang === 'id' 
        ? `Halo, ${userName}! Senang bertemu denganmu. Ada yang bisa aku bantu?` 
        : `Hello, ${userName}! It's so nice to see you. What can I help you with?`;
        
    appendMessage('yunita', initialMessage);
    chatHistory = [{ "role": "model", "parts": [initialMessage] }];
}

function transitionToApp() {
    mainMenuOverlay.style.opacity = 0;
    setTimeout(() => {
        mainMenuOverlay.style.display = 'none';
        loadingScreen.classList.remove('hidden');
        
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            appContainer.classList.remove('hidden');
            appContainer.classList.add('visible');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);

            userInput.focus();
        }, 2500);
    }, 500);
}

// --- Event Listeners ---
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});

langEnBtn.addEventListener('click', () => startNewChat('en'));
langIdBtn.addEventListener('click', () => startNewChat('id'));

startChatBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        userName = name;
        startNewChat('en');
        transitionToApp();
    } else {
        alert("Please enter your name!");
    }
});

window.onload = () => {
    nameInput.focus();
};