/**
 * Created by Wayne on 6/17/2015.
 */

var app = {
    clock: undefined,
    selector: '#countdown',
    totalSeconds: 20,
    lastSeconds: 8,
    remainingSeconds: undefined
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
                    app.remainingSeconds = time;

                    // hack, ring last bell 1 second later
                    if (time == 1) {
                        setTimeout(function () {
                            var $audio = $('#finalTickSoundTrack')[0];
                            app.stopCurrentAudioAndPlayAgain($audio);
                        }, 1000);
                    }
                }
            }, stop: function () {
                app.applyPausedStyle();
            }
        }
    });
    app.bindEvents();
    app.applyPausedStyle();
};

app.bindEvents = function () {
    $('#startButton').click(function () {
        if (app.clock.running) {
            app.clock.stop();
            app.applyPausedStyle();
        }
        else {
            if (app.remainingSeconds <= 1) {
                app.clock.setTime(app.totalSeconds);
            }
            app.clock.start();
            app.applyRunningStyle();
        }
    });

    $('#resetButton').click(function () {
        app.clock.stop();
        app.clock.setTime(app.totalSeconds);
        app.applyPausedStyle();
    });

    $('#setTotalSeconds').click(function () {

        bootbox.prompt({
            title: "Set Total Seconds of clock",
            value: app.totalSeconds,
            callback: function (result) {
                if (result === null) {
                    //Example.show("Prompt dismissed");
                } else {
                    var parsedResult = parseInt(result);
                    if (parsedResult) {
                        app.totalSeconds = parsedResult;
                        app.clock.stop();
                        app.clock.setTime(app.totalSeconds);
                    }
                }
            }
        });
    });

    $('#setFinalSeconds').click(function () {
        bootbox.prompt({
            title: "Set Final Seconds of clock",
            value: app.totalSeconds,
            callback: function (result) {
                if (result === null) {
                    //Example.show("Prompt dismissed");
                }
                else {
                    var parsedResult = parseInt(result);
                    if (parsedResult) {
                        app.lastSeconds = parsedResult;
                        app.clock.stop();
                    }
                }
            }
        });
    });

};

app.applyRunningStyle = function () {
    if (!app.clock.running)
        return;

    $('#startButton').text('PAUSE')
    $('#resetButton').removeAttr('disabled');
    $('#advancedButtonsContainer').hide('fast');
    $('#resetButton').show('fast');
};

app.applyPausedStyle = function () {
    if (app.clock.running)
        return;

    $('#startButton').text('START');
    $('#resetButton').attr('disabled', 'disabled');
    $('#resetButton').hide('fast');
    $('#advancedButtonsContainer').show('fast');
};

app.playAudioInLastTenSeconds = function (seconds) {
    var $audio = $('#tickingSoundTrack')[0];
    if (seconds > app.lastSeconds)
        return;
    app.stopCurrentAudioAndPlayAgain($audio);
};

app.stopCurrentAudioAndPlayAgain = function ($audio) {
    $audio.pause();
    $audio.currentTime = 0;
    $audio.play();
};

(function () {
    app.init();
})();