fetch('/data/WNC_GT7_RAW.csv')
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      complete: function(results) {
        const table = document.getElementById('csv-table');
        const data = results.data;

        // Create header row
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(col => {
          const th = document.createElement('th');
          th.textContent = col;
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create data rows
        data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
      }
    });
  });

