(function () {
  function parseDateTime(text) {
    const [date, time] = text.split(",");
    const [day, month, year] = date.trim().split(".");
    return new Date(`${year.trim()}-${month.trim()}-${day.trim()}T${time.trim()}`);
  }

  function parseDateOnly(iso) {
    const [year, month, day] = iso.split("-");
    return new Date(`${year}-${month}-${day}T00:00`);
  }

  document.getElementById("datePickerDialog")?.remove();
  document.getElementById("packageModal")?.remove();

  const picker = document.createElement("div");
  picker.id = "datePickerDialog";
  Object.assign(picker.style, {
    position: "fixed",
    top: "20px",
    left: "20px",
    backgroundColor: "white",
    border: "1px solid #aaa",
    padding: "15px",
    zIndex: "9999",
    borderRadius: "8px",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
  });

  const labelFrom = document.createElement("label");
  labelFrom.textContent = "Od: ";
  labelFrom.style.marginRight = "10px";

  const inputFrom = document.createElement("input");
  inputFrom.type = "date";
  inputFrom.style.marginRight = "20px";

  const labelTo = document.createElement("label");
  labelTo.textContent = "Do: ";
  labelTo.style.marginRight = "10px";

  const inputTo = document.createElement("input");
  inputTo.type = "date";
  inputTo.style.marginRight = "20px";

  const button = document.createElement("button");
  button.textContent = "Načítať zásielky";
  button.onclick = () => {
    if (!inputFrom.value || !inputTo.value) return alert("Zadajte obidva dátumy.");
    picker.remove();
    const from = parseDateOnly(inputFrom.value);
    const to = parseDateOnly(inputTo.value);
    to.setHours(23, 59, 59);
    interactivePackageSelector(from, to);
  };

  picker.appendChild(labelFrom);
  picker.appendChild(inputFrom);
  picker.appendChild(labelTo);
  picker.appendChild(inputTo);
  picker.appendChild(button);
  document.body.appendChild(picker);

  function interactivePackageSelector(fromDate, toDate) {
    const rows = document.querySelectorAll("table tbody tr");
    const filtered = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      if (cells.length !== 8) return;

      const number = cells[1].textContent.trim();
      const created = cells[2].textContent.trim();
      const updated = cells[3].textContent.trim();
      const client = cells[5].textContent.trim();
      const packages = parseInt(cells[6].textContent.trim(), 10);
      const dateObj = parseDateTime(created);

      if (dateObj >= fromDate && dateObj <= toDate && client !== "" && !isNaN(packages)) {
        filtered.push({ created, updated, number, client, packages, dateObj });
      }
    });

    if (filtered.length === 0) {
      alert("Žiadne zásielky v zadanom intervale.");
      return;
    }

    filtered.sort((a, b) => b.dateObj - a.dateObj);

    const modal = document.createElement("div");
    modal.id = "packageModal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "10%",
      left: "10%",
      width: "80%",
      maxHeight: "80%",
      overflowY: "auto",
      backgroundColor: "rgba(255,255,255,0.95)",
      padding: "20px",
      border: "1px solid #aaa",
      borderRadius: "8px",
      zIndex: "9999",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      fontFamily: "sans-serif",
      backdropFilter: "blur(3px)"
    });

    const table = document.createElement("table");
    Object.assign(table.style, {
      borderCollapse: "collapse",
      width: "100%",
      marginBottom: "10px"
    });

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th style="text-align:left; padding: 4px 8px;">✅</th>
        <th style="text-align:left; padding: 4px 8px;">Vytvorené</th>
        <th style="text-align:left; padding: 4px 8px;">Posledná zmena</th>
        <th style="text-align:left; padding: 4px 8px;">Číslo</th>
        <th style="text-align:left; padding: 4px 8px;">Klient</th>
        <th style="text-align:center; padding: 4px 8px;">Balíkov</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    filtered.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align:center;"><input type="checkbox" data-index="${index}" checked></td>
        <td style="text-align:left; padding: 4px 8px;">${item.created}</td>
        <td style="text-align:left; padding: 4px 8px;">${item.updated}</td>
        <td style="text-align:left; padding: 4px 8px;">${item.number}</td>
        <td style="text-align:left; padding: 4px 8px;">${item.client}</td>
        <td style="text-align:center; padding: 4px 8px;">${item.packages}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    const result = document.createElement("div");
    Object.assign(result.style, {
      marginTop: "10px",
      fontWeight: "bold",
      textAlign: "right"
    });

    function updateSum() {
      const checkboxes = modal.querySelectorAll("input[type=checkbox]");
      let total = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) {
          const idx = parseInt(cb.getAttribute("data-index"), 10);
          total += filtered[idx].packages;
        }
      });
      result.textContent = `📦 Vybraných balíkov: ${total}`;
    }

    tbody.addEventListener("change", updateSum);
    updateSum();

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Označiť/Odškrtnúť všetky";
    Object.assign(toggleBtn.style, {
      marginBottom: "10px",
      padding: "5px 10px",
      cursor: "pointer",
      display: "block"
    });
    toggleBtn.onclick = () => {
      const checkboxes = modal.querySelectorAll("input[type=checkbox]");
      const allChecked = [...checkboxes].every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);
      updateSum();
    };

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Zavrieť";
    Object.assign(closeBtn.style, {
      marginTop: "10px",
      padding: "5px 10px",
      cursor: "pointer"
    });
    closeBtn.onclick = () => modal.remove();

    modal.appendChild(toggleBtn);
    modal.appendChild(table);
    modal.appendChild(result);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  }
})();