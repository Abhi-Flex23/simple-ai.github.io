// Define pre-defined responses and timers
const responses = {
    "hi": ["Hello!", "Hi there!", "Hey!"],
    "how are you?": ["I'm doing well, thank you!", "I'm great, thanks for asking!", "All good, how about you?"],
    "what's your name?": ["I'm just a simple AI chatbot.", "You can call me ChatBot.", "I'm an AI assistant."],
    "bye": ["Goodbye! Have a nice day.", "See you later!", "Take care!"]
};

const timers = {};

// Function to get response
async function getResponse(message) {
    const lowercaseMessage = message.toLowerCase();

    // Check if the message has a pre-defined response
    if (responses.hasOwnProperty(lowercaseMessage)) {
        const possibleResponses = responses[lowercaseMessage];
        return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    }

    // Check if the message is about setting a timer
    const timerMatch = message.match(/(?:make|set) (\d+) (seconds?|minutes?|hours?) timer/i);
    if (timerMatch) {
        const time = parseInt(timerMatch[1]);
        const unit = timerMatch[2].toLowerCase();
        const timerDuration = calculateTimerDuration(time, unit);
        if (timerDuration > 0) {
            setTimer(timerDuration);
            return `Timer set for ${time} ${unit}.`;
        }
    }

    // Check if the message is about World War I or World War II
    if (lowercaseMessage.includes("world war 1") || lowercaseMessage.includes("world war i")) {
        const worldWar1Info = await fetchWorldWarInfo("World_War_I");
        return worldWar1Info;
    }

    if (lowercaseMessage.includes("world war 2") || lowercaseMessage.includes("world war ii")) {
        const worldWar2Info = await fetchWorldWarInfo("World_War_II");
        return worldWar2Info;
    }

    // If no pre-defined response, timer command, or World War request, return a generic response
    return "I'm sorry, I don't understand that.";
}

// Function to fetch information about World War I or World War II from Wikipedia
async function fetchWorldWarInfo(worldWar) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${worldWar}`);
        const data = await response.json();

        if (data.extract) {
            return data.extract;
        } else {
            return "No information found for World War I or II.";
        }
    } catch (error) {
        console.error(`Error fetching information for ${worldWar}:`, error);
        return `Error fetching information for ${worldWar}.`;
    }
}

// Function to calculate timer duration in milliseconds
function calculateTimerDuration(time, unit) {
    let duration = 0;
    switch (unit) {
        case "second":
        case "seconds":
            duration = time * 1000;
            break;
        case "minute":
        case "minutes":
            duration = time * 60 * 1000;
            break;
        case "hour":
        case "hours":
            duration = time * 60 * 60 * 1000;
            break;
    }
    return duration;
}

// Function to set timer
function setTimer(duration) {
    const timerId = setTimeout(() => {
        displayMessage("bot", "Timer done!");
        delete timers[timerId];
    }, duration);
    timers[timerId] = true;
}

// Function to send message
async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();

    if (message !== "") {
        displayMessage("user", message);

        const response = await getResponse(message);

        setTimeout(() => {
            displayMessage("bot", response);
        }, 500);

        userInput.value = "";
    }
}

// Function to display message in the chat box
function displayMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message", sender);
    messageElement.innerText = message;

    chatBox.appendChild(messageElement);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}