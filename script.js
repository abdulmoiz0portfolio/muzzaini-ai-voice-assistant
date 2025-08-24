let isListening = false;
let isMuted = false;
let recognition;
let synthesis = window.speechSynthesis;
let currentUtterance = null;

const micBtn = document.getElementById('micBtn');
const muteBtn = document.getElementById('muteBtn');
const statusEl = document.getElementById('statusEl');
const questionEl = document.getElementById('questionEl');
const answerEl = document.getElementById('answerEl');
const loadingEl = document.getElementById('loadingEl');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');

// speech recognition setup
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
  recognition = new SpeechRecognition();
}

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    await handleQuestion(transcript);
  };

  recognition.onerror = (event) => {
    statusEl.textContent = "Error: " + event.error;
  };

  recognition.onend = () => {
    if (isListening) recognition.start();
  };
}

// dynamic response generator
async function generateText(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("time")) {
    return "The current time is " + new Date().toLocaleTimeString();
  }

  if (lower.includes("date") || lower.includes("day")) {
    return "Today is " + new Date().toDateString();
  }

  if (lower.match(/\d+ [\+\-\*\/] \d+/)) {
    try {
      const result = eval(lower);
      return "The answer is " + result;
    } catch {
      return "Sorry, I couldn't calculate that.";
    }
  }

  if (lower.includes("weather")) {
    return "I can’t check live weather yet, but I can be connected to an API.";
  }

  return "That's interesting! Could you ask me something else?";
}

// process question
async function handleQuestion(input) {
  questionText.textContent = input;
  questionEl.style.display = 'block';
  answerEl.style.display = 'none';
  loadingEl.style.display = 'flex';
  statusEl.textContent = "Generating answer...";

  try {
    const response = await generateText(input);
    answerText.textContent = response;
    answerEl.style.display = 'block';
    statusEl.textContent = "Ready";

    if (!isMuted) {
      speak(response);
    }
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  } finally {
    loadingEl.style.display = 'none';
  }
}

// speak with auto mic restart
function speak(text) {
  if (currentUtterance) {
    synthesis.cancel();
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.onend = () => {
    currentUtterance = null;
    if (isListening) recognition.start(); // reopen mic
  };
  synthesis.speak(currentUtterance);
}

// mic toggle
micBtn.onclick = () => {
  if (isListening) {
    recognition.stop();
    micBtn.textContent = "🎤 Start Listening";
    micBtn.style.background = "#007AFF";
    isListening = false;
  } else {
    recognition.start();
    micBtn.textContent = "⏹️ Stop Listening";
    micBtn.style.background = "#d32f2f";
    isListening = true;
  }
  muteBtn.style.display = "inline-block";
};

// mute toggle
muteBtn.onclick = () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
  if (currentUtterance) synthesis.cancel();
};

// text input handler
sendBtn.onclick = () => {
  const val = textInput.value.trim();
  if (val) {
    handleQuestion(val);
    textInput.value = "";
  }
};
