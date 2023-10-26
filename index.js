// Grab element with id #mic, you could use getElementById
const mic_btn = document.querySelector("#mic");
// Grab element with class .playback
const playback = document.querySelector(".playback");

//add Event listener for when the element with #mic is clicked, performs ToggleMic function upon click
mic_btn.addEventListener("click", ToggleMic);

// Initialize if mic is allowed to record
let can_record = false;
// Initializes so mic is not recording upon start
let is_recording = false;
// Initializes recorder to be doing nothing at the beginning
let recorder = null;
// Initializes chunks of data
let chunks = [];

function SetupAudio() {
    // console.log("Setup")
    // checks if user has media devices
    // For more info: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
        // getUserMedia asks user for permission, in this case for audio device (microphone access)
            .getUserMedia({
                audio: true
            })
            .then(SetupStream)
            .catch(err => {
                console.error(err)
            })
    }
}

function SetupStream(stream) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    }

    recorder.onstop = (e) => {
        const blob = new Blob(chunks, { type: "audio/mp3 codecs=opus" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        playback.src = audioURL;

        const downloadLink = document.getElementById('download');
        downloadLink.href = audioURL;
        downloadLink.download = 'audio.mp3';
    }
    can_record = true;
}

function ToggleMic() {
    if (!can_record) return;
    is_recording = !is_recording;

    if (is_recording) {
        recorder.start();

        // to make it animate
        mic_btn.classList.add("is-recording");
    } else {
        recorder.stop();
        mic_btn.classList.remove("is-recording");
    }
}
SetupAudio();