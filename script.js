javascript
function sayHello() {
  alert("Hello!");
}
 - Confirm mobile browsers support it:
     javascript
     if ('speechSynthesis' in window) {
       // safe to use
     } else {
       alert("Speech synthesis not supported on this browser.");
     }
- Add this after user interaction:
     javascript
     const context = new AudioContext();
     if (context.state === 'suspended') {
       context.resume();
     }
- Wrap speech trigger inside a button or event listener like:
     javascript
     document.getElementById("speakBtn").addEventListener("click", () => {
       speak("Hello from AI assistant");
     });
<script>
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false; // We will restart manually after each result

    function speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        // After speaking finishes, start listening again
        recognition.start();
      };
      speechSynthesis.speak(utterance);
    }

    recognition.onresult = (event) => {
      const userInput = event.results[0][0].transcript;
      console.log("User said:", userInput);

      // Process the input (replace this with your AI logic)
      const response = "You said: " + userInput;

      speak(response);  // Speak the response and restart listening after done
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      // Optionally restart listening on error
      recognition.start();
    };

    // Start listening when mic button is clicked
    document.getElementById("micBtn").addEventListener("click", () => {
      recognition.start();
    });
  </script>
</body>
</html>
