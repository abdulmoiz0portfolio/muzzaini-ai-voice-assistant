// Replace the generateText function with this one:
async function generateText(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    // 1. Check for time
    if (lowerPrompt.includes("time")) {
        const now = new Date();
        return "The current time is " + now.toLocaleTimeString();
    }

    // 2. Check for date
    if (lowerPrompt.includes("date") || lowerPrompt.includes("day")) {
        const today = new Date();
        return "Today is " + today.toDateString();
    }

    // 3. Check for weather (example, requires API if real data)
    if (lowerPrompt.includes("weather")) {
        return "I can't check real-time weather yet, but I can add it with an API like OpenWeather.";
    }

    // 4. Simple math questions (basic calculator)
    if (lowerPrompt.match(/\d+ [\+\-\*\/] \d+/)) {
        try {
            const result = eval(lowerPrompt); // ⚠️ careful: eval() is unsafe in real apps!
            return "The answer is " + result;
        } catch {
            return "Sorry, I couldn't calculate that.";
        }
    }

    // 5. Default fallback (if nothing matched)
    return "I’m not sure about that yet, but I’m learning!";
}
