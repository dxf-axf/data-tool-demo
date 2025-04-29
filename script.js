const staffData = [
  { name: "Alex Brooks", certificate: "Food Safety", expires: "2025-03-01", status: "ok" },
  { name: "Rizwan Hussain", certificate: "First Aid", expires: "2024-06-01", status: "expiring" },
  { name: "Ben Taylor", certificate: "Allergens", expires: "2023-11-20", status: "expired" }
];

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  document.querySelectorAll(".sidebar li").forEach(li => {
    if (li.textContent.toLowerCase().includes(id)) li.classList.add("active");
  });
}

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

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  appendMessage("User", message);
  chatInput.value = '';
  appendMessage("Bot", "This is a placeholder response (ChatGPT coming soon!)");
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(msg);
}

renderStats();
renderStaff();
