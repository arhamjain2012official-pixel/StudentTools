/* =========================================================
   STUDENTTOOLS - COMPLETE SCRIPT
   Matches the current index.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const root = document.documentElement;

    const themeBtn = document.getElementById("themeBtn");
    const searchInput = document.getElementById("toolSearch");
    const toolGrid = document.getElementById("toolGrid");
    const noTools = document.getElementById("noTools");

    const workspace = document.getElementById("workspace");
    const workspaceBox = document.getElementById("workspaceBox");
    const workspaceHint = document.getElementById("workspaceHint");

    const recentTools = document.getElementById("recentTools");
    const toast = document.getElementById("toast");

    let favorites = JSON.parse(
        localStorage.getItem("studenttools_favorites") || "[]"
    );

    let recent = JSON.parse(
        localStorage.getItem("studenttools_recent") || "[]"
    );

    let timerInterval = null;
    let timerSeconds = 25 * 60;

    let countdownInterval = null;


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toast._timer);

        toast._timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }


    /* =====================================================
       DARK MODE
       ===================================================== */

    const savedTheme =
        localStorage.getItem("studenttools_theme");

    if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
    }

    updateThemeIcon();

    themeBtn?.addEventListener("click", () => {

        const dark =
            root.getAttribute("data-theme") === "dark";

        if (dark) {

            root.removeAttribute("data-theme");

            localStorage.setItem(
                "studenttools_theme",
                "light"
            );

        } else {

            root.setAttribute(
                "data-theme",
                "dark"
            );

            localStorage.setItem(
                "studenttools_theme",
                "dark"
            );
        }

        updateThemeIcon();
    });


    function updateThemeIcon() {

        if (!themeBtn) return;

        const dark =
            root.getAttribute("data-theme") === "dark";

        themeBtn.textContent =
            dark ? "☀️" : "🌙";
    }


    /* =====================================================
       OPEN TOOL
       ===================================================== */

    /*
       IMPORTANT:
       data-tool is on .tool-card in your index.html,
       NOT on the .open-tool button.
    */

    document.addEventListener("click", (event) => {

        const button =
            event.target.closest(".open-tool");

        if (!button) return;

        event.preventDefault();

        const card =
            button.closest(".tool-card");

        if (!card) {
            console.error("Tool card not found.");
            return;
        }

        const tool =
            card.getAttribute("data-tool");

        if (!tool) {
            console.error(
                "data-tool is missing from this tool card."
            );
            return;
        }

        openTool(tool);
    });


    function openTool(tool) {

        if (!workspace || !workspaceBox) {
            console.error(
                "Workspace elements are missing."
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
            getToolHTML(tool);

        workspace.style.display = "block";

        saveRecent(tool);

        attachToolEvents(tool);

        workspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       TOOL HTML
       ===================================================== */

    function getToolHTML(tool) {

        switch (tool) {

            /* ---------------------------------------------
               PERCENTAGE
            --------------------------------------------- */

            case "percentage":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Percentage (%)</label>
                                <input
                                    id="percentageValue"
                                    type="number"
                                    placeholder="20"
                                >
                            </div>

                            <div class="field">
                                <label>Number</label>
                                <input
                                    id="percentageNumber"
                                    type="number"
                                    placeholder="500"
                                >
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="percentageButton"
                        >
                            Calculate
                        </button>

                        <div
                            class="result-box"
                            id="percentageResult"
                        >
                            Enter values to calculate.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               GRADE
            --------------------------------------------- */

            case "grade":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Marks Obtained</label>
                                <input
                                    id="gradeObtained"
                                    type="number"
                                    placeholder="85"
                                >
                            </div>

                            <div class="field">
                                <label>Total Marks</label>
                                <input
                                    id="gradeTotal"
                                    type="number"
                                    placeholder="100"
                                >
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="gradeButton"
                        >
                            Calculate Grade
                        </button>

                        <div
                            class="result-box"
                            id="gradeResult"
                        >
                            Enter your marks.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               GPA
            --------------------------------------------- */

            case "gpa":

                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Grades separated by commas</label>

                            <input
                                id="gpaInput"
                                placeholder="8, 9, 7, 10"
                            >
                        </div>

                        <button
                            class="primary-button"
                            id="gpaButton"
                        >
                            Calculate GPA
                        </button>

                        <div
                            class="result-box"
                            id="gpaResult"
                        >
                            Enter your grades.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               AVERAGE
            --------------------------------------------- */

            case "average":

                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Numbers separated by commas</label>

                            <input
                                id="averageInput"
                                placeholder="10, 20, 30, 40"
                            >
                        </div>

                        <button
                            class="primary-button"
                            id="averageButton"
                        >
                            Calculate Average
                        </button>

                        <div
                            class="result-box"
                            id="averageResult"
                        >
                            Enter numbers.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               DISCOUNT
            --------------------------------------------- */

            case "discount":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Original Price</label>

                                <input
                                    id="discountPrice"
                                    type="number"
                                    placeholder="1000"
                                >
                            </div>

                            <div class="field">
                                <label>Discount (%)</label>

                                <input
                                    id="discountPercent"
                                    type="number"
                                    placeholder="20"
                                >
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="discountButton"
                        >
                            Calculate
                        </button>

                        <div
                            class="result-box"
                            id="discountResult"
                        >
                            Enter price and discount.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               FRACTION
            --------------------------------------------- */

            case "fraction":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Numerator 1</label>
                                <input id="fractionA" type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 1</label>
                                <input id="fractionB" type="number">
                            </div>

                            <div class="field">
                                <label>Numerator 2</label>
                                <input id="fractionC" type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 2</label>
                                <input id="fractionD" type="number">
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="fractionButton"
                        >
                            Add Fractions
                        </button>

                        <div
                            class="result-box"
                            id="fractionResult"
                        >
                            Enter both fractions.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               BASIC CALCULATOR
            --------------------------------------------- */

            case "calculator":

                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>
                                Mathematical Expression
                            </label>

                            <input
                                id="calculatorInput"
                                type="text"
                                placeholder="25 × 4 + 10"
                                autocomplete="off"
                            >

                        </div>

                        <button
                            class="primary-button"
                            id="calculatorButton"
                        >
                            Calculate
                        </button>

                        <div
                            class="result-box"
                            id="calculatorResult"
                        >
                            Enter an expression.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               AGE
            --------------------------------------------- */

            case "age":

                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Date of Birth</label>

                            <input
                                id="ageDate"
                                type="date"
                            >

                        </div>

                        <button
                            class="primary-button"
                            id="ageButton"
                        >
                            Calculate Age
                        </button>

                        <div
                            class="result-box"
                            id="ageResult"
                        >
                            Select your birth date.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               DAYS
            --------------------------------------------- */

            case "days":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Start Date</label>
                                <input
                                    id="daysStart"
                                    type="date"
                                >
                            </div>

                            <div class="field">
                                <label>End Date</label>
                                <input
                                    id="daysEnd"
                                    type="date"
                                >
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="daysButton"
                        >
                            Calculate Difference
                        </button>

                        <div
                            class="result-box"
                            id="daysResult"
                        >
                            Select both dates.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               UNIT CONVERTER
            --------------------------------------------- */

            case "unit":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Value</label>
                                <input
                                    id="unitValue"
                                    type="number"
                                    placeholder="100"
                                >
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

                        <button
                            class="primary-button"
                            id="unitButton"
                        >
                            Convert
                        </button>

                        <div
                            class="result-box"
                            id="unitResult"
                        >
                            Enter a value.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               WORD COUNTER
            --------------------------------------------- */

            case "word":

                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Your Text</label>

                            <textarea
                                id="wordInput"
                                rows="10"
                                placeholder="Type or paste your text here..."
                            ></textarea>

                        </div>

                        <div
                            class="result-box"
                            id="wordResult"
                        >
                            Words: <strong>0</strong>
                            · Characters: <strong>0</strong>
                            · Lines: <strong>0</strong>
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               FOCUS TIMER
            --------------------------------------------- */

            case "timer":

                return `
                    <div class="tool-form">

                        <div
                            class="timer-display"
                            id="timerDisplay"
                        >
                            25:00
                        </div>

                        <div class="timer-presets">

                            <button data-minutes="5">
                                5 min
                            </button>

                            <button data-minutes="15">
                                15 min
                            </button>

                            <button data-minutes="25">
                                25 min
                            </button>

                            <button data-minutes="45">
                                45 min
                            </button>

                        </div>

                        <div class="hero-buttons">

                            <button
                                class="primary-button"
                                id="timerStart"
                            >
                                Start
                            </button>

                            <button
                                class="secondary-button"
                                id="timerReset"
                            >
                                Reset
                            </button>

                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               NOTES
            --------------------------------------------- */

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

                        <div class="hero-buttons">

                            <button
                                class="primary-button"
                                id="saveNotes"
                            >
                                Save Notes
                            </button>

                            <button
                                class="secondary-button"
                                id="clearNotes"
                            >
                                Clear
                            </button>

                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               RANDOM STUDY TASK
            --------------------------------------------- */

            case "random":

                return `
                    <div class="tool-form">

                        <div
                            class="result-box"
                            id="randomResult"
                        >
                            Click the button to get a study task.
                        </div>

                        <button
                            class="primary-button"
                            id="randomButton"
                        >
                            Pick a Study Task
                        </button>

                    </div>
                `;


            /* ---------------------------------------------
               QR GENERATOR
            --------------------------------------------- */

            case "qr":

                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Text or URL</label>

                            <input
                                id="qrInput"
                                type="text"
                                placeholder="https://example.com"
                            >

                        </div>

                        <button
                            class="primary-button"
                            id="qrButton"
                        >
                            Generate QR
                        </button>

                        <div
                            class="qr-wrap"
                            id="qrResult"
                        ></div>

                    </div>
                `;


            /* ---------------------------------------------
               PERCENTAGE CHANGE
            --------------------------------------------- */

            case "change":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Original Value</label>

                                <input
                                    id="changeOld"
                                    type="number"
                                >
                            </div>

                            <div class="field">
                                <label>New Value</label>

                                <input
                                    id="changeNew"
                                    type="number"
                                >
                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="changeButton"
                        >
                            Calculate Change
                        </button>

                        <div
                            class="result-box"
                            id="changeResult"
                        >
                            Enter both values.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               TIME DIFFERENCE
            --------------------------------------------- */

            case "timecalc":

                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">

                                <label>Start Time</label>

                                <input
                                    id="timeStart"
                                    type="time"
                                >

                            </div>

                            <div class="field">

                                <label>End Time</label>

                                <input
                                    id="timeEnd"
                                    type="time"
                                >

                            </div>

                        </div>

                        <button
                            class="primary-button"
                            id="timeButton"
                        >
                            Calculate Difference
                        </button>

                        <div
                            class="result-box"
                            id="timeResult"
                        >
                            Select both times.
                        </div>

                    </div>
                `;


            /* ---------------------------------------------
               EXAM COUNTDOWN
            --------------------------------------------- */

            case "countdown":

                return `
                    <div class="tool-form">

                        <div class="field">

                            <label>Exam Date & Time</label>

                            <input
                                id="examDate"
                                type="datetime-local"
                            >

                        </div>

                        <button
                            class="primary-button"
                            id="countdownButton"
                        >
                            Start Countdown
                        </button>

                        <div
                            class="result-box"
                            id="countdownResult"
                        >
                            Select your exam date.
                        </div>

                    </div>
                `;


            default:

                return `
                    <div class="result-box">
                        This tool is not available yet.
                    </div>
                `;
        }
    }


    /* =====================================================
       TOOL EVENTS
       ===================================================== */

    function attachToolEvents(tool) {


        /* ---------------------------------------------
           PERCENTAGE
        --------------------------------------------- */

        if (tool === "percentage") {

            document
                .getElementById("percentageButton")
                ?.addEventListener("click", () => {

                    const percentage =
                        Number(
                            document.getElementById(
                                "percentageValue"
                            ).value
                        );

                    const number =
                        Number(
                            document.getElementById(
                                "percentageNumber"
                            ).value
                        );

                    if (
                        !Number.isFinite(percentage) ||
                        !Number.isFinite(number)
                    ) {

                        showToast("Enter valid numbers");
                        return;
                    }

                    const result =
                        (percentage / 100) * number;

                    document.getElementById(
                        "percentageResult"
                    ).innerHTML =
                        `${percentage}% of ${number} =
                        <strong>${formatNumber(result)}</strong>`;
                });
        }


        /* ---------------------------------------------
           GRADE
        --------------------------------------------- */

        if (tool === "grade") {

            document
                .getElementById("gradeButton")
                ?.addEventListener("click", () => {

                    const obtained =
                        Number(
                            document.getElementById(
                                "gradeObtained"
                            ).value
                        );

                    const total =
                        Number(
                            document.getElementById(
                                "gradeTotal"
                            ).value
                        );

                    if (
                        !Number.isFinite(obtained) ||
                        !Number.isFinite(total) ||
                        total <= 0
                    ) {

                        showToast("Enter valid marks");
                        return;
                    }

                    const percentage =
                        (obtained / total) * 100;

                    let grade;

                    if (percentage >= 90)
                        grade = "A+";
                    else if (percentage >= 80)
                        grade = "A";
                    else if (percentage >= 70)
                        grade = "B";
                    else if (percentage >= 60)
                        grade = "C";
                    else if (percentage >= 50)
                        grade = "D";
                    else
                        grade = "F";

                    document.getElementById(
                        "gradeResult"
                    ).innerHTML =
                        `Percentage:
                        <strong>${formatNumber(percentage, 2)}%</strong>
                        <br>
                        Grade:
                        <strong>${grade}</strong>`;
                });
        }


        /* ---------------------------------------------
           GPA
        --------------------------------------------- */

        if (tool === "gpa") {

            document
                .getElementById("gpaButton")
                ?.addEventListener("click", () => {

                    const values =
                        document
                            .getElementById("gpaInput")
                            .value
                            .split(",")
                            .map(Number)
                            .filter(Number.isFinite);

                    if (!values.length) {

                        showToast("Enter your grades");
                        return;
                    }

                    const average =
                        values.reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        ) / values.length;

                    document.getElementById(
                        "gpaResult"
                    ).innerHTML =
                        `GPA:
                        <strong>
                            ${formatNumber(average, 2)}
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           AVERAGE
        --------------------------------------------- */

        if (tool === "average") {

            document
                .getElementById("averageButton")
                ?.addEventListener("click", () => {

                    const values =
                        document
                            .getElementById("averageInput")
                            .value
                            .split(",")
                            .map(Number)
                            .filter(Number.isFinite);

                    if (!values.length) {

                        showToast("Enter numbers");
                        return;
                    }

                    const total =
                        values.reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        );

                    const average =
                        total / values.length;

                    document.getElementById(
                        "averageResult"
                    ).innerHTML =
                        `Average:
                        <strong>
                            ${formatNumber(average)}
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           DISCOUNT
        --------------------------------------------- */

        if (tool === "discount") {

            document
                .getElementById("discountButton")
                ?.addEventListener("click", () => {

                    const price =
                        Number(
                            document.getElementById(
                                "discountPrice"
                            ).value
                        );

                    const discount =
                        Number(
                            document.getElementById(
                                "discountPercent"
                            ).value
                        );

                    if (
                        !Number.isFinite(price) ||
                        !Number.isFinite(discount)
                    ) {

                        showToast("Enter valid values");
                        return;
                    }

                    const saved =
                        price * discount / 100;

                    const finalPrice =
                        price - saved;

                    document.getElementById(
                        "discountResult"
                    ).innerHTML =
                        `You save:
                        <strong>${formatNumber(saved)}</strong>
                        <br>
                        Final price:
                        <strong>${formatNumber(finalPrice)}</strong>`;
                });
        }


        /* ---------------------------------------------
           FRACTION
        --------------------------------------------- */

        if (tool === "fraction") {

            document
                .getElementById("fractionButton")
                ?.addEventListener("click", () => {

                    const a =
                        Number(
                            document.getElementById(
                                "fractionA"
                            ).value
                        );

                    const b =
                        Number(
                            document.getElementById(
                                "fractionB"
                            ).value
                        );

                    const c =
                        Number(
                            document.getElementById(
                                "fractionC"
                            ).value
                        );

                    const d =
                        Number(
                            document.getElementById(
                                "fractionD"
                            ).value
                        );

                    if (
                        !Number.isFinite(a) ||
                        !Number.isFinite(b) ||
                        !Number.isFinite(c) ||
                        !Number.isFinite(d) ||
                        b === 0 ||
                        d === 0
                    ) {

                        showToast("Enter valid fractions");
                        return;
                    }

                    const numerator =
                        a * d + c * b;

                    const denominator =
                        b * d;

                    const divisor =
                        gcd(numerator, denominator);

                    const finalNumerator =
                        numerator / divisor;

                    const finalDenominator =
                        denominator / divisor;

                    document.getElementById(
                        "fractionResult"
                    ).innerHTML =
                        `Result:
                        <strong>
                            ${finalNumerator}/${finalDenominator}
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           CALCULATOR
        --------------------------------------------- */

        if (tool === "calculator") {

            const button =
                document.getElementById(
                    "calculatorButton"
                );

            const input =
                document.getElementById(
                    "calculatorInput"
                );

            button?.addEventListener(
                "click",
                calculateExpression
            );

            input?.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {
                        calculateExpression();
                    }
                }
            );
        }


        function calculateExpression() {

            const input =
                document.getElementById(
                    "calculatorInput"
                );

            const result =
                document.getElementById(
                    "calculatorResult"
                );

            let expression =
                input.value.trim();

            if (!expression) {

                showToast("Enter an expression");
                return;
            }

            expression =
                expression
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/")
                    .replace(/−/g, "-");

            /*
             * Only basic mathematical characters
             * are allowed.
             */

            if (
                !/^[0-9+\-*/().%\s]+$/.test(
                    expression
                )
            ) {

                result.textContent =
                    "Invalid expression.";

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
                        `"use strict";
                         return (${expression})`
                    )();

                if (!Number.isFinite(answer)) {
                    throw new Error();
                }

                result.innerHTML =
                    `Answer:
                    <strong>
                        ${formatNumber(answer)}
                    </strong>`;

            } catch {

                result.textContent =
                    "Invalid expression.";
            }
        }


        /* ---------------------------------------------
           AGE
        --------------------------------------------- */

        if (tool === "age") {

            document
                .getElementById("ageButton")
                ?.addEventListener("click", () => {

                    const value =
                        document.getElementById(
                            "ageDate"
                        ).value;

                    if (!value) {

                        showToast(
                            "Select your birth date"
                        );

                        return;
                    }

                    const birth =
                        new Date(
                            value + "T00:00:00"
                        );

                    const today =
                        new Date();

                    if (birth > today) {

                        showToast(
                            "Birth date cannot be in the future"
                        );

                        return;
                    }

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

                        days +=
                            new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                0
                            ).getDate();
                    }

                    if (months < 0) {

                        years--;
                        months += 12;
                    }

                    document.getElementById(
                        "ageResult"
                    ).innerHTML =
                        `Age:
                        <strong>
                            ${years} years,
                            ${months} months,
                            ${days} days
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           DAYS
        --------------------------------------------- */

        if (tool === "days") {

            document
                .getElementById("daysButton")
                ?.addEventListener("click", () => {

                    const start =
                        document.getElementById(
                            "daysStart"
                        ).value;

                    const end =
                        document.getElementById(
                            "daysEnd"
                        ).value;

                    if (!start || !end) {

                        showToast(
                            "Select both dates"
                        );

                        return;
                    }

                    const difference =
                        Math.abs(
                            new Date(end) -
                            new Date(start)
                        );

                    const days =
                        Math.round(
                            difference /
                            86400000
                        );

                    document.getElementById(
                        "daysResult"
                    ).innerHTML =
                        `Difference:
                        <strong>
                            ${days} days
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           UNIT
        --------------------------------------------- */

        if (tool === "unit") {

            document
                .getElementById("unitButton")
                ?.addEventListener("click", () => {

                    const value =
                        Number(
                            document.getElementById(
                                "unitValue"
                            ).value
                        );

                    const from =
                        document.getElementById(
                            "unitFrom"
                        ).value;

                    const to =
                        document.getElementById(
                            "unitTo"
                        ).value;

                    const units = {

                        m: 1,

                        km: 1000,

                        cm: 0.01,

                        ft: 0.3048,

                        in: 0.0254
                    };

                    if (!Number.isFinite(value)) {

                        showToast(
                            "Enter a value"
                        );

                        return;
                    }

                    const result =
                        value *
                        units[from] /
                        units[to];

                    document.getElementById(
                        "unitResult"
                    ).innerHTML =
                        `Result:
                        <strong>
                            ${formatNumber(result, 6)}
                        </strong>`;
                });
        }


        /* ---------------------------------------------
           WORD COUNTER
        --------------------------------------------- */

        if (tool === "word") {

            const input =
                document.getElementById(
                    "wordInput"
                );

            input?.addEventListener(
                "input",
                () => {

                    const text =
                        input.value;

                    const words =
                        text.trim()
                            ? text
                                .trim()
                                .split(/\s+/)
                                .length
                            : 0;

                    const characters =
                        text.length;

                    const lines =
                        text
                            ? text.split("\n").length
                            : 0;

                    document.getElementById(
                        "wordResult"
                    ).innerHTML =
                        `Words:
                        <strong>${words}</strong>
                        · Characters:
                        <strong>${characters}</strong>
                        · Lines:
                        <strong>${lines}</strong>`;
                }
            );
        }


        /* ---------------------------------------------
           TIMER
        --------------------------------------------- */

        if (tool === "timer") {

            clearInterval(timerInterval);

            timerSeconds =
                25 * 60;

            updateTimerDisplay();


            document
                .querySelectorAll(
                    ".timer-presets button"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const minutes =
                                Number(
                                    button.dataset.minutes
                                );

                            timerSeconds =
                                minutes * 60;

                            clearInterval(
                                timerInterval
                            );

                            timerInterval = null;

                            updateTimerDisplay();

                            const startButton =
                                document.getElementById(
                                    "timerStart"
                                );

                            if (startButton) {
                                startButton.textContent =
                                    "Start";
                            }
                        }
                    );
                });


            document
                .getElementById("timerStart")
                ?.addEventListener(
                    "click",
                    function () {

                        if (timerInterval) {

                            clearInterval(
                                timerInterval
                            );

                            timerInterval = null;

                            this.textContent =
                                "Start";

                            return;
                        }

                        this.textContent =
                            "Pause";

                        timerInterval =
                            setInterval(
                                () => {

                                    if (
                                        timerSeconds <= 0
                                    ) {

                                        clearInterval(
                                            timerInterval
                                        );

                                        timerInterval =
                                            null;

                                        this.textContent =
                                            "Start";

                                        showToast(
                                            "Timer finished"
                                        );

                                        return;
                                    }

                                    timerSeconds--;

                                    updateTimerDisplay();

                                },
                                1000
                            );
                    }
                );


            document
                .getElementById("timerReset")
                ?.addEventListener(
                    "click",
                    () => {

                        clearInterval(
                            timerInterval
                        );

                        timerInterval = null;

                        timerSeconds =
                            25 * 60;

                        updateTimerDisplay();

                        document.getElementById(
                            "timerStart"
                        ).textContent =
                            "Start";
                    }
                );
        }


        function updateTimerDisplay() {

            const display =
                document.getElementById(
                    "timerDisplay"
                );

            if (!display) return;

            const minutes =
                Math.floor(
                    timerSeconds / 60
                );

            const seconds =
                timerSeconds % 60;

            display.textContent =
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0");
        }


        /* ---------------------------------------------
           NOTES
        --------------------------------------------- */

        if (tool === "notes") {

            const input =
                document.getElementById(
                    "notesInput"
                );

            input.value =
                localStorage.getItem(
                    "studenttools_notes"
                ) || "";


            document
                .getElementById("saveNotes")
                ?.addEventListener(
                    "click",
                    () => {

                        localStorage.setItem(
                            "studenttools_notes",
                            input.value
                        );

                        showToast(
                            "Notes saved"
                        );
                    }
                );


            document
                .getElementById("clearNotes")
                ?.addEventListener(
                    "click",
                    () => {

                        input.value = "";

                        localStorage.removeItem(
                            "studenttools_notes"
                        );

                        showToast(
                            "Notes cleared"
                        );
                    }
                );
        }


        /* ---------------------------------------------
           RANDOM STUDY TASK
        --------------------------------------------- */

        if (tool === "random") {

            document
                .getElementById("randomButton")
                ?.addEventListener(
                    "click",
                    () => {

                        const tasks = [

                            "Revise one difficult topic.",

                            "Solve 5 practice questions.",

                            "Read your notes for 15 minutes.",

                            "Revise important formulas.",

                            "Make 5 flashcards.",

                            "Explain one concept in your own words.",

                            "Complete one pending homework question.",

                            "Take a short self-test.",

                            "Summarize today's lesson.",

                            "Review yesterday's difficult topic."
                        ];

                        const task =
                            tasks[
                                Math.floor(
                                    Math.random() *
                                    tasks.length
                                )
                            ];

                        document.getElementById(
                            "randomResult"
                        ).innerHTML =
                            `<strong>${task}</strong>`;
                    }
                );
        }


        /* ---------------------------------------------
           QR GENERATOR
        --------------------------------------------- */

        if (tool === "qr") {

            document
                .getElementById("qrButton")
                ?.addEventListener(
                    "click",
                    () => {

                        const text =
                            document.getElementById(
                                "qrInput"
                            ).value.trim();

                        const result =
                            document.getElementById(
                                "qrResult"
                            );

                        if (!text) {

                            showToast(
                                "Enter text or a URL"
                            );

                            return;
                        }

                        if (
                            typeof QRious ===
                            "undefined"
                        ) {

                            result.textContent =
                                "QR generator could not load.";

                            return;
                        }

                        result.innerHTML = "";

                        const canvas =
                            document.createElement(
                                "canvas"
                            );

                        result.appendChild(canvas);

                        new QRious({
                            element: canvas,
                            value: text,
                            size: 220,
                            level: "H"
                        });

                        showToast(
                            "QR code generated"
                        );
                    }
                );
        }


        /* ---------------------------------------------
           PERCENTAGE CHANGE
        --------------------------------------------- */

        if (tool === "change") {

            document
                .getElementById("changeButton")
                ?.addEventListener(
                    "click",
                    () => {

                        const oldValue =
                            Number(
                                document.getElementById(
                                    "changeOld"
                                ).value
                            );

                        const newValue =
                            Number(
                                document.getElementById(
                                    "changeNew"
                                ).value
                            );

                        if (
                            !Number.isFinite(oldValue) ||
                            !Number.isFinite(newValue) ||
                            oldValue === 0
                        ) {

                            showToast(
                                "Enter valid values"
                            );

                            return;
                        }

                        const change =
                            (
                                (newValue - oldValue) /
                                Math.abs(oldValue)
                            ) * 100;

                        let type;

                        if (change > 0) {
                            type = "increase";
                        } else if (change < 0) {
                            type = "decrease";
                        } else {
                            type = "no change";
                        }

                        document.getElementById(
                            "changeResult"
                        ).innerHTML =
                            `<strong>
                                ${formatNumber(
                                    Math.abs(change),
                                    2
                                )}%
                            </strong>
                            ${type}`;
                    }
                );
        }


        /* ---------------------------------------------
           TIME DIFFERENCE
        --------------------------------------------- */

        if (tool === "timecalc") {

            document
                .getElementById("timeButton")
                ?.addEventListener(
                    "click",
                    () => {

                        const start =
                            document.getElementById(
                                "timeStart"
                            ).value;

                        const end =
                            document.getElementById(
                                "timeEnd"
                            ).value;

                        if (!start || !end) {

                            showToast(
                                "Select both times"
                            );

                            return;
                        }

                        let [sh, sm] =
                            start
                                .split(":")
                                .map(Number);

                        let [eh, em] =
                            end
                                .split(":")
                                .map(Number);

                        let startMinutes =
                            sh * 60 + sm;

                        let endMinutes =
                            eh * 60 + em;

                        if (
                            endMinutes <
                            startMinutes
                        ) {

                            endMinutes +=
                                24 * 60;
                        }

                        const difference =
                            endMinutes -
                            startMinutes;

                        const hours =
                            Math.floor(
                                difference / 60
                            );

                        const minutes =
                            difference % 60;

                        document.getElementById(
                            "timeResult"
                        ).innerHTML =
                            `Difference:
                            <strong>
                                ${hours}h ${minutes}m
                            </strong>`;
                    }
                );
        }


        /* ---------------------------------------------
           EXAM COUNTDOWN
        --------------------------------------------- */

        if (tool === "countdown") {

            document
                .getElementById("countdownButton")
                ?.addEventListener(
                    "click",
                    () => {

                        const input =
                            document.getElementById(
                                "examDate"
                            );

                        const result =
                            document.getElementById(
                                "countdownResult"
                            );

                        if (!input.value) {

                            showToast(
                                "Select an exam date"
                            );

                            return;
                        }

                        const target =
                            new Date(
                                input.value
                            ).getTime();

                        if (
                            target <= Date.now()
                        ) {

                            result.innerHTML =
                                "The selected date has passed.";

                            return;
                        }

                        clearInterval(
                            countdownInterval
                        );

                        function updateCountdown() {

                            const remaining =
                                target -
                                Date.now();

                            if (
                                remaining <= 0
                            ) {

                                clearInterval(
                                    countdownInterval
                                );

                                result.innerHTML =
                                    `<strong>
                                        Time's up!
                                    </strong>`;

                                return;
                            }

                            const days =
                                Math.floor(
                                    remaining /
                                    (1000 * 60 * 60 * 24)
                                );

                            const hours =
                                Math.floor(
                                    (
                                        remaining /
                                        (1000 * 60 * 60)
                                    ) % 24
                                );

                            const minutes =
                                Math.floor(
                                    (
                                        remaining /
                                        (1000 * 60)
                                    ) % 60
                                );

                            const seconds =
                                Math.floor(
                                    (
                                        remaining /
                                        1000
                                    ) % 60
                                );

                            result.innerHTML =
                                `<strong>
                                    ${days}d
                                    ${hours}h
                                    ${minutes}m
                                    ${seconds}s
                                </strong>
                                <br>
                                remaining until your exam`;
                        }

                        updateCountdown();

                        countdownInterval =
                            setInterval(
                                updateCountdown,
                                1000
                            );
                    }
                );
        }
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    searchInput?.addEventListener(
        "input",
        filterTools
    );


    function filterTools() {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();

        const activeTab =
            document.querySelector(
                ".category-tab.active"
            );

        const category =
            activeTab?.dataset.category ||
            "all";

        let visible = 0;

        document
            .querySelectorAll(".tool-card")
            .forEach(card => {

                const name =
                    (
                        card.dataset.name ||
                        ""
                    ).toLowerCase();

                const cardCategory =
                    card.dataset.category ||
                    "";

                const matchesSearch =
                    !query ||
                    name.includes(query) ||
                    card.textContent
                        .toLowerCase()
                        .includes(query);

                const matchesCategory =
                    category === "all" ||
                    cardCategory === category;

                if (
                    matchesSearch &&
                    matchesCategory
                ) {

                    card.style.display = "";
                    visible++;

                } else {

                    card.style.display =
                        "none";
                }
            });

        if (noTools) {

            noTools.style.display =
                visible === 0
                    ? "block"
                    : "none";
        }
    }


    /* =====================================================
       CATEGORY TABS
       ===================================================== */

    document
        .querySelectorAll(".category-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-tab"
                        )
                        .forEach(item => {
                            item.classList.remove(
                                "active"
                            );
                        });

                    tab.classList.add(
                        "active"
                    );

                    filterTools();
                }
            );
        });


    /* =====================================================
       FAVORITES
       ===================================================== */

    document
        .querySelectorAll(".favorite-button")
        .forEach(button => {

            const card =
                button.closest(".tool-card");

            if (!card) return;

            const tool =
                card.dataset.tool;

            updateFavoriteButton(
                button,
                favorites.includes(tool)
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    if (
                        favorites.includes(
                            tool
                        )
                    ) {

                        favorites =
                            favorites.filter(
                                item =>
                                    item !== tool
                            );

                        updateFavoriteButton(
                            button,
                            false
                        );

                        showToast(
                            "Removed from favorites"
                        );

                    } else {

                        favorites.push(
                            tool
                        );

                        updateFavoriteButton(
                            button,
                            true
                        );

                        showToast(
                            "Added to favorites"
                        );
                    }

                    localStorage.setItem(
                        "studenttools_favorites",
                        JSON.stringify(
                            favorites
                        )
                    );
                }
            );
        });


    function updateFavoriteButton(
        button,
        active
    ) {

        if (active) {

            button.textContent = "★";
            button.classList.add(
                "active"
            );

        } else {

            button.textContent = "☆";
            button.classList.remove(
                "active"
            );
        }
    }


    /* =====================================================
       RECENT TOOLS
       ===================================================== */

    function saveRecent(tool) {

        recent =
            recent.filter(
                item => item !== tool
            );

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

        if (!recent.length) {

            recentTools.innerHTML =
                `<span class="recent-placeholder">
                    Your recently used tools will appear here.
                </span>`;

            return;
        }

        recent.forEach(tool => {

            const card =
                document.querySelector(
                    `.tool-card[data-tool="${tool}"]`
                );

            if (!card) return;

            const chip =
                document.createElement(
                    "button"
                );

            chip.className =
                "recent-chip";

            chip.textContent =
                card.dataset.name ||
                tool;

            chip.addEventListener(
                "click",
                () => {
                    openTool(tool);
                }
            );

            recentTools.appendChild(
                chip
            );
        });
    }


    renderRecent();


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /* Ctrl + K = Search */

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                searchInput?.focus();
            }


            /* Escape = Hide workspace */

            if (
                event.key === "Escape" &&
                workspace
            ) {

                workspace.style.display =
                    "none";
            }
        }
    );


    /* =====================================================
       HELPERS
       ===================================================== */

    function formatNumber(
        number,
        decimals = 4
    ) {

        if (!Number.isFinite(number)) {
            return "Invalid";
        }

        return Number(
            number.toFixed(decimals)
        ).toLocaleString();
    }


    function gcd(a, b) {

        a = Math.abs(a);
        b = Math.abs(b);

        while (b !== 0) {

            const temp = b;

            b = a % b;

            a = temp;
        }

        return a || 1;
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    filterTools();

});
