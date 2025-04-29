// Dummy Data (Replace with API calls later)
const staffData = [
  { name: "John Doe", certificate: "Food Safety", expires: "2025-03-01", status: "ok" },
  { name: "Jane Smith", certificate: "First Aid", expires: "2024-06-01", status: "expiring" },
  { name: "Bob Lee", certificate: "Allergens", expires: "2023-11-20", status: "expired" }
];
const alertsData = [
  { message: "Bob Lee's certification has expired!" },
  { message: "Jane Smith's certification expires in 30 days." }
];

// Navigation
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// Dashboard - Compliance Overview
function renderComplianceStats() {
  const total = staffData.length;
  const expired = staffData.filter(s => s.status === "expired").length;
  const expiring = staffData.filter(s => s.status === "expiring").length;
  const ok = staffData.filter(s => s.status === "ok").length;

  document.getElementById('compliance-stats').innerHTML = `
    <div class="stat-box status-ok">
      <h3>Compliant</h3>
      <p>${ok} / ${total}</p>
    </div>
    <div class="stat-box status-expiring">
      <h3>Expiring Soon</h3>
      <p>${expiring} / ${total}</p>
    </div>
    <div class="stat-box status-expired">
      <h3>Expired</h3>
      <p>${expired} / ${total}</p>
    </div>
  `;

  const expiringList = staffData.filter(s => s.status !== "ok").map(staff => `
    <li>${staff.name} - ${staff.certificate} (expires: ${staff.expires})</li>
  `).join('');
  document.getElementById('expirations-list').innerHTML = expiringList || "<li>All certifications are up to date.</li>";
}

// Staff Management
function renderStaffList() {
  document.getElementById('staff-list').innerHTML = staffData.map(staff => `
    <div>
      <strong>${staff.name}</strong> — ${staff.certificate} (expires: ${staff.expires})
      <span class="status-${staff.status}">${staff.status.toUpperCase()}</span>
    </div>
  `).join('');
}

// Alerts
function renderAlerts() {
  document.getElementById('alerts-list').innerHTML = alertsData.map(alert => `
    <li>${alert.message}</li>
  `).join('');
}

// Handle File Upload (Basic simulation)
document.getElementById('upload-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const file = document.getElementById('file-input').files[0];
  const staffName = document.getElementById('staff-name').value;
  const certName = document.getElementById('certificate-name').value;
  const expiryDate = document.getElementById('expiry-date').value;

  if (!file) return alert('Select a file to upload.');

  // Simulated upload (Replace with actual S3 pre-signed URL fetch later)
  alert(`Pretend uploading "${file.name}" for ${staffName}'s certification.`);

  staffData.push({ name: staffName, certificate: certName, expires: expiryDate, status: "ok" });
  renderComplianceStats();
  renderStaffList();
  document.getElementById('upload-form').reset();
});

// Init
renderComplianceStats();
renderStaffList();
renderAlerts();
