# Muhammad Farhan — Personal Portfolio Website
### Junior Cybersecurity Analyst & Full-Stack Web Developer

A modern, responsive, cyber-security themed portfolio website built for **Muhammad Farhan (M Farhan)** showcasing full-stack web engineering projects, cybersecurity competencies, interactive command-line terminal, and threat analysis tools.

---

## 🌟 Key Features

- **Cyber-Security & Modern Aesthetics**: Cyber-glow cyan/emerald design, glassmorphic cards, matrix background, and responsive layouts.
- **Dynamic Typing Tagline**: Cycles through cybersecurity, full-stack, and project roles.
- **Dark & Light Mode Toggle**: Smooth theme transition saved in `localStorage`.
- **Featured Project Showcase**:
  - **MalwareXAI**: AI-powered malware detection and behavioral analysis engine.
  - **Halwan Lost & Found Portal**: Full-stack verified recovery platform with RBAC & safe uploads.
  - **CyberSentinel**: Automated OWASP Top 10 Web Vulnerability Scanner.
  - **SecureGate**: Cryptographic 2FA & JWT authentication microservice.
  - **NetTrace**: High-speed C++ & Python raw packet analyzer.
  - **CyberMetrics**: Real-time security telemetry operations dashboard.
- **Project Detail Modals**: Click "Details & Architecture" for deep-dive case studies.
- **Interactive Security Terminal**: Type commands (`help`, `whoami`, `skills`, `projects`, `scan`, `contact`, `clear`) directly in the browser.
- **Interactive Contact Form**: SSL-style validated form with simulated transmission and toast alerts.
- **100% Zero-Build Dependency**: Pure HTML5, CSS3, and modern Vanilla JavaScript. Works immediately out of the box in any browser.

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Open
Simply double-click [`index.html`](file:///C:/Users/syed/.gemini/antigravity/scratch/portfolio-muhammad-farhan/index.html) or right-click and choose **Open with Chrome / Edge / Firefox**.

### Option 2: Local HTTP Server (Python)
Run the following in PowerShell / Command Prompt inside this folder:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

---

## 🌐 Deploy to GitHub Pages (Free)

1. Create a new repository on GitHub (e.g. `farhan-portfolio`).
2. Push all files in this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Muhammad Farhan portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/farhan-portfolio.git
   git push -u origin main
   ```
3. Go to **Settings > Pages** in your GitHub repository and set the branch to `main` (root).
4. Your website will be live at: `https://YOUR_USERNAME.github.io/farhan-portfolio/`

---

## 🌐 Deploy to Vercel or Netlify (1-Click)

1. Drag-and-drop this entire folder into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. To link your domain (`mypersonalwebsite.com`), go to **Domain Management** in Vercel/Netlify settings and add your CNAME / DNS records.

---

## ✏️ Customization

- **Resume/CV**: Place your resume PDF in the directory (e.g. `resume.pdf`) and update the `download-cv-btn` action in `script.js` or link directly in `index.html`.
- **Social Links**: Replace placeholder URLs in `index.html` (GitHub, LinkedIn, Email) with your actual profile handles.
