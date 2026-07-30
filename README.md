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

## 🐳 Step 4: Using Docker & Jenkins CI/CD Pipeline (Learning Guide)

This repository includes a complete **Docker** and **Jenkins CI/CD** configuration so you can learn industry-standard containerized deployments!

### 1️⃣ Files Included for Docker & Jenkins
- **`Dockerfile`**: Defines a lightweight, secure Node.js Alpine Linux container image with multi-layer dependency caching.
- **`.dockerignore`**: Prevents unnecessary files (`node_modules`, `.git`, `.github`) from being copied into the container image.
- **`Jenkinsfile`**: A Declarative Jenkins Pipeline that automates checkout, Docker build, deployment, and health verification.
- **`docker-compose.yml`**: Allows simple local container testing with Docker Compose.

---

### 2️⃣ How to Test Docker Locally (Before Jenkins)

You can build and run the container locally on your computer:

#### Option A: Using NPM Scripts
```bash
# 1. Build the Docker image
npm run docker:build

# 2. Run the Docker container on http://localhost
npm run docker:run
```

#### Option B: Using Docker Compose
```bash
# Start container in the background
docker compose up -d

# Check logs
docker compose logs -f

# Stop and remove container
docker compose down
```

---

### 3️⃣ Setting Up Jenkins CI/CD Pipeline

#### Prerequisites on your Jenkins / AWS EC2 Server:
Make sure Docker is installed on your Jenkins server and the `jenkins` user has permission to run Docker commands:
```bash
# 1. Install Docker on Linux (Ubuntu/Debian)
sudo apt update
sudo apt install -y docker.io

# 2. Add the jenkins user to the docker group so it can run docker commands without sudo
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu

# 3. Restart Docker and Jenkins services
sudo systemctl restart docker
sudo systemctl restart jenkins
```

#### Create a Pipeline Job in Jenkins:
1. Open your **Jenkins Dashboard** in your browser.
2. Click **New Item** in the left menu.
3. Enter a project name (e.g., `nodejs-docker-cicd`) and select **Pipeline**, then click **OK**.
4. Scroll down to the **Pipeline** section:
   - **Definition**: Choose **Pipeline script from SCM**
   - **SCM**: Choose **Git**
   - **Repository URL**: Paste your GitHub repository URL (e.g., `https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git`)
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`
5. Click **Save**.
6. Click **Build Now** to trigger your first containerized deployment!

---

### 4️⃣ What Happens in the Jenkins Pipeline (`Jenkinsfile`)?

```mermaid
graph TD
    A[👨‍💻 Developer Pushes Code to GitHub] -->|git push origin main| B(GitHub Repository)
    B -->|Triggers Jenkins Job| C[Stage 1: 📥 Checkout Code]
    C --> D[Stage 2: 🔍 Verify Docker Environment]
    D --> E[Stage 3: 🐳 Build Docker Image nodejs-cicd-app:latest]
    E --> F[Stage 4: 🚀 Deploy Container - Recreate Docker Container on Port 80]
    F --> G[Stage 5: ✅ Verify Deployment - Run HTTP Health Check]
    G --> H[🎉 Updated Container App Live!]
```

1. **Checkout Code 📥**: Pulls the latest code from GitHub.
2. **Verify Docker Environment 🔍**: Checks `docker --version` and `docker info`.
3. **Build Docker Image 🐳**: Runs `docker build -t nodejs-cicd-app:latest .` to create a lightweight Alpine image.
4. **Deploy Container 🚀**:
   - Safely removes any existing container (`docker rm -f nodejs-cicd-container`).
   - Starts the new container (`docker run -d -p 80:80 --name nodejs-cicd-container ...`).
5. **Verify Deployment ✅**: Makes an HTTP request to `http://localhost/api/health` to confirm the Express server is `UP`.
6. **Post-Build Actions 🧹**: Automatically prunes dangling Docker images (`docker image prune -f`) to save disk space on your server.

---

## 🔄 How to Test Live Reload (Git Push -> Jenkins Docker Deploy)

1. Open `index.js` and edit `APP_VERSION` or `DEPLOY_MESSAGE`:
   ```javascript
   const APP_VERSION = "2.1.0";
   const DEPLOY_MESSAGE = "Nizamuddin Jenkins Docker CI/CD Pipeline is Live! 🐳🚀";
   ```
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test Jenkins Docker CI/CD pipeline"
   git push origin main
   ```
3. Check your Jenkins dashboard -> The Pipeline will automatically build the new Docker image and recreate the container without downtime!

