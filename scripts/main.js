function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`button[data-key="${e.keyCode}"]`);
    if (!audio) return;
    key.classList.add('key--playing');
    audio.currentTime = 0;
    audio.play();
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('key--playing');
}

const keys = Array.from(document.querySelectorAll('.keys__item'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound);

const recordButton = document.querySelector('.record-panel__record-button');

(function () {
    let record = [];
    let isRecord = false;
    let lastSoundTime = 0;

    recordButton.addEventListener('click', (e) => {
        isRecord = !isRecord;
        if (isRecord) {
            recordButton.classList.remove('record-panel__record-button--play');
            recordButton.classList.add('record-panel__record-button--stop');
            startRecord();
        } else {
            recordButton.classList.remove('record-panel__record-button--stop');
            recordButton.classList.add('record-panel__record-button--play');
            stopRecord();
        }
    });

    function startRecord() {
        record = [];
        lastSoundTime = 0;
        window.addEventListener('keydown', addSound);
    }

    function stopRecord() {
        window.removeEventListener('keydown', addSound);
        console.log(record);
        playRecord();
    }

    function addSound(event) {
        let interval = 0;

        if (lastSoundTime) {
            interval = event.timeStamp - lastSoundTime;
        }
        lastSoundTime = event.timeStamp;

        record.push({ event, interval });
    }

    function playRecord() {
        let recordIndex = 0;

        playSounds();

        function playSounds() {
            if (recordIndex < record.length) {
                playSoundPromise(record[recordIndex++]).then(playSounds);
            }
        };

        function playSoundPromise(sound) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    playSound(sound.event);
                    resolve();
                }, sound.interval);
            });
        }
    }

}());