const shiftTableBody = document.querySelector("#assignments-table tbody");
const addShiftBtn = document.querySelector("#add-shift-btn");

let shifts = JSON.parse(localStorage.getItem("shifts")) || [];
let nurses = JSON.parse(localStorage.getItem("nurses")) || [];
let wards = JSON.parse(localStorage.getItem("wards")) || [];

function selectNurse(defaultName = "") {
  const options = nurses.map(n => `${n.firstName} ${n.lastName}`);
  let selection = defaultName;
  while (!options.includes(selection)) {
    selection = prompt(`Select Nurse:\nAvailable: ${options.join(", ")}`, defaultName);
    if (selection === null) return null;
    if (!options.includes(selection)) alert("Please select a valid nurse!");
  }
  return selection;
}

function selectWard(defaultWard = "") {
  const options = wards.map(w => w.name);
  let selection = defaultWard;
  while (!options.includes(selection)) {
    selection = prompt(`Select Ward:\nAvailable: ${options.join(", ")}`, defaultWard);
    if (selection === null) return null;
    if (!options.includes(selection)) alert("Please select a valid ward!");
  }
  return selection;
}

function validateShift(defaultShift = "") {
  const options = ["Morning", "Evening", "Night"];
  let shift = defaultShift;
  while (!options.includes(shift)) {
    shift = prompt(`Shift (Morning/Evening/Night):`, defaultShift);
    if (shift === null) return null;
    if (!options.includes(shift)) alert("Shift must be Morning, Evening, or Night!");
  }
  return shift;
}

function validateDate(defaultDate = "") {
  let date = defaultDate;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  while (!dateRegex.test(date)) {
    date = prompt("Date (YYYY-MM-DD):", defaultDate);
    if (date === null) return null;
    if (!dateRegex.test(date)) alert("Date must be in YYYY-MM-DD format!");
  }
  return date;
}

function renderShifts() {
  shiftTableBody.innerHTML = "";
  shifts.forEach((shift, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${shift.nurse}</td>
      <td>${shift.ward}</td>
      <td>${shift.shiftTime}</td>
      <td>${shift.date}</td>
      <td>
        <button class="action-btn modify-btn">Modify</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this shift?")) {
        shifts.splice(index, 1);
        saveAndRender();
      }
    });

    row.querySelector(".modify-btn").addEventListener("click", () => {
      const nurse = selectNurse(shift.nurse);
      if (!nurse) return;

      const ward = selectWard(shift.ward);
      if (!ward) return;

      const shiftTime = validateShift(shift.shiftTime);
      if (!shiftTime) return;

      const date = validateDate(shift.date);
      if (!date) return;

      shifts[index] = { nurse, ward, shiftTime, date };
      saveAndRender();
    });

    shiftTableBody.appendChild(row);
  });
}

addShiftBtn.addEventListener("click", () => {
  if (nurses.length === 0 || wards.length === 0) {
    alert("Add nurses and wards first!");
    return;
  }

  const nurse = selectNurse();
  if (!nurse) return;

  const ward = selectWard();
  if (!ward) return;

  const shiftTime = validateShift();
  if (!shiftTime) return;

  const date = validateDate();
  if (!date) return;

  shifts.push({ nurse, ward, shiftTime, date });
  saveAndRender();
});

function saveAndRender() {
  localStorage.setItem("shifts", JSON.stringify(shifts));
  renderShifts();
}

renderShifts();
