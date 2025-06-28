
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;
let source;
let loopStart = 5;
let loopEnd = 10;

// const loadButton = document.getElementById('load');
const startLoopButton = document.getElementById('startLoop');
const stopLoopButton = document.getElementById('stopLoop');

async function loadAudio(audiofilename) {
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    const response = await fetch(`./assets/${encodeURIComponent(audiofilename)}`);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

function startLoop() {
    if (!audioBuffer) {
        alert('Load audio first!');
        return;
    }

    loopStart = lehra_info.loopStart;
    loopEnd = lehra_info.loopEnd;

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.loopStart = loopStart;
    source.loopEnd = loopEnd;
    source.connect(audioContext.destination);
    source.start(0, loopStart);
}

function stopLoop() {
    if (source) {
        source.stop();
        source.disconnect();
    }
}

// loadButton.addEventListener('click', loadAudio);
startLoopButton.addEventListener('click', startLoop);
stopLoopButton.addEventListener('click', stopLoop);