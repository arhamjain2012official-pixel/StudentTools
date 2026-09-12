document.addEventListener("DOMContentLoaded", function () {

    const root = document.documentElement;
    const workspace = document.getElementById("workspace");
    const workspaceBox = document.getElementById("workspaceBox");
    const workspaceHint = document.getElementById("workspaceHint");
    const toolGrid = document.getElementById("toolGrid");
    const toolSearch = document.getElementById("toolSearch");
    const noTools = document.getElementById("noTools");
    const recentTools = document.getElementById("recentTools");
    const toast = document.getElementById("toast");
    const themeBtn = document.getElementById("themeBtn");

    let favorites = JSON.parse(
        localStorage.getItem("studenttools_favorites") || "[]"
    );

    let recent = JSON.parse(
        localStorage.getItem("studenttools_recent") || "[]"
    );

    let timerInterval = null;
    let timerSeconds = 25 * 60;

    /* ==============================
       TOAST
    ============================== */

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }


    /* ==============================
       DARK MODE
    ============================== */

    if (localStorage.getItem("studenttools_theme") === "dark") {
        root.setAttribute("data-theme", "dark");
    }

    function updateThemeIcon() {
        if (!themeBtn) return;

        const dark =
            root.getAttribute("data-theme") === "dark";

        themeBtn.textContent = dark ? "☀️" : "🌙";
    }

    updateThemeIcon();

    themeBtn?.addEventListener("click", function () {

        const dark =
            root.getAttribute("data-theme") === "dark";

        if (dark) {
            root.removeAttribute("data-theme");
            localStorage.setItem(
                "studenttools_theme",
                "light"
            );
        } else {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem(
                "studenttools_theme",
                "dark"
            );
        }

        updateThemeIcon();
    });


    /* ==============================
       TOOL OPENING
    ============================== */

    document.addEventListener("click", function (event) {

        const button =
            event.target.closest(".open-tool");

        if (!button) return;

        event.preventDefault();

        const tool =
            button.getAttribute("data-tool");

        console.log("Opening tool:", tool);

        if (!tool) {
            console.error("No data-tool found on button.");
            return;
        }

        openTool(tool);
    });


    function openTool(tool) {

        if (!workspace || !workspaceBox) {
            console.error(
                "Workspace elements not found. Check #workspace and #workspaceBox."
            );
            return;
        }

        const card =
            document.querySelector(
                `.tool-card[data-tool="${tool}"]`
            );

        const name =
            card?.getAttribute("data-name") ||
            "Student Tool";

        workspaceHint.textContent = name;

        workspaceBox.innerHTML =
            createTool(tool);

        workspace.style.display = "block";

        saveRecent(tool);

        attachToolEvents(tool);

        workspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* ==============================
       TOOL HTML
    ============================== */

    function createTool(tool) {

        switch (tool) {

            case "percentage":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Percentage (%)</label>
                                <input id="pValue" type="number"
                                    placeholder="20">
                            </div>

                            <div class="field">
                                <label>Number</label>
                                <input id="pNumber" type="number"
                                    placeholder="500">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="pCalculate">
                            Calculate
                        </button>

                        <div class="result-box" id="pResult">
                            Enter values to calculate.
                        </div>

                    </div>
                `;


            case "grade":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Marks Obtained</label>
                                <input id="gObtained"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>Total Marks</label>
                                <input id="gTotal"
                                    type="number">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="gCalculate">
                            Calculate Grade
                        </button>

                        <div class="result-box" id="gResult">
                            Enter your marks.
                        </div>

                    </div>
                `;


            case "gpa":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Grades</label>
                            <input id="gpaInput"
                                placeholder="8, 9, 7, 10">
                        </div>

                        <button class="primary-button"
                            id="gpaCalculate">
                            Calculate GPA
                        </button>

                        <div class="result-box" id="gpaResult">
                            Enter your grades.
                        </div>

                    </div>
                `;


            case "average":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Numbers</label>
                            <input id="avgInput"
                                placeholder="10, 20, 30, 40">
                        </div>

                        <button class="primary-button"
                            id="avgCalculate">
                            Calculate Average
                        </button>

                        <div class="result-box" id="avgResult">
                            Enter numbers.
                        </div>

                    </div>
                `;


            case "discount":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Original Price</label>
                                <input id="dPrice"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>Discount (%)</label>
                                <input id="dPercent"
                                    type="number">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="dCalculate">
                            Calculate
                        </button>

                        <div class="result-box" id="dResult">
                            Enter price and discount.
                        </div>

                    </div>
                `;


            case "calculator":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Expression</label>

                            <input id="calculatorInput"
                                placeholder="25 × 4 + 10">

                        </div>

                        <button class="primary-button"
                            id="calculatorButton">
                            Calculate
                        </button>

                        <div class="result-box"
                            id="calculatorResult">
                            Enter an expression.
                        </div>

                    </div>
                `;


            case "age":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Date of Birth</label>
                            <input id="ageInput"
                                type="date">
                        </div>

                        <button class="primary-button"
                            id="ageButton">
                            Calculate Age
                        </button>

                        <div class="result-box"
                            id="ageResult">
                            Select your birth date.
                        </div>

                    </div>
                `;


            case "days":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Start Date</label>
                                <input id="dayStart"
                                    type="date">
                            </div>

                            <div class="field">
                                <label>End Date</label>
                                <input id="dayEnd"
                                    type="date">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="dayButton">
                            Calculate Difference
                        </button>

                        <div class="result-box"
                            id="dayResult">
                            Select both dates.
                        </div>

                    </div>
                `;


            case "unit":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Value</label>
                                <input id="unitValue"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>From</label>
                                <select id="unitFrom">
                                    <option value="m">Meters</option>
                                    <option value="km">Kilometers</option>
                                    <option value="cm">Centimeters</option>
                                    <option value="ft">Feet</option>
                                    <option value="in">Inches</option>
                                </select>
                            </div>

                            <div class="field">
                                <label>To</label>
                                <select id="unitTo">
                                    <option value="m">Meters</option>
                                    <option value="km">Kilometers</option>
                                    <option value="cm">Centimeters</option>
                                    <option value="ft">Feet</option>
                                    <option value="in">Inches</option>
                                </select>
                            </div>

                        </div>

                        <button class="primary-button"
                            id="unitButton">
                            Convert
                        </button>

                        <div class="result-box"
                            id="unitResult">
                            Enter a value.
                        </div>

                    </div>
                `;


            case "word":
                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Your Text</label>

                            <textarea
                                id="wordInput"
                                rows="9"
                                placeholder="Type or paste your text here..."
                            ></textarea>

                        </div>

                        <div class="result-box"
                            id="wordResult">
                            Words: 0 · Characters: 0
                        </div>

                    </div>
                `;


            case "timer":
                return `
                    <div class="tool-form">

                        <div class="timer-display"
                            id="timerDisplay">
                            25:00
                        </div>

                        <div class="timer-presets">

                            <button data-time="5">5 min</button>
                            <button data-time="15">15 min</button>
                            <button data-time="25">25 min</button>
                            <button data-time="45">45 min</button>

                        </div>

                        <div class="hero-buttons">

                            <button class="primary-button"
                                id="timerStart">
                                Start
                            </button>

                            <button class="secondary-button"
                                id="timerReset">
                                Reset
                            </button>

                        </div>

                    </div>
                `;


            case "notes":
                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Study Notes</label>

                            <textarea
                                id="notesInput"
                                class="notes-area"
                                rows="12"
                                placeholder="Write your notes here..."
                            ></textarea>

                        </div>

                        <button class="primary-button"
                            id="saveNotes">
                            Save Notes
                        </button>

                    </div>
                `;


            case "random":
                return `
                    <div class="tool-form">

                        <div class="result-box"
                            id="randomResult">
                            Click below for a study task.
                        </div>

                        <button class="primary-button"
                            id="randomButton">
                            Pick a Study Task
                        </button>

                    </div>
                `;


            case "qr":
                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Text or URL</label>

                            <input id="qrInput"
                                placeholder="https://example.com">

                        </div>

                        <button class="primary-button"
                            id="qrButton">
                            Generate QR
                        </button>

                        <div class="qr-wrap"
                            id="qrResult">
                        </div>

                    </div>
                `;


            case "change":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Original Value</label>
                                <input id="changeOld"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>New Value</label>
                                <input id="changeNew"
                                    type="number">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="changeButton">
                            Calculate Change
                        </button>

                        <div class="result-box"
                            id="changeResult">
                            Enter both values.
                        </div>

                    </div>
                `;


            case "timecalc":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Start Time</label>
                                <input id="timeStart"
                                    type="time">
                            </div>

                            <div class="field">
                                <label>End Time</label>
                                <input id="timeEnd"
                                    type="time">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="timeButton">
                            Calculate Difference
                        </button>

                        <div class="result-box"
                            id="timeResult">
                            Select both times.
                        </div>

                    </div>
                `;


            case "countdown":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Exam Date & Time</label>
                            <input id="examInput"
                                type="datetime-local">
                        </div>

                        <button class="primary-button"
                            id="examButton">
                            Start Countdown
                        </button>

                        <div class="result-box"
                            id="examResult">
                            Select your exam date.
                        </div>

                    </div>
                `;


            case "fraction":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Numerator 1</label>
                                <input id="fA"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 1</label>
                                <input id="fB"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>Numerator 2</label>
                                <input id="fC"
                                    type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 2</label>
                                <input id="fD"
                                    type="number">
                            </div>

                        </div>

                        <button class="primary-button"
                            id="fractionButton">
                            Add Fractions
                        </button>

                        <div class="result-box"
                            id="fractionResult">
                            Enter both fractions.
                        </div>

                    </div>
                `;


            default:
                return `
                    <div class="result-box">
                        This tool is not available.
                    </div>
                `;
        }
    }


    /* ==============================
       TOOL FUNCTIONALITY
    ============================== */

    function attachToolEvents(tool) {

        /* Percentage */

        if (tool === "percentage") {

            document.getElementById("pCalculate")
                ?.addEventListener("click", function () {

                    const p =
                        Number(document.getElementById("pValue").value);

                    const n =
                        Number(document.getElementById("pNumber").value);

                    if (!isFinite(p) || !isFinite(n)) {
                        showToast("Enter valid numbers");
                        return;
                    }

                    document.getElementById("pResult").innerHTML =
                        `<strong>${format((p / 100) * n)}</strong>`;
                });
        }


        /* Grade */

        if (tool === "grade") {

            document.getElementById("gCalculate")
                ?.addEventListener("click", function () {

                    const obtained =
                        Number(document.getElementById("gObtained").value);

                    const total =
                        Number(document.getElementById("gTotal").value);

                    if (!isFinite(obtained) ||
                        !isFinite(total) ||
                        total <= 0) {

                        showToast("Enter valid marks");
                        return;
                    }

                    const percentage =
                        (obtained / total) * 100;

                    let grade;

                    if (percentage >= 90) grade = "A+";
                    else if (percentage >= 80) grade = "A";
                    else if (percentage >= 70) grade = "B";
                    else if (percentage >= 60) grade = "C";
                    else if (percentage >= 50) grade = "D";
                    else grade = "F";

                    document.getElementById("gResult").innerHTML =
                        `${format(percentage)}% — Grade <strong>${grade}</strong>`;
                });
        }


        /* GPA */

        if (tool === "gpa") {

            document.getElementById("gpaCalculate")
                ?.addEventListener("click", function () {

                    const values =
                        document.getElementById("gpaInput")
                        .value
                        .split(",")
                        .map(Number)
                        .filter(Number.isFinite);

                    if (!values.length) {
                        showToast("Enter grades");
                        return;
                    }

                    const average =
                        values.reduce((a, b) => a + b, 0)
                        / values.length;

                    document.getElementById("gpaResult").innerHTML =
                        `GPA: <strong>${format(average, 2)}</strong>`;
                });
        }


        /* Average */

        if (tool === "average") {

            document.getElementById("avgCalculate")
                ?.addEventListener("click", function () {

                    const values =
                        document.getElementById("avgInput")
                        .value
                        .split(",")
                        .map(Number)
                        .filter(Number.isFinite);

                    if (!values.length) {
                        showToast("Enter numbers");
                        return;
                    }

                    const average =
                        values.reduce((a, b) => a + b, 0)
                        / values.length;

                    document.getElementById("avgResult").innerHTML =
                        `Average: <strong>${format(average)}</strong>`;
                });
        }


        /* Discount */

        if (tool === "discount") {

            document.getElementById("dCalculate")
                ?.addEventListener("click", function () {

                    const price =
                        Number(document.getElementById("dPrice").value);

                    const discount =
                        Number(document.getElementById("dPercent").value);

                    if (!isFinite(price) ||
                        !isFinite(discount)) {

                        showToast("Enter valid values");
                        return;
                    }

                    const saved =
                        price * discount / 100;

                    const finalPrice =
                        price - saved;

                    document.getElementById("dResult").innerHTML =
                        `You save <strong>${format(saved)}</strong><br>
                         Final price: <strong>${format(finalPrice)}</strong>`;
                });
        }


        /* Calculator */

        if (tool === "calculator") {

            document.getElementById("calculatorButton")
                ?.addEventListener("click", calculate);

            document.getElementById("calculatorInput")
                ?.addEventListener("keydown", function (e) {

                    if (e.key === "Enter") {
                        calculate();
                    }
                });
        }


        function calculate() {

            const input =
                document.getElementById("calculatorInput");

            const result =
                document.getElementById("calculatorResult");

            let expression =
                input.value
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/−/g, "-");

            if (!expression) {
                showToast("Enter an expression");
                return;
            }

            if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
                result.textContent = "Invalid expression.";
                return;
            }

            try {

                expression =
                    expression.replace(
                        /(\d+(?:\.\d+)?)%/g,
                        "($1/100)"
                    );

                const answer =
                    Function(
                        `"use strict"; return (${expression})`
                    )();

                if (!isFinite(answer)) {
                    throw new Error();
                }

                result.innerHTML =
                    `Answer: <strong>${format(answer)}</strong>`;

            } catch {
                result.textContent = "Invalid expression.";
            }
        }


        /* Age */

        if (tool === "age") {

            document.getElementById("ageButton")
                ?.addEventListener("click", function () {

                    const value =
                        document.getElementById("ageInput").value;

                    if (!value) {
                        showToast("Select your birth date");
                        return;
                    }

                    const birth =
                        new Date(value + "T00:00:00");

                    const today =
                        new Date();

                    let years =
                        today.getFullYear() -
                        birth.getFullYear();

                    let months =
                        today.getMonth() -
                        birth.getMonth();

                    let days =
                        today.getDate() -
                        birth.getDate();

                    if (days < 0) {
                        months--;
                        days += new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            0
                        ).getDate();
                    }

                    if (months < 0) {
                        years--;
                        months += 12;
                    }

                    document.getElementById("ageResult").innerHTML =
                        `<strong>${years}</strong> years,
                         <strong>${months}</strong> months,
                         <strong>${days}</strong> days`;
                });
        }


        /* Days */

        if (tool === "days") {

            document.getElementById("dayButton")
                ?.addEventListener("click", function () {

                    const a =
                        document.getElementById("dayStart").value;

                    const b =
                        document.getElementById("dayEnd").value;

                    if (!a || !b) {
                        showToast("Select both dates");
                        return;
                    }

                    const difference =
                        Math.abs(
                            new Date(b) - new Date(a)
                        );

                    const days =
                        Math.round(
                            difference / 86400000
                        );

                    document.getElementById("dayResult").innerHTML =
                        `Difference: <strong>${days} days</strong>`;
                });
        }


        /* Unit Converter */

        if (tool === "unit") {

            document.getElementById("unitButton")
                ?.addEventListener("click", function () {

                    const value =
                        Number(
                            document.getElementById("unitValue").value
                        );

                    const from =
                        document.getElementById("unitFrom").value;

                    const to =
                        document.getElementById("unitTo").value;

                    const units = {
                        m: 1,
                        km: 1000,
                        cm: 0.01,
                        ft: 0.3048,
                        in: 0.0254
                    };

                    if (!isFinite(value)) {
                        showToast("Enter a value");
                        return;
                    }

                    const answer =
                        value * units[from] / units[to];

                    document.getElementById("unitResult").innerHTML =
                        `Result: <strong>${format(answer, 6)}</strong>`;
                });
        }


        /* Word Counter */

        if (tool === "word") {

            const input =
                document.getElementById("wordInput");

            input?.addEventListener("input", function () {

                const text = input.value;

                const words =
                    text.trim()
                        ? text.trim().split(/\s+/).length
                        : 0;

                const characters =
                    text.length;

                document.getElementById("wordResult").innerHTML =
                    `Words: <strong>${words}</strong> ·
                     Characters: <strong>${characters}</strong>`;
            });
        }


        /* Timer */

        if (tool === "timer") {

            clearInterval(timerInterval);

            timerSeconds = 25 * 60;

            updateTimer();

            document.querySelectorAll(
                ".timer-presets button"
            ).forEach(button => {

                button.addEventListener("click", function () {

                    timerSeconds =
                        Number(button.dataset.time) * 60;

                    clearInterval(timerInterval);

                    updateTimer();
                });
            });


            document.getElementById("timerStart")
                ?.addEventListener("click", function () {

                    if (timerInterval) {

                        clearInterval(timerInterval);
                        timerInterval = null;

                        this.textContent = "Start";

                        return;
                    }

                    this.textContent = "Pause";

                    timerInterval =
                        setInterval(function () {

                            if (timerSeconds <= 0) {

                                clearInterval(timerInterval);
                                timerInterval = null;

                                document.getElementById(
                                    "timerStart"
                                ).textContent = "Start";

                                showToast("Timer finished");

                                return;
                            }

                            timerSeconds--;

                            updateTimer();

                        }, 1000);
                });


            document.getElementById("timerReset")
                ?.addEventListener("click", function () {

                    clearInterval(timerInterval);
                    timerInterval = null;

                    timerSeconds = 25 * 60;

                    updateTimer();

                    document.getElementById(
                        "timerStart"
                    ).textContent = "Start";
                });
        }


        function updateTimer() {

            const display =
                document.getElementById("timerDisplay");

            if (!display) return;

            const minutes =
                Math.floor(timerSeconds / 60);

            const seconds =
                timerSeconds % 60;

            display.textContent =
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0");
        }


        /* Notes */

        if (tool === "notes") {

            const input =
                document.getElementById("notesInput");

            input.value =
                localStorage.getItem(
                    "studenttools_notes"
                ) || "";

            document.getElementById("saveNotes")
                ?.addEventListener("click", function () {

                    localStorage.setItem(
                        "studenttools_notes",
                        input.value
                    );

                    showToast("Notes saved");
                });
        }


        /* Random Task */

        if (tool === "random") {

            document.getElementById("randomButton")
                ?.addEventListener("click", function () {

                    const tasks = [
                        "Revise one difficult topic.",
                        "Solve 5 practice questions.",
                        "Read your notes for 15 minutes.",
                        "Revise important formulas.",
                        "Make 5 flashcards.",
                        "Explain a topic in your own words.",
                        "Complete one pending homework question.",
                        "Take a short self-test."
                    ];

                    const task =
                        tasks[
                            Math.floor(
                                Math.random() * tasks.length
                            )
                        ];

                    document.getElementById(
                        "randomResult"
                    ).innerHTML =
                        `<strong>${task}</strong>`;
                });
        }


        /* QR */

        if (tool === "qr") {

            document.getElementById("qrButton")
                ?.addEventListener("click", function () {

                    const text =
                        document.getElementById("qrInput")
                        .value
                        .trim();

                    const result =
                        document.getElementById("qrResult");

                    if (!text) {
                        showToast("Enter text or URL");
                        return;
                    }

                    if (typeof QRious === "undefined") {

                        result.textContent =
                            "QR library not loaded.";

                        return;
                    }

                    result.innerHTML = "";

                    const canvas =
                        document.createElement("canvas");

                    result.appendChild(canvas);

                    new QRious({
                        element: canvas,
                        value: text,
                        size: 220,
                        level: "H"
                    });
                });
        }


        /* Percentage Change */

        if (tool === "change") {

            document.getElementById("changeButton")
                ?.addEventListener("click", function () {

                    const oldValue =
                        Number(
                            document.getElementById("changeOld").value
                        );

                    const newValue =
                        Number(
                            document.getElementById("changeNew").value
                        );

                    if (!isFinite(oldValue) ||
                        !isFinite(newValue) ||
                        oldValue === 0) {

                        showToast("Enter valid values");
                        return;
                    }

                    const change =
                        ((newValue - oldValue) /
                            Math.abs(oldValue)) * 100;

                    const type =
                        change > 0
                            ? "increase"
                            : change < 0
                                ? "decrease"
                                : "no change";

                    document.getElementById(
                        "changeResult"
                    ).innerHTML =
                        `<strong>${format(Math.abs(change), 2)}%</strong>
                         ${type}`;
                });
        }


        /* Time Difference */

        if (tool === "timecalc") {

            document.getElementById("timeButton")
                ?.addEventListener("click", function () {

                    const start =
                        document.getElementById("timeStart").value;

                    const end =
                        document.getElementById("timeEnd").value;

                    if (!start || !end) {
                        showToast("Select both times");
                        return;
                    }

                    let [sh, sm] =
                        start.split(":").map(Number);

                    let [eh, em] =
                        end.split(":").map(Number);

                    let startMinutes =
                        sh * 60 + sm;

                    let endMinutes =
                        eh * 60 + em;

                    if (endMinutes < startMinutes) {
                        endMinutes += 1440;
                    }

                    const difference =
                        endMinutes - startMinutes;

                    const hours =
                        Math.floor(difference / 60);

                    const minutes =
                        difference % 60;

                    document.getElementById(
                        "timeResult"
                    ).innerHTML =
                        `Difference:
                         <strong>${hours}h ${minutes}m</strong>`;
                });
        }


        /* Fraction */

        if (tool === "fraction") {

            document.getElementById("fractionButton")
                ?.addEventListener("click", function () {

                    const a =
                        Number(document.getElementById("fA").value);

                    const b =
                        Number(document.getElementById("fB").value);

                    const c =
                        Number(document.getElementById("fC").value);

                    const d =
                        Number(document.getElementById("fD").value);

                    if (!isFinite(a) ||
                        !isFinite(b) ||
                        !isFinite(c) ||
                        !isFinite(d) ||
                        b === 0 ||
                        d === 0) {

                        showToast("Enter valid fractions");
                        return;
                    }

                    const numerator =
                        a * d + c * b;

                    const denominator =
                        b * d;

                    const divisor =
                        gcd(numerator, denominator);

                    document.getElementById(
                        "fractionResult"
                    ).innerHTML =
                        `Result:
                         <strong>
                         ${numerator / divisor}/${denominator / divisor}
                         </strong>`;
                });
        }
    }


    /* ==============================
       RECENT TOOLS
    ============================== */

    function saveRecent(tool) {

        recent =
            recent.filter(item => item !== tool);

        recent.unshift(tool);

        recent =
            recent.slice(0, 6);

        localStorage.setItem(
            "studenttools_recent",
            JSON.stringify(recent)
        );

        renderRecent();
    }


    function renderRecent() {

        if (!recentTools) return;

        recentTools.innerHTML = "";

        recent.forEach(tool => {

            const card =
                document.querySelector(
                    `.tool-card[data-tool="${tool}"]`
                );

            if (!card) return;

            const chip =
                document.createElement("button");

            chip.className = "recent-chip";

            chip.textContent =
                card.dataset.name || tool;

            chip.addEventListener("click", () => {
                openTool(tool);
            });

            recentTools.appendChild(chip);
        });
    }

    renderRecent();


    /* ==============================
       SEARCH
    ============================== */

    toolSearch?.addEventListener("input", filterTools);


    function filterTools() {

        const query =
            toolSearch.value
            .toLowerCase()
            .trim();

        const active =
            document.querySelector(
                ".category-tab.active"
            )?.dataset.category || "all";

        let count = 0;

        document.querySelectorAll(
            ".tool-card"
        ).forEach(card => {

            const name =
                (card.dataset.name || "")
                .toLowerCase();

            const category =
                card.dataset.category || "";

            const matchesSearch =
                !query ||
                name.includes(query) ||
                card.textContent
                    .toLowerCase()
                    .includes(query);

            const matchesCategory =
                active === "all" ||
                category === active;

            if (matchesSearch && matchesCategory) {

                card.style.display = "";
                count++;

            } else {

                card.style.display = "none";
            }
        });

        if (noTools) {
            noTools.style.display =
                count === 0 ? "block" : "none";
        }
    }


    /* ==============================
       CATEGORY FILTER
    ============================== */

    document.querySelectorAll(
        ".category-tab"
    ).forEach(tab => {

        tab.addEventListener("click", function () {

            document.querySelectorAll(
                ".category-tab"
            ).forEach(t =>
                t.classList.remove("active")
            );

            this.classList.add("active");

            filterTools();
        });
    });


    /* ==============================
       FAVORITES
    ============================== */

    document.querySelectorAll(
        ".favorite-button"
    ).forEach(button => {

        const card =
            button.closest(".tool-card");

        if (!card) return;

        const tool =
            card.dataset.tool;

        if (favorites.includes(tool)) {
            button.textContent = "★";
            button.classList.add("active");
        } else {
            button.textContent = "☆";
        }

        button.addEventListener("click", function (event) {

            event.stopPropagation();

            if (favorites.includes(tool)) {

                favorites =
                    favorites.filter(
                        item => item !== tool
                    );

                button.textContent = "☆";
                button.classList.remove("active");

            } else {

                favorites.push(tool);

                button.textContent = "★";
                button.classList.add("active");
            }

            localStorage.setItem(
                "studenttools_favorites",
                JSON.stringify(favorites)
            );
        });
    });


    /* ==============================
       HELPERS
    ============================== */

    function format(number, decimals = 4) {

        if (!isFinite(number)) return "Invalid";

        return Number(
            number.toFixed(decimals)
        ).toLocaleString();
    }


    function gcd(a, b) {

        a = Math.abs(a);
        b = Math.abs(b);

        while (b) {
            const temp = b;
            b = a % b;
            a = temp;
        }

        return a || 1;
    }


    /* ==============================
       KEYBOARD SHORTCUT
    ============================== */

    document.addEventListener("keydown", function (event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            toolSearch?.focus();
        }

        if (event.key === "Escape") {

            if (workspace) {
                workspace.style.display = "none";
            }
        }
    });

});
