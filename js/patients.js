const patientTableBody = document.querySelector("#patients-table tbody");
const addPatientBtn = document.querySelector(".add-btn");

let patients = JSON.parse(localStorage.getItem("patients")) || [];
let wards = JSON.parse(localStorage.getItem("wards")) || [];

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

function validateGender(defaultGender = "") {
  const options = ["Male", "Female", "Other"];
  let gender = defaultGender;
  while (!options.includes(gender)) {
    gender = prompt("Gender (Male/Female/Other):", defaultGender);
    if (gender === null) return null;
    if (!options.includes(gender)) alert("Gender must be Male, Female, or Other!");
  }
  return gender;
}

function validateDate(defaultDate = "") {
  let date = defaultDate;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  while (!dateRegex.test(date)) {
    date = prompt("Admit Date (YYYY-MM-DD):", defaultDate);
    if (date === null) return null;
    if (!dateRegex.test(date)) alert("Date must be in YYYY-MM-DD format!");
  }
  return date;
}

function renderPatients() {
  patientTableBody.innerHTML = "";
  patients.forEach((patient, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${patient.firstName}</td>
      <td>${patient.lastName}</td>
      <td>${patient.gender}</td>
      <td>${patient.admitDate}</td>
      <td>${patient.ward}</td>
      <td>
        <button class="action-btn modify-btn">Modify</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this patient?")) {
        patients.splice(index, 1);
        saveAndRender();
      }
    });

    row.querySelector(".modify-btn").addEventListener("click", () => {
      const firstName = prompt("First Name:", patient.firstName);
      if (!firstName) return;

      const lastName = prompt("Last Name:", patient.lastName);
      if (!lastName) return;

      const gender = validateGender(patient.gender);
      if (!gender) return;

      const admitDate = validateDate(patient.admitDate);
      if (!admitDate) return;

      const ward = selectWard(patient.ward);
      if (!ward) return;

      patients[index] = { firstName, lastName, gender, admitDate, ward };
      saveAndRender();
    });

    patientTableBody.appendChild(row);
  });
}

addPatientBtn.addEventListener("click", () => {
  if (wards.length === 0) {
    alert("Add a ward first!");
    return;
  }

  const firstName = prompt("First Name:");
  if (!firstName) return;

  const lastName = prompt("Last Name:");
  if (!lastName) return;

  const gender = validateGender();
  if (!gender) return;

  const admitDate = validateDate();
  if (!admitDate) return;

  const ward = selectWard();
  if (!ward) return;

  patients.push({ firstName, lastName, gender, admitDate, ward });
  saveAndRender();
});

function saveAndRender() {
  localStorage.setItem("patients", JSON.stringify(patients));
  renderPatients();
}

renderPatients();
