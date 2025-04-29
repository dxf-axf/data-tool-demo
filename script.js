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

// Switch between sections
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelectorAll(".sidebar li").forEach(li => {
    if (li.textContent.toLowerCase().includes(id)) li.classList.add("active");
  });
}

// Populate dashboard stats
function renderStats() {
  const ok = staffData.filter(s => s.status === "ok").length;
  const expiring = staffData.filter(s => s.status === "expiring").length;
  const expired = staffData.filter(s => s.status === "expired").length;
  document.getElementById("count-ok").innerText = `${ok} Compliant`;
  document.getElementById("count-expiring")?.innerText = `${expiring} Expiring`;
  document.getElementById("count-expired")?.innerText = `${expired} Expired`;
  document.getElementById("expirations-list").innerHTML = staffData
    .filter(s => s.status !== "ok")
    .map(s => `<li>${s.name} - ${s.certificate} (expires: ${s.expires})</li>`)
    .join('');
}

function renderStaff() {
  document.getElementById("staff-list").innerHTML = staffData
    .map(s => `<div><strong>${s.name}</strong> — ${s.certificate} (expires: ${s.expires})</div>`)
    .join('');
}

function renderSales() {
  document.getElementById("sales-list").innerHTML = salesData
    .map(s => `<div>${s.date} — ${s.item}: ${s.quantity} units sold ($${s.total})</div>`)
    .join('');
}

function renderStock() {
  document.getElementById("stock-list").innerHTML = stockData
    .map(s => `<div>${s.item}: ${s.stock} units in stock</div>`)
    .join('');
}

function renderAlerts() {
  document.getElementById("alerts-list").innerHTML = alertsData
    .map(a => `<li>${a.message}</li>`)
    .join('');
}

// Chatbot integration
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = '';

  appendMessage("bot", "Typing...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_OPENAI_API_KEY` // 🔐 Replace with env variable in backend or secure proxy
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for a fast food analytics dashboard." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    chatWindow.lastChild.remove();
    const reply = data.choices[0].message.content;
    appendMessage("bot", reply);
  } catch (err) {
    chatWindow.lastChild.remove();
    appendMessage("bot", "Sorry, I couldn't get a response.");
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Initial render
renderStats();
renderStaff();
renderSales();
renderStock();
renderAlerts();