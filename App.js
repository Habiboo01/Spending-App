// ==========================
// MISSED DAYS DETECTION
// ==========================

const missedDaysSection = document.getElementById("missedDaysSection");
const missedDaysContainer = document.getElementById("missedDaysContainer");
const saveMissedDaysBtn = document.getElementById("saveMissedDaysBtn");

saveMissedDaysBtn?.addEventListener("click", saveMissedDays);

function detectMissedDays() {

    const today = new Date();
    const entriesDates = appData.entries.map(e => e.date);

    let missed = [];

    for (let i = 1; i <= 7; i++) {

        let d = new Date();
        d.setDate(today.getDate() - i);

        const dateStr = d.toISOString().split("T")[0];

        const exists = entriesDates.includes(dateStr);

        if (!exists) {
            missed.push(dateStr);
        }
    }

    if (missed.length > 0) {
        renderMissedDays(missed);
        missedDaysSection.classList.remove("hidden");
    }
}

function renderMissedDays(missed) {

    missedDaysContainer.innerHTML = "";

    missed.forEach(date => {

        const row = document.createElement("div");
        row.className = "missed-day-row";

        row.innerHTML = `
            <label>${date}</label>
            <input type="number" data-date="${date}" placeholder="Amount">
        `;

        missedDaysContainer.appendChild(row);
    });
}

function saveMissedDays() {

    const inputs = missedDaysContainer.querySelectorAll("input");

    inputs.forEach(input => {

        const date = input.dataset.date;
        const amount = Number(input.value);

        if (!amount || amount <= 0) return;

        const existingIndex = appData.entries.findIndex(
            e => e.date === date
        );

        const entry = {
            date,
            amount,
            note: "Recovered entry"
        };

        if (existingIndex >= 0) {
            appData.entries[existingIndex] = entry;
        } else {
            appData.entries.push(entry);
        }
    });

    saveData();

    missedDaysSection.classList.add("hidden");

    loadDashboard();
    loadHistory();
}
// ==========================
// REGISTER SERVICE WORKER
// ==========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registered ✔");
            })
            .catch((err) => {
                console.log("Service Worker failed:", err);
            });
    });
}