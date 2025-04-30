// Existing data and section switching remains unchanged

const staffData = [
  { name: "Alex Brooks", certificate: "Food Safety", expires: "2025-03-01", status: "ok" },
  { name: "Rizwan Hussain", certificate: "First Aid", expires: "2024-06-01", status: "expiring" },
  { name: "Ben Taylor", certificate: "Allergens", expires: "2023-11-20", status: "expired" }
];

const salesData = [
  { date: "2024-04-01", item: "Burger", quantity: 20, total: 100 },
  { date: "2024-04-01", item: "Fries", quantity: 15, total: 45 },
  { date: "2024-04-02", item: "Milkshake", quantity: 10, total: 50 }
];

const stockData = [
  { item: "Burger", stock: 120 },
  { item: "Fries", stock: 80 },
  { item: "Milkshake", stock: 30 }
];

const alertsData = [
  { message: "Ben Taylor's certification has expired!" },
  { message: "Rizwan Hussain's certification expires in 30 days." }
];

function showSection(id) {
  document.querySelectorAll("section").forEach(section => section.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelectorAll(".sidebar li").forEach(li => {
    const linkText = li.textContent.trim().toLowerCase();
    if (linkText.includes(id.toLowerCase())) li.classList.add("active");
  });
}

function renderStats() {
  const ok = staffData.filter(s => s.status === "ok").length;
  const expiring = staffData.filter(s => s.status === "expiring").length;
  const expired = staffData.filter(s => s.status === "expired").length;
  document.getElementById("count-ok")?.innerText = `${ok} Compliant`;
  document.getElementById("count-expiring")?.innerText = `${expiring} Expiring`;
  document.getElementById("count-expired")?.innerText = `${expired} Expired`;
  document.getElementById("expirations-list")?.innerHTML = staffData
    .filter(s => s.status !== "ok")
    .map(s => `<li>${s.name} - ${s.certificate} (expires: ${s.expires})</li>`)  
    .join('');
}

function renderStaff() {
  document.getElementById("staff-list")?.innerHTML = staffData
    .map(s => `<div><strong>${s.name}</strong> — ${s.certificate} (expires: ${s.expires})</div>`)  
    .join('');
}

function renderSales() {
  document.getElementById("sales-list")?.innerHTML = salesData
    .map(s => `<div>${s.date} — ${s.item}: ${s.quantity} units sold ($${s.total})</div>`)  
    .join('');
}

function renderStock() {
  document.getElementById("stock-list")?.innerHTML = stockData
    .map(s => `<div>${s.item}: ${s.stock} units in stock</div>`)  
    .join('');
}

function renderAlerts() {
  document.getElementById("alerts-list")?.innerHTML = alertsData
    .map(a => `<li>${a.message}</li>`)  
    .join('');
}

const chatbotKnowledge = {
  "top selling items": "Our top-selling items are Burger, Pizza, and Milkshake.",
  "sales today": "Today's total sales are approximately $195.",
  "current stock levels": stockData.map(item => `${item.item}: ${item.stock} units`).join(', '),
  "staff compliance": `${staffData.filter(s => s.status === 'ok').length} staff members are compliant.`,
  "alerts": alertsData.map(a => a.message).join('; ')
};

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = '';

  const lower = message.toLowerCase();
  let reply = "Sorry, I didn't understand that. Try asking about top selling items, stock levels, staff compliance, or alerts.";

  for (const key in chatbotKnowledge) {
    if (lower.includes(key)) {
      reply = chatbotKnowledge[key];
      break;
    }
  }

  appendMessage("bot", reply);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Additional functionality for staff management form
const newStaffData = [];

function renderNewStaffList() {
  const container = document.getElementById("staff-list");
  if (!container) return;

  container.innerHTML = "";

  if (newStaffData.length === 0) {
    container.innerHTML = "<p>No staff members added yet.</p>";
    return;
  }

  newStaffData.forEach((staff, index) => {
    const div = document.createElement("div");
    div.className = "staff-entry";
    div.innerHTML = `
      <strong>${staff.name}</strong><br>
      Role: ${staff.role}<br>
      Start Date: ${staff.start}<br>
      Teams: ${staff.teams.join(", ")}<br>
      <button onclick="removeStaff(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
}

function removeStaff(index) {
  newStaffData.splice(index, 1);
  renderNewStaffList();
}

document.getElementById("add-staff-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("staff-name").value.trim();
  const role = document.getElementById("staff-role").value.trim();
  const start = document.getElementById("staff-start").value;
  const teams = Array.from(document.getElementById("staff-teams").selectedOptions).map(opt => opt.value);

  if (!name || !role || !start || teams.length === 0) {
    alert("Please fill out all fields and select at least one team.");
    return;
  }

  newStaffData.push({ name, role, start, teams });
  document.getElementById("add-staff-form").reset();
  renderNewStaffList();
});

window.onload = function () {
  renderStats();
  renderStaff();
  renderSales();
  renderStock();
  renderAlerts();
  renderNewStaffList();
};