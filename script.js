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
