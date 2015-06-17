/**
 * Created by Wayne on 6/17/2015.
 */

var app = {
    clock: undefined,
    selector: '#countdown',
    totalSeconds: 3,
    lastSeconds: 1
};
app.init = function () {
    app.clock = $(app.selector).FlipClock(app.totalSeconds, {
            clockFace: 'HourlyCounter',
            countdown: true,
            autoStart: false,
            callbacks: {
                interval: function () {
                    var time = this.factory.getTime().time;
                    if (time) {
                        app.playAudioInLastTenSeconds(time);
                    }
                }
            }
        }
    );
    app.bindEvent();
};

app.bindEvent = function () {
    $('#start').click(function () {
        app.clock.start();
    });
    $('#pause').click(function () {
        app.clock.stop();
    });
    $('#reset').click(function () {
        app.clock.reset();
    });
};

app.playAudioInLastTenSeconds = function (seconds) {
    var $audio = $('#lastSeconds')[0];
    console.log(seconds);

    if (seconds > app.lastSeconds)
        return;
    console.log('play');
    $audio.pause();
    $audio.currentTime = 0;
    $audio.play();
};

(function () {
    app.init();
})();