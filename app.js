const TEAMS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxvQP4EqINqRxF8Mcwz4USfZqXXmmY9VoAFvmGtIHI0_US58MqXu0TeYdXCszRlkJxas3Jch2MPuH/pub?gid=1822794184&single=true&output=csv";
const PLAYERS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxvQP4EqINqRxF8Mcwz4USfZqXXmmY9VoAFvmGtIHI0_US58MqXu0TeYdXCszRlkJxas3Jch2MPuH/pub?gid=523302871&single=true&output=csv";

// Load CSV helper
function loadCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

// Sort helpers
function sortTeams(data) {
  return data.sort((a, b) => Number(b.Points) - Number(a.Points));
}

function sortPlayers(data) {
  return data.sort((a, b) => Number(b.Points) - Number(a.Points));
}

// Render table dynamically
function renderTable(data, tableId) {
  const table = document.getElementById(tableId);

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td>No data</td></tr>";
    return;
  }

  const headers = Object.keys(data[0]);

  let html = "<tr>";
  headers.forEach(h => html += `<th>${h}</th>`);
  html += "</tr>";

  data.forEach(row => {
    html += "<tr>";
    headers.forEach(h => {
      html += `<td>${row[h] ?? ""}</td>`;
    });
    html += "</tr>";
  });

  table.innerHTML = html;
}

// Load + render teams
function loadTeams() {
  loadCSV(TEAMS_CSV_URL, (data) => {
    const sorted = sortTeams(data);
    renderTable(sorted, "teamTable");
  });
}

// Load + render players
function loadPlayers() {
  loadCSV(PLAYERS_CSV_URL, (data) => {
    const sorted = sortPlayers(data);
    renderTable(sorted, "playerTable");
  });
}

// Initial load
loadTeams();
loadPlayers();

// Auto-refresh every 30 seconds
setInterval(() => {
  loadTeams();
  loadPlayers();
}, 30000);