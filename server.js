const express = require('express');
const path    = require('path');
const apiApp  = require('./api/index.js');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── API Routes (handled by api/index.js) ─────────────
app.use(apiApp);

// ─── Static Files & Fallback ──────────────────────────
app.use(express.static(__dirname));

// Fallback for SPA / HTML requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  🚀  Portfolio Server Started          ║`);
    console.log(`║  Open: http://localhost:${PORT}           ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
  });
}

module.exports = app;
