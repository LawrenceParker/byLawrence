const SHEET_ID = "1HVoEKPbWYC3CjbWPPsLIK3EcoW55YX3wh7dRs_vYoms";
const SHEET_NAME = "Sheet11";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

let previousData = [];

function parseGoogleJSON(text) {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    return json.table.rows.map(r => r.c.map(c => c ? c.v : ""));
}

// 🎨 Team color system (edit these freely)
const teamColors = {
    "Red": "#ef4444",
    "Blue": "#3b82f6",
    "Green": "#22c55e",
    "Default": "#111827"
};

function getTeamColor(team) {
    return teamColors[team] || teamColors["Default"];
}

// 🚀 Main loader (only updates changed rows)
async function loadLeaderboard() {
    try {
        const res = await fetch(URL);
        const text = await res.text();

        const rows = parseGoogleJSON(text);

        const tbody = document.getElementById("leaderboard-body");

        // first load = full render
        if (previousData.length === 0) {
            tbody.innerHTML = "";
            rows.forEach((row, index) => {
                const tr = createRow(row, index);
                tbody.appendChild(tr);
            });
        } 
        else {
            // update only changed rows
            const existingRows = tbody.querySelectorAll("tr");

            rows.forEach((row, index) => {
                const newHTML = rowToHTML(row, index);

                if (existingRows[index]) {
                    if (existingRows[index].dataset.hash !== JSON.stringify(row)) {
                        existingRows[index].innerHTML = newHTML;
                        existingRows[index].dataset.hash = JSON.stringify(row);
                    }
                } else {
                    const tr = createRow(row, index);
                    tbody.appendChild(tr);
                }
            });
        }

        previousData = rows;

    } catch (err) {
        console.error("Leaderboard error:", err);
    }
}

// 🧱 Build row element
function createRow(row, index) {
    const tr = document.createElement("tr");
    tr.dataset.hash = JSON.stringify(row);
    tr.innerHTML = rowToHTML(row, index);
    return tr;
}

// 🧠 Row template
function rowToHTML(row, index) {
    const team = row[12] || "Default";
    const color = getTeamColor(team);

    return `
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
        <td style="color:${color}; font-weight:bold;">
            ${team}
        </td>
    `;
}

// 🔁 Auto refresh (live system)
loadLeaderboard();
setInterval(loadLeaderboard, 15000); // 15s live updates