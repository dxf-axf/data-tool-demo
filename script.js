// Dummy data for demonstration
const staffData = [
  { name: "John Doe", certificate: "Food Safety", expires: "2025-03-01", status: "ok" },
  { name: "Jane Smith", certificate: "First Aid", expires: "2024-06-01", status: "expiring" },
  { name: "Bob Lee", certificate: "Allergens", expires: "2023-11-20", status: "expired" }
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
  { message: "Bob Lee's certification has expired!" },
  { message: "Jane Smith's certification expires in 30 days." }
];

const chatbotKnowledge = {
  "top selling items": "Top selling items are Burger, Fries, and Milkshake.",
  "current stock levels": "Burger: 120, Fries: 80, Milkshake: 30",
  "sales today": "Today's total sales are approximately $195.",
  "items low on stock": "Milkshake stock is low at 30 units."
};

function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
  const target = Array.from(document.querySelectorAll('.sidebar li')).find(el => el.textContent.toLowerCase().includes(sectionId));
  if (target) target.classList.add('active');
}

function renderStats() {
  const total = staffData.length;
  const ok = staffData.filter(s => s.status === "ok").length;
  const expiring = staffData.filter(s => s.status === "expiring").length;
  const expired = staffData.filter(s => s.status === "expired").length;

  document.getElementById('count-ok').innerText = ok;
  document.getElementById('count-expiring').innerText = expiring;
  document.getElementById('count-expired').innerText = expired;

  const upcomingList = staffData.filter(s => s.status !== "ok").map(s =>
    `<li>${s.name} - ${s.certificate} (expires: ${s.expires})</li>`
  ).join('');
  document.getElementById('expirations-list').innerHTML = upcomingList || "<li>All certifications are current.</li>";
}

function renderStaff() {
  document.getElementById('staff-list').innerHTML = staffData.map(s => `
    <div>
      <strong>${s.name}</strong> — ${s.certificate} (expires: ${s.expires})
      <span class="status-${s.status}"> [${s.status.toUpperCase()}]</span>
    </div>`).join('');
}

function renderSales() {
  document.getElementById('sales-list').innerHTML = salesData.map(s => `
    <div>
      ${s.date} — ${s.item}: ${s.quantity} units sold ($${s.total})
    </div>`).join('');
}

function renderStock() {
  document.getElementById('stock-list').innerHTML = stockData.map(s => `
    <div>
      ${s.item}: ${s.stock} units in stock
    </div>`).join('');
}

function renderAlerts() {
  document.getElementById('alerts-list').innerHTML = alertsData.map(a => `
    <li>${a.message}</li>`).join('');
}

document.getElementById('upload-form').addEventListener('submit', e => {
  e.preventDefault();
  const file = document.getElementById('file-input').files[0];
  const name = document.getElementById('staff-name').value;
  const cert = document.getElementById('certificate-name').value;
  const expires = document.getElementById('expiry-date').value;

  if (!file || !name || !cert || !expires) return alert("Please complete all fields.");

  alert(`Pretending to upload ${file.name} for ${name}`);

  staffData.push({ name, certificate: cert, expires, status: "ok" });
  renderStats();
  renderStaff();
  document.getElementById('upload-form').reset();
});

// Chatbot Interaction
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  appendMessage("User", userMessage);

  let botResponse = "Sorry, I didn't understand that.";
  for (const key in chatbotKnowledge) {
    if (userMessage.toLowerCase().includes(key)) {
      botResponse = chatbotKnowledge[key];
      break;
    }
  }

  setTimeout(() => {
    appendMessage("Bot", botResponse);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 500);

  chatInput.value = '';
});

function appendMessage(sender, message) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(msg);
}

// Initial rendering
renderStats();
renderStaff();
renderSales();
renderStock();
renderAlerts();
