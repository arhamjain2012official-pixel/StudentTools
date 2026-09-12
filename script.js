/* =========================================================
   STUDENTTOOLS — MAIN SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
       ========================= */

    const root = document.documentElement;

    const themeBtn = document.getElementById("themeBtn");
    const toolSearch = document.getElementById("toolSearch");
    const toolGrid = document.getElementById("toolGrid");
    const noTools = document.getElementById("noTools");
    const recentTools = document.getElementById("recentTools");
    const workspace = document.getElementById("workspace");
    const workspaceHint = document.getElementById("workspaceHint");
    const workspaceBox = document.getElementById("workspaceBox");
    const toast = document.getElementById("toast");

    let timerInterval = null;
    let timerSeconds = 25 * 60;

    /* =========================
       STORAGE
       ========================= */

    let favorites = JSON.parse(localStorage.getItem("studenttools_favorites") || "[]");
    let recent = JSON.parse(localStorage.getItem("studenttools_recent") || "[]");

    /* =========================
       THEME
       ========================= */

    const savedTheme = localStorage.getItem("studenttools_theme");

    if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
        updateThemeIcon();
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const dark = root.getAttribute("data-theme") === "dark";

            if (dark) {
                root.removeAttribute("data-theme");
                localStorage.setItem("studenttools_theme", "light");
            } else {
                root.setAttribute("data-theme", "dark");
                localStorage.setItem("studenttools_theme", "dark");
            }

            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (!themeBtn) return;

        const dark = root.getAttribute("data-theme") === "dark";

        themeBtn.innerHTML = dark ? "☀️" : "🌙";
        themeBtn.setAttribute(
            "aria-label",
            dark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    /* =========================
       TOAST
       ========================= */

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(showToast.timeout);

        showToast.timeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }

    /* =========================
       SEARCH
       ========================= */

    if (toolSearch) {
        toolSearch.addEventListener("input", () => {
            filterTools();
        });
    }

    function filterTools() {
        const query = (toolSearch?.value || "").toLowerCase().trim();
        const activeCategory =
            document.querySelector(".category-tab.active")?.dataset.category || "all";

        let visible = 0;

        document.querySelectorAll(".tool-card").forEach(card => {

            const name = (card.dataset.name || "").toLowerCase();
            const category = card.dataset.category || "";

            const matchesSearch =
                !query ||
                name.includes(query) ||
                card.textContent.toLowerCase().includes(query);

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = "";
                visible++;
            } else {
                card.style.display = "none";
            }
        });

        if (noTools) {
            noTools.style.display = visible === 0 ? "block" : "none";
        }
    }

    /* =========================
       CATEGORY TABS
       ========================= */

    document.querySelectorAll(".category-tab").forEach(tab => {
        tab.addEventListener("click", () => {

            document.querySelectorAll(".category-tab").forEach(t => {
                t.classList.remove("active");
            });

            tab.classList.add("active");

            filterTools();
        });
    });

    /* =========================
       FAVORITES
       ========================= */

    document.querySelectorAll(".favorite-button").forEach(button => {

        const card = button.closest(".tool-card");
        if (!card) return;

        const tool = card.dataset.tool;

        if (favorites.includes(tool)) {
            button.classList.add("active");
            button.textContent = "★";
        }

        button.addEventListener("click", event => {
            event.stopPropagation();

            if (favorites.includes(tool)) {
                favorites = favorites.filter(item => item !== tool);
                button.classList.remove("active");
                button.textContent = "☆";
                showToast("Removed from favorites");
            } else {
                favorites.push(tool);
                button.classList.add("active");
                button.textContent = "★";
                showToast("Added to favorites");
            }

            localStorage.setItem(
                "studenttools_favorites",
                JSON.stringify(favorites)
            );
        });
    });

    /* =========================
       OPEN TOOL BUTTONS
       ========================= */

    document.querySelectorAll(".open-tool").forEach(button => {

        button.addEventListener("click", () => {
            const tool = button.dataset.tool;
            openTool(tool);
        });
    });

    /* =========================
       RECENT TOOLS
       ========================= */

    function saveRecent(tool) {

        recent = recent.filter(item => item !== tool);
        recent.unshift(tool);

        recent = recent.slice(0, 6);

        localStorage.setItem(
            "studenttools_recent",
            JSON.stringify(recent)
        );

        renderRecent();
    }

    function renderRecent() {

        if (!recentTools) return;

        recentTools.innerHTML = "";

        if (recent.length === 0) {
            recentTools.innerHTML =
                `<span class="recent-empty">Your recently used tools will appear here.</span>`;
            return;
        }

        recent.forEach(tool => {

            const card = document.querySelector(
                `.tool-card[data-tool="${tool}"]`
            );

            if (!card) return;

            const name = card.dataset.name || tool;

            const chip = document.createElement("button");
            chip.className = "recent-chip";
            chip.textContent = name;

            chip.addEventListener("click", () => {
                openTool(tool);
            });

            recentTools.appendChild(chip);
        });
    }

    renderRecent();

    /* =========================
       OPEN TOOL
       ========================= */

    window.openTool = function(tool) {

        if (!workspace || !workspaceBox) return;

        saveRecent(tool);

        workspace.style.display = "block";

        const title = getToolTitle(tool);

        if (workspaceHint) {
            workspaceHint.textContent = title;
        }

        workspaceBox.innerHTML = getToolHTML(tool);

        workspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        attachToolEvents(tool);
    };

    function getToolTitle(tool) {

        const card = document.querySelector(
            `.tool-card[data-tool="${tool}"]`
        );

        return card?.dataset.name || "Student Tool";
    }

    /* =========================
       TOOL HTML
       ========================= */

    function getToolHTML(tool) {

        switch (tool) {

            case "percentage":
                return `
                    <div class="tool-form">
                        <div class="form-grid">
                            <div class="field">
                                <label>Percentage (%)</label>
                                <input id="percentValue" type="number" placeholder="20">
                            </div>

                            <div class="field">
                                <label>Number</label>
                                <input id="percentNumber" type="number" placeholder="500">
                            </div>
                        </div>

                        <button class="primary-button" id="percentCalculate">
                            Calculate
                        </button>

                        <div class="result-box" id="percentResult">
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
                                <input id="gradeObtained" type="number">
                            </div>

                            <div class="field">
                                <label>Total Marks</label>
                                <input id="gradeTotal" type="number">
                            </div>
                        </div>

                        <button class="primary-button" id="gradeCalculate">
                            Calculate Grade
                        </button>

                        <div class="result-box" id="gradeResult">
                            Enter your marks.
                        </div>
                    </div>
                `;

            case "gpa":
                return `
                    <div class="tool-form">
                        <div class="field">
                            <label>Enter grades separated by commas</label>
                            <input id="gpaGrades" placeholder="8, 9, 7, 10">
                        </div>

                        <button class="primary-button" id="gpaCalculate">
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
                            <label>Numbers separated by commas</label>
                            <input id="averageNumbers" placeholder="10, 20, 30, 40">
                        </div>

                        <button class="primary-button" id="averageCalculate">
                            Calculate Average
                        </button>

                        <div class="result-box" id="averageResult">
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
                                <input id="discountPrice" type="number">
                            </div>

                            <div class="field">
                                <label>Discount (%)</label>
                                <input id="discountPercent" type="number">
                            </div>
                        </div>

                        <button class="primary-button" id="discountCalculate">
                            Calculate
                        </button>

                        <div class="result-box" id="discountResult">
                            Enter price and discount.
                        </div>
                    </div>
                `;

            case "fraction":
                return `
                    <div class="tool-form">
                        <div class="form-grid">
                            <div class="field">
                                <label>Numerator 1</label>
                                <input id="fracA" type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 1</label>
                                <input id="fracB" type="number">
                            </div>

                            <div class="field">
                                <label>Numerator 2</label>
                                <input id="fracC" type="number">
                            </div>

                            <div class="field">
                                <label>Denominator 2</label>
                                <input id="fracD" type="number">
                            </div>
                        </div>

                        <button class="primary-button" id="fractionCalculate">
                            Add Fractions
                        </button>

                        <div class="result-box" id="fractionResult">
                            Enter both fractions.
                        </div>
                    </div>
                `;

            case "calculator":
                return `
                    <div class="tool-form">
                        <div class="field">
                            <label>Expression</label>
                            <input id="calcExpression"
                                   placeholder="25 × 4 + 10"
                                   autocomplete="off">
                        </div>

                        <button class="primary-button" id="calcCalculate">
                            Calculate
                        </button>

                        <div class="result-box" id="calcResult">
                            Enter a mathematical expression.
                        </div>
                    </div>
                `;

            case "age":
                return `
                    <div class="tool-form">
                        <div class="field">
                            <label>Date of Birth</label>
                            <input id="birthDate" type="date">
                        </div>

                        <button class="primary-button" id="ageCalculate">
                            Calculate Age
                        </button>

                        <div class="result-box" id="ageResult">
                            Enter your date of birth.
                        </div>
                    </div>
                `;

            case "days":
                return `
                    <div class="tool-form">
                        <div class="form-grid">
                            <div class="field">
                                <label>Start Date</label>
                                <input id="daysStart" type="date">
                            </div>

                            <div class="field">
                                <label>End Date</label>
                                <input id="daysEnd" type="date">
                            </div>
                        </div>

                        <button class="primary-button" id="daysCalculate">
                            Calculate Difference
                        </button>

                        <div class="result-box" id="daysResult">
                            Select two dates.
                        </div>
                    </div>
                `;

            case "unit":
                return `
                    <div class="tool-form">
                        <div class="form-grid">
                            <div class="field">
                                <label>Value</label>
                                <input id="unitValue" type="number">
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

                        <button class="primary-button" id="unitCalculate">
                            Convert
                        </button>

                        <div class="result-box" id="unitResult">
                            Enter a value.
                        </div>
                    </div>
                `;

            case "word":
                return `
                    <div class="tool-form">
                        <div class="field">
                            <label>Paste or type your text</label>
                            <textarea id="wordText"
                                      rows="8"
                                      placeholder="Start typing..."></textarea>
                        </div>

                        <div class="result-box" id="wordResult">
                            Words: 0 · Characters: 0 · Sentences: 0
                        </div>
                    </div>
                `;

            case "timer":
                return `
                    <div class="tool-form">

                        <div class="timer-display" id="timerDisplay">
                            25:00
                        </div>

                        <div class="timer-presets">
                            <button data-minutes="5">5 min</button>
                            <button data-minutes="15">15 min</button>
                            <button data-minutes="25">25 min</button>
                            <button data-minutes="45">45 min</button>
                        </div>

                        <div class="hero-buttons">
                            <button class="primary-button" id="timerStart">
                                Start
                            </button>

                            <button class="secondary-button" id="timerReset">
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
                                id="notesArea"
                                class="notes-area"
                                rows="12"
                                placeholder="Write your notes here..."
                            ></textarea>
                        </div>

                        <div class="hero-buttons">
                            <button class="primary-button" id="saveNotes">
                                Save Notes
                            </button>

                            <button class="secondary-button" id="clearNotes">
                                Clear
                            </button>
                        </div>
                    </div>
                `;

            case "random":
                return `
                    <div class="tool-form">

                        <div class="result-box" id="randomResult">
                            Click the button to get a study task.
                        </div>

                        <button class="primary-button" id="randomTask">
                            Pick a Task
                        </button>

                    </div>
                `;

            case "qr":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Text or URL</label>
                            <input id="qrText"
                                   placeholder="https://example.com">
                        </div>

                        <button class="primary-button" id="qrGenerate">
                            Generate QR
                        </button>

                        <div class="qr-wrap" id="qrResult"></div>

                    </div>
                `;

            case "change":
                return `
                    <div class="tool-form">

                        <div class="form-grid">

                            <div class="field">
                                <label>Original Value</label>
                                <input id="changeOld" type="number">
                            </div>

                            <div class="field">
                                <label>New Value</label>
                                <input id="changeNew" type="number">
                            </div>

                        </div>

                        <button class="primary-button" id="changeCalculate">
                            Calculate Change
                        </button>

                        <div class="result-box" id="changeResult">
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
                                <input id="timeStart" type="time">
                            </div>

                            <div class="field">
                                <label>End Time</label>
                                <input id="timeEnd" type="time">
                            </div>

                        </div>

                        <button class="primary-button" id="timeCalculate">
                            Calculate Difference
                        </button>

                        <div class="result-box" id="timeResult">
                            Select two times.
                        </div>

                    </div>
                `;

            case "countdown":
                return `
                    <div class="tool-form">

                        <div class="field">
                            <label>Exam Date</label>
                            <input id="examDate" type="datetime-local">
                        </div>

                        <button class="primary-button" id="countdownStart">
                            Start Countdown
                        </button>

                        <div class="result-box" id="countdownResult">
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

    /* =========================
       TOOL EVENTS
       ========================= */

    function attachToolEvents(tool) {

        switch (tool) {

            /* PERCENTAGE */

            case "percentage":
                document.getElementById("percentCalculate")
                    ?.addEventListener("click", () => {

                        const p = Number(
                            document.getElementById("percentValue").value
                        );

                        const n = Number(
                            document.getElementById("percentNumber").value
                        );

                        if (!isFinite(p) || !isFinite(n)) {
                            showToast("Enter valid numbers");
                            return;
                        }

                        document.getElementById("percentResult").innerHTML =
                            `<strong>${p}% of ${n} = ${formatNumber((p / 100) * n)}</strong>`;
                    });
                break;


            /* GRADE */

            case "grade":
                document.getElementById("gradeCalculate")
                    ?.addEventListener("click", () => {

                        const obtained = Number(
                            document.getElementById("gradeObtained").value
                        );

                        const total = Number(
                            document.getElementById("gradeTotal").value
                        );

                        if (!isFinite(obtained) || !isFinite(total) || total <= 0) {
                            showToast("Enter valid marks");
                            return;
                        }

                        const percentage = (obtained / total) * 100;

                        let grade;

                        if (percentage >= 90) grade = "A+";
                        else if (percentage >= 80) grade = "A";
                        else if (percentage >= 70) grade = "B";
                        else if (percentage >= 60) grade = "C";
                        else if (percentage >= 50) grade = "D";
                        else grade = "F";

                        document.getElementById("gradeResult").innerHTML =
                            `<strong>${formatNumber(percentage)}%</strong><br>
                             Grade: <strong>${grade}</strong>`;
                    });
                break;


            /* GPA */

            case "gpa":
                document.getElementById("gpaCalculate")
                    ?.addEventListener("click", () => {

                        const values = document.getElementById("gpaGrades")
                            .value
                            .split(",")
                            .map(Number)
                            .filter(n => isFinite(n));

                        if (!values.length) {
                            showToast("Enter your grades");
                            return;
                        }

                        const avg =
                            values.reduce((a, b) => a + b, 0) / values.length;

                        document.getElementById("gpaResult").innerHTML =
                            `Average GPA: <strong>${formatNumber(avg, 2)}</strong>`;
                    });
                break;


            /* AVERAGE */

            case "average":
                document.getElementById("averageCalculate")
                    ?.addEventListener("click", () => {

                        const values = document.getElementById("averageNumbers")
                            .value
                            .split(",")
                            .map(Number)
                            .filter(n => isFinite(n));

                        if (!values.length) {
                            showToast("Enter numbers");
                            return;
                        }

                        const total =
                            values.reduce((a, b) => a + b, 0);

                        const average = total / values.length;

                        document.getElementById("averageResult").innerHTML =
                            `Average: <strong>${formatNumber(average)}</strong>`;
                    });
                break;


            /* DISCOUNT */

            case "discount":
                document.getElementById("discountCalculate")
                    ?.addEventListener("click", () => {

                        const price = Number(
                            document.getElementById("discountPrice").value
                        );

                        const discount = Number(
                            document.getElementById("discountPercent").value
                        );

                        if (!isFinite(price) || !isFinite(discount)) {
                            showToast("Enter valid values");
                            return;
                        }

                        const saved = price * discount / 100;
                        const finalPrice = price - saved;

                        document.getElementById("discountResult").innerHTML =
                            `You save: <strong>${formatNumber(saved)}</strong><br>
                             Final price: <strong>${formatNumber(finalPrice)}</strong>`;
                    });
                break;


            /* FRACTION */

            case "fraction":
                document.getElementById("fractionCalculate")
                    ?.addEventListener("click", () => {

                        const a = Number(document.getElementById("fracA").value);
                        const b = Number(document.getElementById("fracB").value);
                        const c = Number(document.getElementById("fracC").value);
                        const d = Number(document.getElementById("fracD").value);

                        if (
                            !isFinite(a) ||
                            !isFinite(b) ||
                            !isFinite(c) ||
                            !isFinite(d) ||
                            b === 0 ||
                            d === 0
                        ) {
                            showToast("Enter valid fractions");
                            return;
                        }

                        const numerator = a * d + c * b;
                        const denominator = b * d;

                        const simplified =
                            simplifyFraction(numerator, denominator);

                        document.getElementById("fractionResult").innerHTML =
                            `Result: <strong>${simplified.numerator}/${simplified.denominator}</strong>`;
                    });
                break;


            /* CALCULATOR */

            case "calculator":
                document.getElementById("calcCalculate")
                    ?.addEventListener("click", calculateExpression);

                document.getElementById("calcExpression")
                    ?.addEventListener("keydown", event => {
                        if (event.key === "Enter") {
                            calculateExpression();
                        }
                    });
                break;


            /* AGE */

            case "age":
                document.getElementById("ageCalculate")
                    ?.addEventListener("click", () => {

                        const value =
                            document.getElementById("birthDate").value;

                        if (!value) {
                            showToast("Select your birth date");
                            return;
                        }

                        const birth = new Date(value + "T00:00:00");
                        const today = new Date();

                        if (birth > today) {
                            showToast("Birth date cannot be in the future");
                            return;
                        }

                        let years =
                            today.getFullYear() - birth.getFullYear();

                        let months =
                            today.getMonth() - birth.getMonth();

                        let days =
                            today.getDate() - birth.getDate();

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
                            `Age: <strong>${years} years, ${months} months, ${days} days</strong>`;
                    });
                break;


            /* DAYS */

            case "days":
                document.getElementById("daysCalculate")
                    ?.addEventListener("click", () => {

                        const start =
                            document.getElementById("daysStart").value;

                        const end =
                            document.getElementById("daysEnd").value;

                        if (!start || !end) {
                            showToast("Select both dates");
                            return;
                        }

                        const first = new Date(start);
                        const second = new Date(end);

                        const difference =
                            Math.abs(second - first);

                        const days =
                            Math.round(difference / 86400000);

                        document.getElementById("daysResult").innerHTML =
                            `Difference: <strong>${days} day${days === 1 ? "" : "s"}</strong>`;
                    });
                break;


            /* UNIT */

            case "unit":
                document.getElementById("unitCalculate")
                    ?.addEventListener("click", () => {

                        const value =
                            Number(document.getElementById("unitValue").value);

                        const from =
                            document.getElementById("unitFrom").value;

                        const to =
                            document.getElementById("unitTo").value;

                        if (!isFinite(value)) {
                            showToast("Enter a value");
                            return;
                        }

                        const meters = {
                            m: 1,
                            km: 1000,
                            cm: 0.01,
                            ft: 0.3048,
                            in: 0.0254
                        };

                        const result =
                            value * meters[from] / meters[to];

                        document.getElementById("unitResult").innerHTML =
                            `Result: <strong>${formatNumber(result, 6)}</strong>`;
                    });
                break;


            /* WORD COUNTER */

            case "word":

                const wordText = document.getElementById("wordText");
                const wordResult = document.getElementById("wordResult");

                wordText?.addEventListener("input", () => {

                    const text = wordText.value;

                    const words = text.trim()
                        ? text.trim().split(/\s+/).length
                        : 0;

                    const characters = text.length;

                    const sentences = text
                        .split(/[.!?]+/)
                        .filter(s => s.trim().length > 0)
                        .length;

                    wordResult.innerHTML =
                        `Words: <strong>${words}</strong> ·
                         Characters: <strong>${characters}</strong> ·
                         Sentences: <strong>${sentences}</strong>`;
                });

                break;


            /* TIMER */

            case "timer":
                setupTimer();
                break;


            /* NOTES */

            case "notes":
                setupNotes();
                break;


            /* RANDOM STUDY TASK */

            case "random":

                document.getElementById("randomTask")
                    ?.addEventListener("click", () => {

                        const tasks = [
                            "Review your class notes for 15 minutes.",
                            "Solve 5 practice questions.",
                            "Read one textbook section carefully.",
                            "Revise important formulas.",
                            "Make a short summary of today's topic.",
                            "Test yourself without looking at your notes.",
                            "Explain one concept aloud in your own words.",
                            "Complete one pending homework question.",
                            "Revise yesterday's difficult topic.",
                            "Create 5 flashcards."
                        ];

                        const task =
                            tasks[Math.floor(Math.random() * tasks.length)];

                        document.getElementById("randomResult").innerHTML =
                            `<strong>${task}</strong>`;
                    });

                break;


            /* QR */

            case "qr":
                setupQR();
                break;


            /* PERCENTAGE CHANGE */

            case "change":
                document.getElementById("changeCalculate")
                    ?.addEventListener("click", () => {

                        const oldValue =
                            Number(document.getElementById("changeOld").value);

                        const newValue =
                            Number(document.getElementById("changeNew").value);

                        if (!isFinite(oldValue) || !isFinite(newValue) || oldValue === 0) {
                            showToast("Enter valid values");
                            return;
                        }

                        const change =
                            ((newValue - oldValue) / Math.abs(oldValue)) * 100;

                        const direction =
                            change > 0
                                ? "increase"
                                : change < 0
                                    ? "decrease"
                                    : "no change";

                        document.getElementById("changeResult").innerHTML =
                            `<strong>${formatNumber(Math.abs(change), 2)}%</strong> ${direction}`;
                    });
                break;


            /* TIME DIFFERENCE */

            case "timecalc":
                document.getElementById("timeCalculate")
                    ?.addEventListener("click", () => {

                        const start =
                            document.getElementById("timeStart").value;

                        const end =
                            document.getElementById("timeEnd").value;

                        if (!start || !end) {
                            showToast("Select both times");
                            return;
                        }

                        let [sh, sm] = start.split(":").map(Number);
                        let [eh, em] = end.split(":").map(Number);

                        let startMinutes = sh * 60 + sm;
                        let endMinutes = eh * 60 + em;

                        if (endMinutes < startMinutes) {
                            endMinutes += 24 * 60;
                        }

                        const difference =
                            endMinutes - startMinutes;

                        const hours =
                            Math.floor(difference / 60);

                        const minutes =
                            difference % 60;

                        document.getElementById("timeResult").innerHTML =
                            `Difference: <strong>${hours}h ${minutes}m</strong>`;
                    });
                break;


            /* COUNTDOWN */

            case "countdown":
                setupCountdown();
                break;
        }
    }

    /* =========================
       CALCULATOR
       ========================= */

    function calculateExpression() {

        const input =
            document.getElementById("calcExpression");

        const result =
            document.getElementById("calcResult");

        if (!input || !result) return;

        let expression = input.value.trim();

        if (!expression) {
            showToast("Enter an expression");
            return;
        }

        expression = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/−/g, "-")
            .replace(/,/g, "");

        /*
         * Only allow basic mathematical characters.
         * This prevents arbitrary JavaScript from being executed.
         */

        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
            result.textContent = "Only basic mathematical expressions are allowed.";
            return;
        }

        try {

            const safeExpression =
                expression.replace(
                    /(\d+(?:\.\d+)?)%/g,
                    "($1/100)"
                );

            const value = Function(
                `"use strict"; return (${safeExpression})`
            )();

            if (!isFinite(value)) {
                throw new Error();
            }

            result.innerHTML =
                `Answer: <strong>${formatNumber(value, 10)}</strong>`;

        } catch {
            result.textContent =
                "Invalid expression.";
        }
    }

    /* =========================
       TIMER
       ========================= */

    function setupTimer() {

        clearInterval(timerInterval);

        timerSeconds = 25 * 60;

        updateTimerDisplay();

        document.querySelectorAll(".timer-presets button")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const minutes =
                        Number(button.dataset.minutes);

                    timerSeconds = minutes * 60;

                    clearInterval(timerInterval);

                    updateTimerDisplay();

                    showToast(`${minutes}-minute timer selected`);
                });
            });

        document.getElementById("timerStart")
            ?.addEventListener("click", () => {

                if (timerInterval) {

                    clearInterval(timerInterval);
                    timerInterval = null;

                    document.getElementById("timerStart").textContent =
                        "Start";

                    return;
                }

                document.getElementById("timerStart").textContent =
                    "Pause";

                timerInterval = setInterval(() => {

                    if (timerSeconds <= 0) {

                        clearInterval(timerInterval);
                        timerInterval = null;

                        document.getElementById("timerStart").textContent =
                            "Start";

                        updateTimerDisplay();

                        showToast("Timer finished");

                        return;
                    }

                    timerSeconds--;
                    updateTimerDisplay();

                }, 1000);
            });

        document.getElementById("timerReset")
            ?.addEventListener("click", () => {

                clearInterval(timerInterval);
                timerInterval = null;

                timerSeconds = 25 * 60;

                updateTimerDisplay();

                const start =
                    document.getElementById("timerStart");

                if (start) start.textContent = "Start";
            });
    }

    function updateTimerDisplay() {

        const display =
            document.getElementById("timerDisplay");

        if (!display) return;

        const minutes =
            Math.floor(timerSeconds / 60);

        const seconds =
            timerSeconds % 60;

        display.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    /* =========================
       NOTES
       ========================= */

    function setupNotes() {

        const area =
            document.getElementById("notesArea");

        if (!area) return;

        area.value =
            localStorage.getItem("studenttools_notes") || "";

        document.getElementById("saveNotes")
            ?.addEventListener("click", () => {

                localStorage.setItem(
                    "studenttools_notes",
                    area.value
                );

                showToast("Notes saved");
            });

        document.getElementById("clearNotes")
            ?.addEventListener("click", () => {

                area.value = "";

                localStorage.removeItem(
                    "studenttools_notes"
                );

                showToast("Notes cleared");
            });
    }

    /* =========================
       QR GENERATOR
       ========================= */

    function setupQR() {

        document.getElementById("qrGenerate")
            ?.addEventListener("click", () => {

                const text =
                    document.getElementById("qrText").value.trim();

                const result =
                    document.getElementById("qrResult");

                if (!text) {
                    showToast("Enter text or a URL");
                    return;
                }

                if (typeof QRious === "undefined") {

                    result.innerHTML =
                        `<p>QR generator library could not be loaded.</p>`;

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

                showToast("QR code generated");
            });
    }

    /* =========================
       COUNTDOWN
       ========================= */

    let countdownInterval = null;

    function setupCountdown() {

        clearInterval(countdownInterval);

        document.getElementById("countdownStart")
            ?.addEventListener("click", () => {

                const input =
                    document.getElementById("examDate");

                const result =
                    document.getElementById("countdownResult");

                if (!input.value) {
                    showToast("Select an exam date");
                    return;
                }

                const target =
                    new Date(input.value).getTime();

                if (target <= Date.now()) {
                    result.textContent =
                        "The selected date has already passed.";
                    return;
                }

                clearInterval(countdownInterval);

                function updateCountdown() {

                    const remaining =
                        target - Date.now();

                    if (remaining <= 0) {

                        clearInterval(countdownInterval);

                        result.innerHTML =
                            `<strong>Time's up!</strong>`;

                        return;
                    }

                    const days =
                        Math.floor(
                            remaining / (1000 * 60 * 60 * 24)
                        );

                    const hours =
                        Math.floor(
                            (remaining / (1000 * 60 * 60)) % 24
                        );

                    const minutes =
                        Math.floor(
                            (remaining / (1000 * 60)) % 60
                        );

                    const seconds =
                        Math.floor(
                            (remaining / 1000) % 60
                        );

                    result.innerHTML =
                        `<strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong><br>
                         remaining until your exam`;
                }

                updateCountdown();

                countdownInterval =
                    setInterval(updateCountdown, 1000);
            });
    }

    /* =========================
       FRACTION HELPERS
       ========================= */

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

    function simplifyFraction(numerator, denominator) {

        if (denominator < 0) {
            numerator *= -1;
            denominator *= -1;
        }

        const divisor =
            gcd(numerator, denominator);

        return {
            numerator: numerator / divisor,
            denominator: denominator / divisor
        };
    }

    /* =========================
       NUMBER FORMAT
       ========================= */

    function formatNumber(number, decimals = 4) {

        if (!isFinite(number)) return "Invalid";

        return Number(
            Number(number).toFixed(decimals)
        ).toLocaleString();
    }

    /* =========================
       KEYBOARD SHORTCUT
       ========================= */

    document.addEventListener("keydown", event => {

        /* Ctrl + K → focus search */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            toolSearch?.focus();
        }

        /* Escape → close workspace */

        if (event.key === "Escape") {

            if (workspace) {
                workspace.style.display = "none";
            }
        }
    });

    /* =========================
       INITIAL SEARCH STATE
       ========================= */

    filterTools();

});
