const wardTableBody = document.querySelector("#wards-table tbody");
const addWardBtn = document.querySelector("#add-ward-btn");

let wards = JSON.parse(localStorage.getItem("wards")) || [];
let departments = JSON.parse(localStorage.getItem("departments")) || [];

function selectDepartment(defaultDept = "") {
  const deptOptions = departments.map(d => d.name);
  let selection = null;

  while (!deptOptions.includes(selection)) {
    selection = prompt(`Select Department:\nAvailable: ${deptOptions.join(", ")}`, defaultDept);
    if (selection === null) return null;
    if (!deptOptions.includes(selection)) alert("Please select a valid department!");
  }

  return selection;
}

function validateCapacity(defaultCapacity = "", wardName = "", department = "") {
  let capacity;
  do {
    capacity = prompt("Capacity (positive number):", defaultCapacity);
    if (capacity === null) return null;
    if (isNaN(capacity) || capacity <= 0) {
      alert("Capacity must be a positive number!");
      continue;
    }

    if (
      wardName &&
      department &&
      wards.some(
        (w) =>
          w.name.toLowerCase() === wardName.toLowerCase() &&
          w.department === department
      )
    ) {
      alert("Ward with this name already exists in the selected department!");
      return null;
    }
  } while (isNaN(capacity) || capacity <= 0);

  return capacity;
}

function renderWards() {
  wardTableBody.innerHTML = "";

  wards.forEach((ward, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${ward.name}</td>
      <td>${ward.floor}</td>
      <td>${ward.capacity}</td>
      <td>${ward.department}</td>
      <td>
        <button class="action-btn modify-btn">Modify</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this ward?")) {
        wards.splice(index, 1);
        saveAndRender();
      }
    });

    row.querySelector(".modify-btn").addEventListener("click", () => {
      let name;
      do {
        name = prompt("Ward Name:", ward.name);
        if (name === null) return;
        if (!name.trim()) {
          alert("Ward name cannot be empty!");
          name = null;
          continue;
        }
        if (
          wards.some(
            (w, i) =>
              w.name.toLowerCase() === name.toLowerCase() &&
              w.department === ward.department &&
              i !== index
          )
        ) {
          alert("Ward with this name already exists in this department!");
          name = null;
        }
      } while (!name);

      const department = selectDepartment(ward.department);
      if (!department) return;

      const deptObj = departments.find((d) => d.name === department);
      const floor = deptObj.floor;

      const capacity = validateCapacity(ward.capacity, name, department);
      if (!capacity) return;

      wards[index] = { name, floor, capacity, department };
      saveAndRender();
    });

    wardTableBody.appendChild(row);
  });
}

addWardBtn.addEventListener("click", () => {
  if (departments.length === 0) {
    alert("Add a department first!");
    return;
  }

  let name;
  do {
    name = prompt("Ward Name:");
    if (name === null) return;
    if (!name.trim()) {
      alert("Ward name cannot be empty!");
      name = null;
    }
  } while (!name);

  const department = selectDepartment();
  if (!department) return;

  const deptObj = departments.find((d) => d.name === department);
  const floor = deptObj.floor;

  const capacity = validateCapacity("", name, department);
  if (!capacity) return;

  wards.push({ name, floor, capacity, department });
  saveAndRender();
});

function saveAndRender() {
  localStorage.setItem("wards", JSON.stringify(wards));
  renderWards();
}

renderWards();
