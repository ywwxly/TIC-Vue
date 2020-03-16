// Sound meter is used to detect speaker
function SoundMeter(opts) {
    var that = this;
    this.context = null
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = opts.audioContext || new AudioContext();
    } catch (e) {
      console.error('Web Audio API not supported.');
    }
    if( !this.context ) return
    this.volume = 0.0;
    this.slow_volume = 0.0;
    this.clip = 0.0;
    // Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384)
    this.script = this.context.createScriptProcessor(256, 1, 1);
    this.count = 0;
    this.script.onaudioprocess = function(event) {
        if( !opts.onprocess ) return;
        var input = event.inputBuffer.getChannelData(0);
        var i;
        var sum = 0.0;
        var clipcount = 0;
        for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
            if (Math.abs(input[i]) > 0.99) {
                clipcount += 1;
            }
        }
        that.volume = Math.sqrt(sum / input.length);
        var volume = that.volume.toFixed(2);
        if (opts.onprocess && (that.count++%30) ===0) {
            opts.onprocess({
                volume: volume,
                status: volume >= .1 ? "speaking" : "silence",
                event: event
            });
        }
    };
    this.connectToSource( opts.stream );
}

SoundMeter.prototype.connectToSource = function(stream) {
    if( !this.context ) return
    if( stream ){
        this.mic = this.context.createMediaStreamSource(stream);
        this.mic.connect(this.script);
        this.script.connect(this.context.destination);
    }
};

SoundMeter.prototype.stop = function() {
    this.disconnect();
    if( this.context ){
        this.context.close();
        this.context = null;
    }
};
SoundMeter.prototype.disconnect = function() {
    if( !this.context ) return
    this.mic.disconnect();
    this.script.disconnect();
};



module.exports = SoundMeter;