let isListening = false;
let isMuted = false;
let recognition;
let synthesis = window.speechSynthesis;
let currentUtterance = null;

const micBtn = document.getElementById("micBtn");
const muteBtn = document.getElementById("muteBtn");
const statusEl = document.getElementById("statusEl");
const questionEl = document.getElementById("questionEl");
const answerEl = document.getElementById("answerEl");
const loadingEl = document.getElementById("loadingEl");
const questionText = document.getElementById("questionText");
const answerText = document.getElementById("answerText");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");

// Initialize speech recognition
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
} else if ("SpeechRecognition" in window) {
  recognition = new SpeechRecognition();
}

if (recognition) {
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    await handleQuestion(transcript);
  };

  recognition.onend = () => {
    if (isListening) recognition.start(); // auto restart mic
  };
}

async function handleQuestion(input) {
  questionText.textContent = input;
  questionEl.style.display = "block";
  answerEl.style.display = "none";
  loadingEl.style.display = "flex";
  statusEl.textContent = "Thinking...";

  try {
    const response = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await response.json();
    answerText.textContent = data.answer;
    answerEl.style.display = "block";
    statusEl.textContent = "Ready";

    if (!isMuted) {
      speak(data.answer);
    }
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  } finally {
    loadingEl.style.display = "none";
  }
}

function speak(text) {
  if (currentUtterance) synthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.onend = () => {
    currentUtterance = null;
    if (isListening) recognition.start();
  };

  synthesis.speak(currentUtterance);
}

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

muteBtn.onclick = () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
  if (currentUtterance) synthesis.cancel();
};

sendBtn.onclick = () => {
  const val = textInput.value.trim();
  if (val) {
    handleQuestion(val);
    textInput.value = "";
  }
};
