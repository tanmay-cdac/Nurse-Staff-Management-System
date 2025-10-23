const deptTableBody = document.querySelector("#departments-table tbody");
const addDeptBtn = document.querySelector("#add-department-btn");

let departments = JSON.parse(localStorage.getItem("departments")) || [];

function renderDepartments() {
  deptTableBody.innerHTML = "";
  departments.forEach((dept, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${dept.name}</td>
      <td>${dept.floor}</td>
      <td>${dept.phone}</td>
      <td>
        <button class="action-btn modify-btn">Modify</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    // Delete
    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this department?")) {
        departments.splice(index, 1);
        saveAndRender();
      }
    });

    row.querySelector(".modify-btn").addEventListener("click", () => {
      let name;
      do {
        name = prompt("Department Name:", dept.name);
        if (name === null) return;
        if (!name.trim()) {
          alert("Department name cannot be empty!");
          name = null;
          continue;
        }
        if (
          departments.some(
            (d, i) => d.name.toLowerCase() === name.toLowerCase() && i !== index
          )
        ) {
          alert("Department name already exists! Enter a unique name.");
          name = null;
        }
      } while (!name);

      let floor;
      do {
        floor = prompt("Floor (number):", dept.floor);
        if (floor === null) return;
        if (isNaN(floor) || floor <= 0) alert("Floor must be a positive number!");
      } while (isNaN(floor) || floor <= 0);

      let phone;
      do {
        phone = prompt("Phone (10 digits):", dept.phone);
        if (phone === null) return;
        if (!/^\d{10}$/.test(phone)) alert("Phone must be a 10-digit number!");
      } while (!/^\d{10}$/.test(phone));

      departments[index] = { name, floor, phone };
      saveAndRender();
    });

    deptTableBody.appendChild(row);
  });
}

addDeptBtn.addEventListener("click", () => {

  let name;
  do {
    name = prompt("Department Name:");
    if (name === null) return;
    if (!name.trim()) {
      alert("Department name cannot be empty!");
      name = null;
      continue;
    }
    if (departments.some(d => d.name.toLowerCase() === name.toLowerCase())) {
      alert("Department name already exists! Enter a unique name.");
      name = null;
    }
  } while (!name);

  let floor;
  do {
    floor = prompt("Floor (number):");
    if (floor === null) return;
    if (isNaN(floor) || floor <= 0) alert("Floor must be a positive number!");
  } while (isNaN(floor) || floor <= 0);

  let phone;
  do {
    phone = prompt("Phone (10 digits):");
    if (phone === null) return;
    if (!/^\d{10}$/.test(phone)) alert("Phone must be a 10-digit number!");
  } while (!/^\d{10}$/.test(phone));

  departments.push({ name, floor, phone });
  saveAndRender();
});

function saveAndRender() {
  localStorage.setItem("departments", JSON.stringify(departments));
  renderDepartments();
}

renderDepartments();
