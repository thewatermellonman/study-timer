let seconds = Number(localStorage.getItem("seconds")) || 0;
let timerInterval = null;
let studyTime = Number(localStorage.getItem("studyTime")) || 0;
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

const timer = document.querySelector(".timer");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");

const subjectSelect = document.querySelector("#subjectSelect");
const addSubjectButton = document.querySelector("#addSubjectButton");

addSubjectButton.addEventListener("click", function () {
    const subject = prompt("What are you studying?");

    if (subject === null) {
        return;
    }

    if (subject.trim() === "") {
        alert("Subject cannot be empty.");
        return;
    }

    const cleanSubject = subject.trim();
    if(subjects.includes(cleanSubject)) {
        alert("Subject already exists.");
        return;
    }
    subjects.push(cleanSubject);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
});

function displaySubjects() {
    subjectSelect.innerHTML = 'option value="">Select a subject</option>';
    subjects.forEach(function (subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
}

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
    if (subjectSelect.value === "") {
        alert("choose a subject first");
        return;
    }
    if (timerInterval === null) {
        timerInterval = setInterval(function () {
            seconds++;
            localStorage.setItem("seconds", seconds);
            updateTimer();
        }, 1000);
    }
});

pauseButton.addEventListener("click", function () {
    studyTime += seconds;
    localStorage.setItem("studyTime", studyTime);
    clearInterval(timerInterval);
    timerInterval = null;
});

resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    localStorage.setItem("seconds", seconds);
    updateTimer();
});

updateTimer();
displaySubjects();