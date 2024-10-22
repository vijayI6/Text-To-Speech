let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    if (voices.length === 0) {
        voices = window.speechSynthesis.getVoices();

        voiceSelect.innerHTML = '';
        voices.forEach((voice, i) => {
            let option = document.createElement("option");
            option.value = i;
            option.text = voice.name;
            voiceSelect.appendChild(option);
        });


        let defaultVoiceIndex = voices.findIndex(voice => voice.name.includes("Google US English"));
        if (defaultVoiceIndex !== -1) {
            speech.voice = voices[defaultVoiceIndex];
            voiceSelect.selectedIndex = defaultVoiceIndex;
        } else {
            speech.voice = voices[0];
        }
    }
};

document.querySelector("button").addEventListener("click", () => {

    if (voices.length > 0) {
        speech.text = document.querySelector("textarea").value;
        speech.voice = voices[voiceSelect.value];
        window.speechSynthesis.speak(speech);
    } else {
        console.error("Voices are still loading, please try again.");
    }
});
