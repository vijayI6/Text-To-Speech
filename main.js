let speech = new SpeechSynthesisUtterance();
let voices = [];
let speedRange = document.querySelector("#speedRange");
let speedValue = document.querySelector("#speedValue");
let isSpeaking = false;
let currentText = "";
let sentences = [];
let currentSentenceIndex = 0;

function populateVoices() {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    let defaultVoice = voices.find(voice => voice.name.includes("Google US English")) || voices[0];
    speech.voice = defaultVoice;
}


populateVoices();
window.speechSynthesis.onvoiceschanged = populateVoices;

function speakSentence(index = 0) {
    if (voices.length === 0 || index >= sentences.length) return;

    window.speechSynthesis.cancel();

    speech.text = sentences[index];
    speech.rate = parseFloat(speedRange.value);

    speech.onend = () => {
        if (index + 1 < sentences.length) {
            currentSentenceIndex = index + 1;
            isSpeaking = true;
            setTimeout(() => {
                window.speechSynthesis.resume();
                speakSentence(currentSentenceIndex);
            }, 50);
        } else {
            isSpeaking = false;
        }
    };

    currentSentenceIndex = index;
    isSpeaking = true;
    window.speechSynthesis.speak(speech);
}

speedRange.addEventListener("input", () => {
    let speed = parseFloat(speedRange.value);
    speedValue.textContent = speed + "x";

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        speakSentence(currentSentenceIndex);
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
