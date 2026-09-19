const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store for messages
const messages = [];

// ─── API: Contact Form ────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, budget, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    budget: budget || 'Not specified',
    message,
    receivedAt: new Date().toISOString()
  };

  messages.push(entry);

  // Save to /tmp for serverless environment persistence during container lifespan
  try {
    const tmpDir = path.join('/tmp', 'data');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(path.join(tmpDir, 'messages.json'), JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('Could not save message:', err.message);
  }

  console.log(`📬 New message from ${name} <${email}>`);

  res.json({
    ok: true,
    message: "Message received! I'll get back to you within 24 hours.",
    id: entry.id
  });
});

// ─── API: Get Projects ────────────────────────────────
app.get('/api/projects', (req, res) => {
  res.json({
    ok: true,
    projects: [
      {
        id: 0,
        title: 'Nexus Intelligence — Real-time Analytics',
        category: 'fullstack',
        cat: 'Fullstack · SaaS',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        desc: 'Nexus Intelligence enables DevOps teams to visualize millions of server events per second with custom WebGL charts, anomaly detection alerts, and customizable dashboard widgets.',
        metrics: ['5M+ daily events processed', '64% latency reduction', '99.99% uptime'],
        tags: ['React','TypeScript','Node.js','PostgreSQL','WebSockets'],
        demo: 'https://example.com',
        repo: 'https://github.com'
      },
      {
        id: 1,
        title: 'Synapse AI — Generative Canvas Studio',
        category: 'ai',
        cat: 'AI / Cloud',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        desc: 'Node-based visual editor for LLM prompt pipelines with real-time collaboration and one-click API deployment. Used by 15,000+ creators monthly.',
        metrics: ['15,000+ Monthly Active Users','Product Hunt Top 3','3x faster content workflow'],
        tags: ['Next.js','Python','FastAPI','React Flow','OpenAI'],
        demo: 'https://example.com',
        repo: 'https://github.com'
      },
      {
        id: 2,
        title: 'Horizon Pay — Global Cross-Border Platform',
        category: 'fullstack',
        cat: 'Fullstack · Fintech',
        img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
        desc: 'PCI-DSS compliant payment infrastructure with strict ACID compliance, zero-downtime migrations, and automated compliance reporting across 40+ countries.',
        metrics: ['$120M+ processed volume','40+ countries supported','Zero security incidents'],
        tags: ['TypeScript','Node.js','PostgreSQL','Redis','Docker'],
        demo: 'https://example.com',
        repo: 'https://github.com'
      },
      {
        id: 3,
        title: 'Aura UI — Enterprise Design System',
        category: 'frontend',
        cat: 'Frontend · Design',
        img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        desc: 'Accessible, themeable React component library unifying branding across 14 enterprise applications. WCAG AAA compliant with dark mode and full documentation.',
        metrics: ['Used in 14 products','99.8% test coverage','WCAG AAA compliant'],
        tags: ['React','Tailwind CSS','Framer Motion','Storybook','TypeScript'],
        demo: 'https://example.com',
        repo: 'https://github.com'
      }
    ]
  });
});

// ─── API: Portfolio Stats ─────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    ok: true,
    stats: {
      yearsExperience: 7,
      projectsShipped: 45,
      satisfaction: 100,
      commits: 12000,
      messagesReceived: messages.length
    }
  });
});

// ─── API: Health Check ────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'running', time: new Date().toISOString() });
});

module.exports = app;
