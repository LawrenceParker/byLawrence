const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxvQP4EqINqRxF8Mcwz4USfZqXXmmY9VoAFvmGtIHI0_US58MqXu0TeYdXCszRlkJxas3Jch2MPuH/pub?gid=523302871&single=true&output=csv";

async function loadLeaderboard() {
    try {
        const res = await fetch(CSV_URL);
        const text = await res.text();

        const rows = text.trim().split("\n").map(r => r.split(","));

        // remove header row
        rows.shift();

        const tbody = document.getElementById("leaderboard-body");
        tbody.innerHTML = "";

        rows.forEach((row, index) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row[0] || ""}</td>
                <td>${row[1] || ""}</td>
                <td>${row[2] || ""}</td>
                <td>${row[3] || ""}</td>
                <td>${row[4] || ""}</td>
                <td>${row[5] || ""}</td>
                <td>${row[6] || ""}</td>
                <td>${row[7] || ""}</td>
                <td>${row[8] || ""}</td>
                <td>${row[9] || ""}</td>
                <td>${row[10] || ""}</td>
                <td>${row[11] || ""}</td>
                <td>${row[12] || ""}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Failed to load CSV:", err);
    }
}

// initial load
loadLeaderboard();

// auto refresh every 30 seconds
setInterval(loadLeaderboard, 30000);