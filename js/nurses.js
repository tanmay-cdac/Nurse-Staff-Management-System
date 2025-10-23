const nurseTableBody = document.querySelector("#nurses-table tbody");
const addNurseBtn = document.querySelector("#add-nurse-btn");

let nurses = JSON.parse(localStorage.getItem("nurses")) || [];
let departments = JSON.parse(localStorage.getItem("departments")) || [];

function selectDepartment(defaultDept = "") {
  const options = departments.map(d => d.name);
  let selection = defaultDept;
  while (!options.includes(selection)) {
    selection = prompt(`Select Department:\nAvailable: ${options.join(", ")}`, defaultDept);
    if (selection === null) return null;
    if (!options.includes(selection)) alert("Please select a valid department!");
  }
  return selection;
}

function validateGender(defaultGender = "") {
  const options = ["Male", "Female", "Other"];
  let gender = defaultGender;
  while (!options.includes(gender)) {
    gender = prompt(`Gender (Male, Female, Other):`, defaultGender);
    if (gender === null) return null;
    if (!options.includes(gender)) alert("Please select a valid gender: Male, Female, or Other!");
  }
  return gender;
}

function validatePhone(defaultPhone = "") {
  let phone = defaultPhone;
  while (!/^\d{10}$/.test(phone)) {
    phone = prompt("Phone (10 digits):", defaultPhone);
    if (phone === null) return null;
    if (!/^\d{10}$/.test(phone)) alert("Phone must be a 10-digit number!");
  }
  return phone;
}

function validateEmail(defaultEmail = "") {
  let email = defaultEmail;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  while (!emailRegex.test(email)) {
    email = prompt("Email:", defaultEmail);
    if (email === null) return null;
    if (!emailRegex.test(email)) alert("Please enter a valid email address!");
  }
  return email;
}

function renderNurses() {
  nurseTableBody.innerHTML = "";
  nurses.forEach((nurse, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${nurse.firstName}</td>
      <td>${nurse.lastName}</td>
      <td>${nurse.gender}</td>
      <td>${nurse.phone}</td>
      <td>${nurse.email}</td>
      <td>${nurse.department}</td>
      <td>
        <button class="action-btn modify-btn">Modify</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this nurse?")) {
        nurses.splice(index, 1);
        saveAndRender();
      }
    });

    row.querySelector(".modify-btn").addEventListener("click", () => {
      const firstName = prompt("First Name:", nurse.firstName);
      if (!firstName) return;

      const lastName = prompt("Last Name:", nurse.lastName);
      if (!lastName) return;

      const gender = validateGender(nurse.gender);
      if (!gender) return;

      const phone = validatePhone(nurse.phone);
      if (!phone) return;

      const email = validateEmail(nurse.email);
      if (!email) return;

      const department = selectDepartment(nurse.department);
      if (!department) return;

      nurses[index] = { firstName, lastName, gender, phone, email, department };
      saveAndRender();
    });

    nurseTableBody.appendChild(row);
  });
}

addNurseBtn.addEventListener("click", () => {
  if (departments.length === 0) {
    alert("Add a department first!");
    return;
  }

  const firstName = prompt("First Name:");
  if (!firstName) return;

  const lastName = prompt("Last Name:");
  if (!lastName) return;

  const gender = validateGender();
  if (!gender) return;

  const phone = validatePhone();
  if (!phone) return;

  const email = validateEmail();
  if (!email) return;

  const department = selectDepartment();
  if (!department) return;

  nurses.push({ firstName, lastName, gender, phone, email, department });
  saveAndRender();
});

function saveAndRender() {
  localStorage.setItem("nurses", JSON.stringify(nurses));
  renderNurses();
}

renderNurses();
