const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/helpdesk';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ MongoDB error:', err.message));

// Database Schema
const helpdeskSchema = new mongoose.Schema({
  issueCode: {
    type: String,
    required: true,
    unique: true
  },
  response: String,
  category: String,
  priority: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HelpdeskEntry = mongoose.model('HelpdeskEntry', helpdeskSchema);

// GET all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await HelpdeskEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single entry by ID
app.get('/api/entries/:id', async (req, res) => {
  try {
    const entry = await HelpdeskEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new entry
app.post('/api/entries', async (req, res) => {
  try {
    const entry = new HelpdeskEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update entry
app.put('/api/entries/:id', async (req, res) => {
  try {
    const entry = await HelpdeskEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const entry = await HelpdeskEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed sample data
app.post('/api/seed', async (req, res) => {
  try {
    await HelpdeskEntry.deleteMany({});
    const seedData = [
      { issueCode: 'PWD_RESET', response: 'Ask the user to use the reset link and confirm their email address. If the link has expired, regenerate via admin panel.', category: 'Password & Access', priority: 'High' },
      { issueCode: 'BILLING_LATE', response: 'Advise of the grace period (7 business days) and provide the payment link: payments.company.com. Escalate to finance if account is more than 30 days overdue.', category: 'Billing & Payments', priority: 'Medium' },
      { issueCode: 'WIFI_DOWN', response: 'Ask user to restart their router/switch. Check with IT for any ongoing outages. Run diagnostics via the network monitoring tool. Escalate if issue persists beyond 30 minutes.', category: 'Network & Connectivity', priority: 'High' },
      { issueCode: 'EMAIL_SPAM', response: 'Advise the user to mark emails as spam and not click any links. Report to security team using the phishing report button in Outlook. Block the sender domain if confirmed malicious.', category: 'Email', priority: 'Medium' },
      { issueCode: 'PC_SLOW', response: 'Guide user to restart the PC, clear temp files, and check for background processes using Task Manager. Schedule a full antivirus scan. If issue persists, escalate for hardware check.', category: 'Hardware', priority: 'Low' },
      { issueCode: 'SOFTWARE_CRASH', response: 'Collect the error log from %appdata%/logs. Restart the application. If crashing persists, reinstall the software using the company software portal. Log the incident for vendor reporting.', category: 'Software', priority: 'Medium' },
      { issueCode: 'VPN_FAIL', response: 'Verify the user has the latest VPN client installed. Check credentials and MFA token. If still failing, reset VPN user profile and re-provision. Contact network team for persistent issues.', category: 'Network & Connectivity', priority: 'High' },
      { issueCode: 'ACCT_LOCKED', response: 'Verify user identity via secondary email or phone. Unlock account in Active Directory. Advise user to not share credentials and update to a strong password.', category: 'Password & Access', priority: 'Critical' },
      { issueCode: 'PRINTER_ERR', response: 'Ask user to check paper tray and ink levels. Clear the print queue by restarting the Print Spooler service. Reinstall printer driver if errors persist.', category: 'Hardware', priority: 'Low' },
      { issueCode: 'PHISHING_SUSPECT', response: 'Immediately isolate the device from the network. Do not delete any emails. Forward the suspicious email to security@company.com. Scan device for malware. Document incident in the SIEM system.', category: 'Security', priority: 'Critical' }
    ];
    await HelpdeskEntry.insertMany(seedData);
    res.json({ message: `Loaded ${seedData.length} entries` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ API running at http://localhost:${PORT}`);
});
