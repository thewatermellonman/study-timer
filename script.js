let seconds = Number(localStorage.getItem("seconds")) || 0;
let timerInterval = null;

let studySessions = JSON.parse(localStorage.getItem("studySessions")) || [];
let sessionStartSeconds = null;

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

const timer = document.querySelector(".timer");

const leaderboardList = document.querySelector("#leaderboardList");

const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");

const subjectSelect = document.querySelector("#subjectSelect");
const addSubjectButton = document.querySelector("#addSubjectButton");

const todayStat = document.querySelector("#todayStat");

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
    subjectSelect.innerHTML = '<option value="">Select a subject</option>';
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

function displayLeaderboard() {
    const totals = {};

    studySessions.forEach(function (session) {
        if (totals[session.subject] === undefined) {
            totals[session.subject] =0;
        }
        totals[session.subject] += session.duration
    });

    const sortedSubjects = Object.entries(totals).sort(function (a, b) {
        return b[1] - a[1];
    });

    if (sortedSubjects.length === 0) {
        leaderboardList.innerHTML = "<p>No study sessions yet!</p>";
        return;
    }

    leaderboardList.innerHTML = "";

    sortedSubjects.forEach(function (item, index) {
        const subject = item[0];
        const duration = item[1];

        const minutes = Math.floor(duration / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        let timeText;

        if (hours > 0) {
            timeText = hours + "h " + remainingMinutes + "m";
        } else {
            timeText = minutes + "m";
        }

        const row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML =
            "<span>" + (index + 1) + ". " + subject + "</span>" +
            "<strong>" + timeText + "</strong>";

        leaderboardList.appendChild(row);
    });
}

function displayTodayStat() {
    let todaySeconds = 0;

    const today = new Date().toDateString();

    studySessions.forEach(function (session) {
        const sessionDate = new Date(session.timestamp).toDateString();

        if (sessionDate === today) {
            todaySeconds += session.duration;
        }
    });

    const todayMinutes = Math.floor(todaySeconds / 60);
    const todayHours = Math.floor(todayMinutes / 60);
    const remainingMinutes = todayMinutes % 60;

    if (todayHours > 0) {
        todayStat.textContent =
        todayHours + "h " + remainingMinutes + "m";
    } else {
        todayStat.textContent = todayMinutes + "m";
    }
}

startButton.addEventListener("click", function () {
    if (subjectSelect.value === "") {
        alert("choose a subject first");
        return;
    }
    if (timerInterval === null) {
        sessionStartSeconds = seconds;
        timerInterval = setInterval(function () {
            seconds++;
            localStorage.setItem("seconds", seconds);
            updateTimer();
        }, 1000);
    }
});

pauseButton.addEventListener("click", function () {
    if (timerInterval === null) {
        return;
    }
    const sessionDuration = seconds - sessionStartSeconds;
    if (sessionDuration > 0) {
        const session = {
            subject: subjectSelect.value,
            duration: sessionDuration,
            timestamp: new Date().toISOString()
        };
        studySessions.push(session);
        localStorage.setItem("studySessions", JSON.stringify(studySessions));
        displayLeaderboard();   
        displayTodayStat();
    }
    clearInterval(timerInterval);
    timerInterval = null;
    sessionStartSeconds = null;
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
displayLeaderboard();
displayTodayStat();