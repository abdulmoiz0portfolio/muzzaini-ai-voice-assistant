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
