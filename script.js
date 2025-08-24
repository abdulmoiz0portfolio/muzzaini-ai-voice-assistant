// dynamic response generator
async function generateText(prompt) {
  const lower = prompt.toLowerCase();

  // Time
  if (lower.includes("time")) {
    return "The current time is " + new Date().toLocaleTimeString();
  }

  // Date
  if (lower.includes("date") || lower.includes("day")) {
    return "Today is " + new Date().toDateString();
  }

  // Math (basic)
  if (lower.match(/\d+ [\+\-\*\/] \d+/)) {
    try {
      const result = eval(lower); // ⚠️ simple demo only
      return "The answer is " + result;
    } catch {
      return "Sorry, I couldn't calculate that.";
    }
  }

  // Weather placeholder
  if (lower.includes("weather")) {
    return "I can’t check live weather yet, but you can add an API like OpenWeather.";
  }

  // Default
  return "That’s interesting! Could you ask me something else?";
}

// process question (from mic or text input)
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

// modify speak so mic auto reopens after AI finishes
function speak(text) {
  if (currentUtterance) {
    synthesis.cancel();
  }
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.onend = () => {
    currentUtterance = null;
    if (!isListening) {  // restart mic after speaking
      toggleListening();
    }
  };
  synthesis.speak(currentUtterance);
}

// mic result handler
if (recognition) {
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    await handleQuestion(transcript);
  };
}

// text input handler
document.getElementById("sendBtn").onclick = () => {
  const val = document.getElementById("textInput").value.trim();
  if (val) {
    handleQuestion(val);
    document.getElementById("textInput").value = "";
  }
};
