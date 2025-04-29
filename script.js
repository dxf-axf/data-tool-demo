// Dummy data (Replace with API calls later)
const staffData = [
  { name: "John Doe", certificate: "Food Safety", expires: "2025-03-01", status: "ok" },
  { name: "Jane Smith", certificate: "First Aid", expires: "2024-06-01", status: "expiring" },
  { name: "Bob Lee", certificate: "Allergens", expires: "2023-11-20", status: "expired" }
];

const alertsData = [
  { message: "Bob Lee's certification has expired!" },
  { message: "Jane Smith's certification expires in 30 days." }
];

function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  document.querySelectorAll('.sidebar li').forEach(li => {
    li.classList.remove('active');
  });
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
      <strong>${s.name}</strong> - ${s.certificate} (expires: ${s.expires})
      <span class="status-${s.status}"> [${s.status.toUpperCase()}]</span>
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

// Initial load
renderStats();
renderStaff();
renderAlerts();
