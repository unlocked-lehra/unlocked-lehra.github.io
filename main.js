let player;

window.addEventListener('DOMContentLoaded', function () {
    var instrumentSelect = document.getElementById('instrument_selector');
    var taalSelect = document.getElementById('taal_selector');
    var raagSelect = document.getElementById('raag_selector');
    var bpmSelect = document.getElementById('bpm_selector');
    instrumentSelect.innerHTML = '';
    if (typeof plist === 'object') {
        var keys = Object.keys(plist);
        keys.forEach(function (key) {
            var option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            instrumentSelect.appendChild(option);
        });
        if (keys.length > 0) {
            instrumentSelect.value = keys[0];
        }
        populateTaalSelector(instrumentSelect.value);
    }
    function populateTaalSelector(instrument) {
        taalSelect.innerHTML = '';
        if (plist[instrument] && plist[instrument]['Taals']) {
            var taalKeys = Object.keys(plist[instrument]['Taals']);
            taalKeys.forEach(function (taal) {
                var option = document.createElement('option');
                option.value = taal;
                option.textContent = taal;
                taalSelect.appendChild(option);
            });
            if (taalKeys.length > 0) {
                taalSelect.value = taalKeys[0];
                populateRaagSelector(instrument, taalKeys[0]);
            }
        }
    }
    function populateRaagSelector(instrument, taal) {
        raagSelect.innerHTML = '';
        if (plist[instrument] && plist[instrument]['Taals'] && plist[instrument]['Taals'][taal] && plist[instrument]['Taals'][taal]['Raags']) {
            var raagKeys = Object.keys(plist[instrument]['Taals'][taal]['Raags']);
            raagKeys.forEach(function (raag) {
                var option = document.createElement('option');
                option.value = raag;
                option.textContent = raag;
                raagSelect.appendChild(option);
            });
            if (raagKeys.length > 0) {
                raagSelect.value = raagKeys[0];
                populateBpmSelector(instrument, taal, raagSelect.value);
            }
        }
    }
    function populateBpmSelector(instrument, taal, raag) {
        bpmSelect.innerHTML = '';
        var tempos = [];
        if (
            plist[instrument] &&
            plist[instrument]['Taals'] &&
            plist[instrument]['Taals'][taal] &&
            plist[instrument]['Taals'][taal]['Raags'] &&
            plist[instrument]['Taals'][taal]['Raags'][raag] &&
            Array.isArray(plist[instrument]['Taals'][taal]['Raags'][raag]['Tempos'])
        ) {
            tempos = plist[instrument]['Taals'][taal]['Raags'][raag]['Tempos'];
        } else if (
            plist[instrument] &&
            plist[instrument]['Taals'] &&
            plist[instrument]['Taals'][taal] &&
            Array.isArray(plist[instrument]['Taals'][taal]['Tempos'])
        ) {
            tempos = plist[instrument]['Taals'][taal]['Tempos'];
        }
        tempos.forEach(function (bpm) {
            var option = document.createElement('option');
            option.value = bpm;
            option.textContent = bpm;
            bpmSelect.appendChild(option);
        });
        if (tempos.length > 0) {
            bpmSelect.value = tempos[0];
        }
    }
    instrumentSelect.addEventListener('change', function () {
        populateTaalSelector(instrumentSelect.value);
        start_playing();
    });
    taalSelect.addEventListener('change', function () {
        populateRaagSelector(instrumentSelect.value, taalSelect.value);
        start_playing();
    });
    raagSelect.addEventListener('change', function () {
        populateBpmSelector(instrumentSelect.value, taalSelect.value, raagSelect.value);
        start_playing();
    });
    bpmSelect.addEventListener('change', function () {
        start_playing();
    });
});

const start_playing = async () => {
    if (player !== undefined) player.stop();
    let ins = document.getElementById('instrument_selector').value;
    let taal = document.getElementById('taal_selector').value;
    let raag = document.getElementById('raag_selector').value;
    let bpm = document.getElementById("bpm_selector").value;
    bpm = parseInt(bpm, 10);

    let filename = plist[ins]['Taals'][taal]['Raags'][raag]['FileName'].replace(/_%@.wav$/, '.aac');
    let tempos = plist[ins]['Taals'][taal]['Raags'][raag]['Tempos'] || plist[ins]['Taals'][taal]['Tempos'];
    tempos = tempos.map(x => parseInt(x, 10))
    let beats = plist[ins]['Taals'][taal]['Beats']

    let cumulative = 0;
    const timings = tempos.map(x => 60 * beats / x).map(num => cumulative += num);
    timings.unshift(0);

    idx = tempos.indexOf(bpm);
    // console.log(filename, tempos, beats, bpm, idx);
    player = new WebAudioLoopWrapper(filename, timings[idx], timings[idx + 1], 1)
    await player.load();
    player.play();
}

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
startButton.addEventListener('click', start_playing);
stopButton.addEventListener("click", () => {
    if (player !== undefined) player.stop();
});