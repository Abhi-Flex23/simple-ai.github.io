// Define pre-defined responses and timers
const responses = {
    "Hi": ["Hello!", "Hi there!", "Hey!"],
    "how are you?": ["I'm doing well, thank you!", "I'm great, thanks for asking!", "All good, how about you?"],
    "hru": ["I'm doing well, thank you!", "I'm great, thanks for asking!", "All good, how about you?"],
    "How are you?": ["I'm doing well, thank you!", "I'm great, thanks for asking!", "All good, how about you?"],
    "what's your name?": ["I'm just a simple AI chatbot.", "You can call me ChatBot.", "I'm an AI assistant."],
    "bye": ["Goodbye! Have a nice day.", "See you later!", "Take care!"],
    "how to make pizza?": ["To make a pizza, you will need dough, tomato sauce, cheese, and your choice of toppings. Here's a simple recipe:\n1. Preheat your oven to 475°F (245°C).\n2. Roll out the dough on a floured surface to your desired thickness.\n3. Spread tomato sauce evenly over the dough, leaving a small border around the edges.\n4. Sprinkle shredded cheese over the sauce.\n5. Add your favorite toppings, such as pepperoni, mushrooms, onions, or bell peppers.\n6. Bake in the preheated oven for 12-15 minutes, or until the crust is golden brown and the cheese is bubbly and melted.\n7. Remove from the oven, let it cool for a few minutes, then slice and enjoy!"],
};


const timers = {};

// Function to get response
async function getResponse(message) {
    const lowercaseMessage = message.toLowerCase();

    // Check if the message has a pre-defined response
    if (responses.hasOwnProperty(lowercaseMessage)) {
        const possibleResponses = responses[lowercaseMessage];
        if (Array.isArray(possibleResponses)) {
            return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
        } else {
            return possibleResponses;
        }
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