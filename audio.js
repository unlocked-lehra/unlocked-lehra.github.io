class WebAudioLoopWrapper {
    constructor(filename, startTime = 0, endTime = null, speed = 1.0) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = null;
        this.buffer = null;
        this.filename = filename;
        this.startTime = startTime;
        this.endTime = endTime;
        this.speed = speed;
    }

    async load() {
        const fname = `./assets/${encodeURIComponent(this.filename)}`
        const response = await fetch(fname);
        const arrayBuffer = await response.arrayBuffer();
        this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Default to buffer duration if endTime isn't set or is too large
        if (!this.endTime || this.endTime > this.buffer.duration) {
            this.endTime = this.buffer.duration;
        }
    }

    play() {
        this.stop(); // In case something is already playing

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.playbackRate.value = this.speed;

        this.source.loop = true;
        this.source.loopStart = this.startTime;
        this.source.loopEnd = this.endTime;

        this.source.connect(this.audioContext.destination);
        this.source.start(0, this.startTime); // Start from loopStart
    }

    stop() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }
    }
}
