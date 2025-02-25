let speech = new SpeechSynthesisUtterance();
let voices = [];
let speedRange = document.querySelector("#speedRange");
let speedValue = document.querySelector("#speedValue");
let isSpeaking = false;
let currentText = "";
let sentences = [];
let currentSentenceIndex = 0;

// Load voices and select "Google US English"
function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    let defaultVoice = voices.find(voice => voice.name.includes("Google US English")) || voices[0];
    speech.voice = defaultVoice;
}

// Ensure voices are loaded
window.speechSynthesis.onvoiceschanged = populateVoices;
if (window.speechSynthesis.getVoices().length > 0) {
    populateVoices();
}

// Function to start speech from a given sentence
function speakSentence(index = 0) {
    if (voices.length === 0 || index >= sentences.length) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    speech.text = sentences[index];
    speech.rate = parseFloat(speedRange.value);
    
    speech.onboundary = () => {
        currentSentenceIndex = index;
    };

    speech.onend = () => {
        if (currentSentenceIndex + 1 < sentences.length) {
            speakSentence(currentSentenceIndex + 1); // Speak next sentence
        } else {
            isSpeaking = false;
            currentSentenceIndex = 0;
        }
    };

    isSpeaking = true;
    window.speechSynthesis.speak(speech);
}

// Handle speed change dynamically
speedRange.addEventListener("input", () => {
    let speed = parseFloat(speedRange.value);
    speedValue.textContent = speed + "x";

    if (isSpeaking) {
        speakSentence(currentSentenceIndex); // Restart from the last spoken sentence
    } else {
        speech.rate = speed;
    }
});

document.querySelector("button").addEventListener("click", () => {
    let text = document.querySelector("textarea").value.trim();
    if (text.length === 0) {
        console.warn("No text to read.");
        return;
    }

    currentText = text;
    sentences = text.match(/[^.!?]+[.!?]*/g) || [text]; // Split into sentences
    currentSentenceIndex = 0;
    speakSentence(0);
});
