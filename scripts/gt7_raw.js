fetch('/data/WNC_GT7_RAW.csv')
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      complete: function(results) {
        const data = results.data;

        // Create container
        const container = document.createElement('div');
        container.className = 'table-container';

        const table = document.getElementById('csv-table');
        container.appendChild(table);
        table.parentNode.insertBefore(container, table);

        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        Object.keys(data[0]).forEach(col => {
          const th = document.createElement('th');
          th.textContent = col;
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');

        data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
      }
    });
  });
