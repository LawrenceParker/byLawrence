const SHEET_ID = "1HVoEKPbWYC3CjbWPPsLIK3EcoW55YX3wh7dRs_vYoms";
const SHEET_NAME = "Sheet11";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

function format(value, type = "int") {
    const num = Number(value);
    if (isNaN(num)) return value || "";

    switch (type) {
        case "float":
            return num.toFixed(2);   // 2 decimals
        case "int":
        default:
            return Math.round(num);   // whole numbers
    }
}


function extractJSON(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    return JSON.parse(text.slice(start, end + 1));
}

// 🔥 Map column names → index automatically
function getColumnMap(cols) {
    const map = {};
    cols.forEach((col, i) => {
        if (col.label) map[col.label] = i;
    });
    return map;
}

async function loadLeaderboard() {
    try {
        const res = await fetch(URL);
        const text = await res.text();

        const json = extractJSON(text);

        const cols = json.table.cols;
        const rows = json.table.rows;

        const map = getColumnMap(cols);

        const tbody = document.getElementById("leaderboard-body");
        tbody.innerHTML = "";

        let rank = 0;

        rows.forEach(row => {
            const c = row.c || [];

            const player = c[map.Player]?.v;

            if (!player || player === "Player") return;

            const team = (c[map.Team]?.v || "unknown")
                .toLowerCase()
                .replace(/\s+/g, "-");

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${++rank}</td>
                <td>${player}</td>

                <td>${format(c[map.RTG]?.v, "float")}</td>
                <td>${format(c[map.KDA]?.v, "float")}</td>

                <td>${format(c[map.KILLS]?.v, "int")}</td>
                <td>${format(c[map.DEATHS]?.v, "int")}</td>
                <td>${format(c[map.ASSISTS]?.v, "int")}</td>

                <td>${format(c[map.NTK]?.v, "int")}</td>
                <td>${format(c[map.STREAK]?.v, "int")}</td>

                <td>${format(c[map.DMG]?.v, "int")}</td>

                <td>${format(c[map.FB]?.v, "int")}</td>
                <td>${format(c[map.FD]?.v, "int")}</td>

                <td>${format(c[map["FB/FD"]]?.v, "float")}</td>

                <td>${c[map.Team]?.v || ""}</td>
                                
            `;

            
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Leaderboard error:", err);
    }
}

// start
loadLeaderboard();
setInterval(loadLeaderboard, 15000);