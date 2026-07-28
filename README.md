# Node.js CI/CD Deployment to AWS EC2 via GitHub Actions (Without Docker) 🚀

This repository is a complete, beginner-friendly sample application designed to teach you how **Continuous Integration & Continuous Deployment (CI/CD)** works using **GitHub Actions**, **Node.js**, and **Amazon AWS EC2** (using **PM2** process manager — **no Docker needed!**).

---

## 🏛️ Architecture & Workflow

When you push a code change to the `main` branch, GitHub Actions automatically runs the pipeline:

```mermaid
graph TD
    A[👨‍💻 Developer Pushes Code to GitHub] -->|git push origin main| B(GitHub Repository)
    B -->|Triggers Workflow| C[⚙️ Job 1: Test & Verify Syntax]
    C -->|If Tests Pass| D[🚀 Job 2: Deploy to AWS EC2 via SSH]
    D -->|1. Connects with SSH Key| E[🖥️ AWS EC2 Instance]
    E -->|2. git pull origin main| F[📥 Pulls Latest Code]
    F -->|3. npm install --production| G[📦 Installs Packages]
    G -->|4. pm2 restart / start| H[🔄 Restarts Node.js App via PM2]
    H --> I[🌐 Updated Application Live on EC2 Public IP!]
```

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD Pipeline (PM2 / Node.js)
├── index.js                 # Express server with styled landing page & health check
├── package.json             # Node.js metadata & dependencies
└── README.md                # Full setup & tutorial guide
```

---

## 🛠️ Step 1: AWS EC2 Setup (Simple Node.js & PM2)

### 1. Launch an EC2 Instance
1. Log into your [AWS Management Console](https://console.aws.amazon.com/ec2/) and navigate to **EC2**.
2. Click **Launch Instance**.
3. **Name**: `nodejs-cicd-server`
4. **AMI (OS)**: Select **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
5. **Instance Type**: `t2.micro` or `t3.micro` (Free Tier Eligible).
6. **Key Pair**: Click **Create new key pair** -> name it `ec2-key` -> download the `.pem` file. **Save this file safely!**
7. **Security Group (Firewall Rules)**:
   - Allow **SSH (Port 22)** from `0.0.0.0/0`.
   - Allow **HTTP (Port 80)** from `0.0.0.0/0` (so anyone can view your webpage).
   - Allow **HTTPS (Port 443)** from `0.0.0.0/0`.
8. Click **Launch Instance**.

---

### 2. Install Node.js, Git & PM2 on your EC2 Instance
SSH into your EC2 instance from your terminal using the `.pem` key you downloaded:

```bash
# Replace with the path to your .pem file and your EC2 Public IP
ssh -i /path/to/ec2-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Once inside your EC2 server, run the following commands to install Node.js (v20), Git, and PM2:

```bash
# 1. Update system packages
sudo apt update -y && sudo apt upgrade -y

# 2. Install Git and curl
sudo apt install -y git curl

# 3. Install Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 process manager globally (so the app runs in the background continuously)
sudo npm install -g pm2
```

---

## 🔑 Step 2: Configure GitHub Secrets

For GitHub Actions to securely connect to your EC2 instance, you must add 3 secrets in your GitHub repository:

1. Go to your GitHub repository in your browser.
2. Click **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add the following 3 secrets:

| Secret Name | What to Enter | Example |
| :--- | :--- | :--- |
| `EC2_HOST` | Your EC2 instance **Public IPv4 address** | `54.123.45.67` |
| `EC2_USERNAME` | Your SSH username for Ubuntu AMI | `ubuntu` |
| `EC2_SSH_KEY` | The entire content of your downloaded `.pem` key file | `-----BEGIN RSA PRIVATE KEY----- ...` |

> [!IMPORTANT]
> When pasting `EC2_SSH_KEY`, open your `.pem` file in a text editor and copy **everything** including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`.

---

## 🧪 Step 3: Test Your Automated CI/CD Deployment!

Now comes the fun part — seeing CI/CD in action!

### 1. Push this repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit of simple Node.js CI/CD application"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### 2. Watch the deployment automatically trigger
1. Go to your GitHub repository and click the **Actions** tab.
2. You will see the **Node.js CI/CD Pipeline to AWS EC2 (Without Docker)** workflow running:
   - ✅ **Build & Test Application**: Tests the Node.js syntax and installs packages.
   - ✅ **Deploy to AWS EC2**: Connects to EC2 via SSH, pulls your code, installs npm packages, and starts/restarts PM2 on Port 80.
3. Once completed, open your browser and visit:  
   `http://<YOUR_EC2_PUBLIC_IP>`  
   You will see your live application! 🎉

---

## 🔄 How to Test Code Changes (Live Reload via Git Push)

Whenever you change code and push to GitHub, it will automatically reflect on your server:

1. Open `index.js` in your editor.
2. Change the message or version:
   ```javascript
   const APP_VERSION = "2.0.0";
   const DEPLOY_MESSAGE = "I changed the code and pushed to GitHub — CI/CD updated PM2 automatically! 🚀";
   ```
3. Commit and push:
   ```bash
   git add index.js
   git commit -m "Update homepage title to test CI/CD"
   git push origin main
   ```
4. Check the **Actions** tab on GitHub — within 30 seconds, refresh your browser at `http://<YOUR_EC2_PUBLIC_IP>` and watch the new version appear instantly!
