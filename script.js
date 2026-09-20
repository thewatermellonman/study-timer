let seconds = 0;
let timerInterval = null;

const timer = document.querySelector(".timer");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");

function updateTimer() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    timer.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(remainingSeconds).padStart(2, "0");
}

startButton.addEventListener("click", function () {
    if (timerInterval === null) {
        timerInterval = setInterval(function () {
            seconds++;
            updateTimer();
        }, 1000);
    }
});

pauseButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
});

resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateTimer();
});