const SHEET_ID = "1HVoEKPbWYC3CjbWPPsLIK3EcoW55YX3wh7dRs_vYoms";
const SHEET_NAME = "Sheet11";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

// 🔢 Format numbers to 2 decimal places
function format(value) {
    const num = Number(value);
    if (isNaN(num)) return value || "";
    return num.toFixed(2);
}

// 📊 Parse Google Sheets GViz JSON safely
function parseGoogleData(text) {
    const jsonText = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
    if (!jsonText) {
        console.error("Failed to parse Google response");
        return [];
    }

    const json = JSON.parse(jsonText[1]);
    return json.table.rows.map(row =>
        row.c.map(cell => (cell ? cell.v : ""))
    );
}

// 🚀 Load leaderboard
async function loadLeaderboard() {
    try {
        const res = await fetch(URL);
        const text = await res.text();

        const rows = parseGoogleData(text);

        const tbody = document.getElementById("leaderboard-body");
        tbody.innerHTML = "";

        rows.forEach((row, index) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row[0] || ""}</td>
                <td>${format(row[1])}</td>
                <td>${format(row[2])}</td>
                <td>${format(row[3])}</td>
                <td>${format(row[4])}</td>
                <td>${format(row[5])}</td>
                <td>${format(row[6])}</td>
                <td>${format(row[7])}</td>
                <td>${format(row[8])}</td>
                <td>${format(row[9])}</td>
                <td>${format(row[10])}</td>
                <td>${format(row[11])}</td>
                <td>${row[12] || ""}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Leaderboard load error:", err);
    }
}

// 🔁 Initial load
loadLeaderboard();

// 🔄 Auto refresh every 15 seconds
setInterval(loadLeaderboard, 15000);