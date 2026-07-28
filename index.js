const express = require('express');
const app = express();

// By default listens on Port 80 so you can open http://<YOUR_EC2_IP> in your browser directly
const PORT = process.env.PORT || 80;

// =========================================================================
// 💡 TEST CI/CD HERE: Change the version or message below and push to GitHub!
// =========================================================================
const APP_VERSION = "1.0.0";
const DEPLOY_MESSAGE = "CI/CD Pipeline is Working! Node.js running on AWS EC2 via PM2 🚀";

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    version: APP_VERSION,
    runtime: 'Node.js + PM2 (No Docker)',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Node.js CI/CD on AWS EC2</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          background: radial-gradient(circle at top right, #1e1b4b, #09090b 60%);
          color: #f4f4f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-x: hidden;
        }
        .bg-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          filter: blur(120px);
          opacity: 0.25;
          z-index: 0;
          border-radius: 50%;
          top: 10%;
          right: 20%;
          animation: float 8s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 40px) scale(1.1); }
        }
        .card {
          position: relative;
          z-index: 10;
          background: rgba(24, 24, 27, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 640px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .badge::before {
          content: "";
          width: 8px;
          height: 8px;
          background-color: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 12px #34d399;
        }
        h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #ffffff, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p.subtitle {
          color: #a1a1aa;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .info-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 1rem;
          text-align: center;
        }
        .info-label {
          font-size: 0.75rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }
        .info-value {
          font-size: 1.15rem;
          font-weight: 600;
          color: #f4f4f5;
        }
        .version-highlight {
          color: #60a5fa;
        }
        .instructions {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
        }
        .instructions h3 {
          font-size: 0.95rem;
          color: #e4e4e7;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .instructions p {
          color: #71717a;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        code {
          background: rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          color: #93c5fd;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="bg-glow"></div>
      <div class="card">
        <div class="badge">AWS EC2 Active Deployment (PM2) Nizamuddin Welcome to devops </div>
        <h1>${DEPLOY_MESSAGE}</h1>
        <p class="subtitle">
          Baap tera Your Node.js application is running directly on Amazon EC2 managed by PM2, deployed automatically using GitHub Actions.
        </p>
        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">App Version</div>
            <div class="info-value version-highlight">v${APP_VERSION}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Process Manager</div>
            <div class="info-value">PM2 (No Docker)</div>
          </div>
          <div class="info-box">
            <div class="info-label">CI/CD Engine</div>
            <div class="info-value">GitHub Actions</div>
          </div>
        </div>
        <div class="instructions">
          <h3>💡 How to test CI/CD automatic reload:</h3>
          <p>
            1. Edit <code>APP_VERSION</code> or <code>DEPLOY_MESSAGE</code> in <code>index.js</code>.<br>
            2. Commit & push your changes to GitHub (<code>git push</code>).<br>
            3. GitHub Actions will automatically pull the new code and restart PM2 on EC2!
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Application Version: ${APP_VERSION}`);
});
