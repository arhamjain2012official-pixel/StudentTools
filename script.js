/* ==========================
   STUDENT TOOLS
========================== */

/* ---------- DARK MODE ---------- */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

    });
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}


/* ---------- CURSOR GLOW ---------- */

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {

    if (!glow) return;

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";

});


/* ---------- PERCENTAGE ---------- */

function calculatePercentage() {

    const percentage =
        parseFloat(document.getElementById("percentValue").value);

    const number =
        parseFloat(document.getElementById("percentNumber").value);

    const result =
        document.getElementById("percentageResult");

    if (isNaN(percentage) || isNaN(number)) {

        result.textContent = "Please enter both numbers.";
        result.style.display = "block";
        return;

    }

    const answer = (percentage / 100) * number;

    result.textContent =
        `${percentage}% of ${number} = ${answer}`;

    result.style.display = "block";
}


/* ---------- GRADE ---------- */

function calculateGrade() {

    const obtained =
        parseFloat(document.getElementById("marksObtained").value);

    const total =
        parseFloat(document.getElementById("totalMarks").value);

    const result =
        document.getElementById("gradeResult");

    if (
        isNaN(obtained) ||
        isNaN(total) ||
        total <= 0 ||
        obtained < 0 ||
        obtained > total
    ) {

        result.textContent =
            "Please enter valid marks.";

        result.style.display = "block";
        return;

    }

    const percentage = (obtained / total) * 100;

    let grade;

    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else {
        grade = "F";
    }

    result.textContent =
        `Percentage: ${percentage.toFixed(2)}% • Grade: ${grade}`;

    result.style.display = "block";
}


/* ---------- AGE ---------- */

function calculateAge() {

    const input =
        document.getElementById("birthDate").value;

    const result =
        document.getElementById("ageResult");

    if (!input) {

        result.textContent =
            "Please select your date of birth.";

        result.style.display = "block";
        return;

    }

    const birthDate = new Date(input);
    const today = new Date();

    if (birthDate > today) {

        result.textContent =
            "Birth date cannot be in the future.";

        result.style.display = "block";
        return;

    }

    let years =
        today.getFullYear() - birthDate.getFullYear();

    let months =
        today.getMonth() - birthDate.getMonth();

    let days =
        today.getDate() - birthDate.getDate();

    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

        days += previousMonth.getDate();

    }

    if (months < 0) {

        years--;
        months += 12;

    }

    result.textContent =
        `You are ${years} years, ${months} months and ${days} days old.`;

    result.style.display = "block";
}


/* ---------- WORD COUNTER ---------- */

const wordText =
    document.getElementById("wordText");

if (wordText) {

    wordText.addEventListener("input", updateWordCount);

}

function updateWordCount() {

    const text =
        document.getElementById("wordText").value;

    const words =
        text.trim() === ""
            ? 0
            : text.trim().split(/\s+/).length;

    const characters =
        text.length;

    document.getElementById("wordResult").textContent =
        `Words: ${words} | Characters: ${characters}`;

}


/* ---------- UNIT CONVERTER ---------- */

function convertUnit() {

    const value =
        parseFloat(document.getElementById("unitValue").value);

    const type =
        document.getElementById("unitType").value;

    const result =
        document.getElementById("unitResult");

    if (isNaN(value)) {

        result.textContent =
            "Please enter a value.";

        result.style.display = "block";
        return;

    }

    let answer;
    let unit;

    switch (type) {

        case "km-miles":
            answer = value * 0.621371;
            unit = "miles";
            break;

        case "miles-km":
            answer = value * 1.609344;
            unit = "kilometers";
            break;

        case "kg-lb":
            answer = value * 2.20462262;
            unit = "pounds";
            break;

        case "lb-kg":
            answer = value * 0.45359237;
            unit = "kilograms";
            break;

    }

    result.textContent =
        `${value} = ${answer.toFixed(4)} ${unit}`;

    result.style.display = "block";
}


/* ---------- STUDY TIMER ---------- */

let timerSeconds = 25 * 60;
let timerInterval = null;

function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    document.getElementById("timerDisplay").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function startTimer() {

    if (timerInterval) return;

    timerInterval = setInterval(() => {

        if (timerSeconds <= 0) {

            clearInterval(timerInterval);
            timerInterval = null;

            alert("Study session complete! 🎓");

            return;

        }

        timerSeconds--;

        updateTimerDisplay();

    }, 1000);

}

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerSeconds = 25 * 60;

    updateTimerDisplay();

}


/* ---------- BASIC CALCULATOR ---------- */

function calculateExpression() {

    const input =
        document.getElementById("calcInput").value.trim();

    const result =
        document.getElementById("calcResult");

    if (!input) {

        result.textContent =
            "Please enter a calculation.";

        result.style.display = "block";
        return;

    }

    /*
       Only allow numbers and basic mathematical operators.
       This avoids executing arbitrary JavaScript.
    */

    if (!/^[0-9+\-*/().%\s]+$/.test(input)) {

        result.textContent =
            "Use numbers and basic operators only.";

        result.style.display = "block";
        return;

    }

    try {

        const answer =
            Function(`"use strict"; return (${input})`)();

        if (!Number.isFinite(answer)) {
            throw new Error();
        }

        result.textContent =
            `Answer: ${answer}`;

    } catch {

        result.textContent =
            "Invalid calculation.";

    }

    result.style.display = "block";
}


/* ---------- DAYS BETWEEN DATES ---------- */

function calculateDays() {

    const start =
        document.getElementById("startDate").value;

    const end =
        document.getElementById("endDate").value;

    const result =
        document.getElementById("daysResult");

    if (!start || !end) {

        result.textContent =
            "Please select both dates.";

        result.style.display = "block";
        return;

    }

    const startDate =
        new Date(start + "T00:00:00");

    const endDate =
        new Date(end + "T00:00:00");

    const difference =
        Math.abs(endDate - startDate);

    const days =
        Math.round(
            difference / (1000 * 60 * 60 * 24)
        );

    result.textContent =
        `${days} day${days === 1 ? "" : "s"} between the dates.`;

    result.style.display = "block";
}


/* ---------- QR GENERATOR ---------- */

let studentQR = null;

function generateStudentQR() {

    const input =
        document.getElementById("qrInput").value.trim();

    if (!input) {

        alert("Please enter text or a website.");
        return;

    }

    let finalText = input;

    if (
        input.includes(".") &&
        !input.startsWith("http://") &&
        !input.startsWith("https://")
    ) {

        finalText = "https://" + input;

    }

    if (!studentQR) {

        studentQR = new QRious({
            element: document.getElementById("studentQR"),
            value: finalText,
            size: 250,
            foreground: "#000000",
            background: "#ffffff"
        });

    } else {

        studentQR.value = finalText;

    }

}


/* ---------- FAQ ---------- */

document.querySelectorAll(".faq-question").forEach(question => {

    question.addEventListener("click", () => {

        const answer =
            question.nextElementSibling;

        const icon =
            question.querySelector("span");

        if (
            answer.style.display === "none" ||
            answer.style.display === ""
        ) {

            answer.style.display = "block";

            if (icon) {
                icon.textContent = "−";
            }

        } else {

            answer.style.display = "none";

            if (icon) {
                icon.textContent = "+";
            }

        }

    });

});