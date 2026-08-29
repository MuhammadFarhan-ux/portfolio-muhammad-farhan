/**
 * Muhammad Farhan (M Farhan) — 3D Animated Portfolio Script
 * Junior Cybersecurity Analyst & Full-Stack Web Developer
 * Powered by Three.js WebGL & Interactive 3D Tilt Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D WebGL Canvas
  initThreeJSBackground();
  initMini3DViewport();
  init3DCardTiltPhysics();

  // Initialize UI & Feature Modules
  initThemeToggle();
  initDynamicTyping();
  initMobileNavigation();
  initScrollSpy();
  initProjectFiltering();
  initProjectModals();
  initInteractiveTerminal();
  initContactForm();
  initDownloadCV();
});

/* ==========================================================================
   1. THREE.JS 3D WEBGL CYBER BACKGROUND ENGINE
   ========================================================================== */
let threeScene, threeCamera, threeRenderer;
let particleSystem, cyberMeshGroup, cyberPolyhedron;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let warpSpeedMultiplier = 1;

function initThreeJSBackground() {
  const canvas = document.getElementById('bg-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // 1. Setup Scene, Camera & Renderer
  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  threeCamera.position.z = 500;

  threeRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Create 3D Cyber Particle Network
  const particleCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorGreen = new THREE.Color(0x10b981);
  const colorPurple = new THREE.Color(0x8b5cf6);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Distribute in a spherical cloud around origin
    positions[i] = (Math.random() - 0.5) * 1400;
    positions[i + 1] = (Math.random() - 0.5) * 1400;
    positions[i + 2] = (Math.random() - 0.5) * 1000;

    // Mixed cyber security palette
    const rand = Math.random();
    const chosenColor = rand < 0.5 ? colorCyan : (rand < 0.8 ? colorGreen : colorPurple);
    colors[i] = chosenColor.r;
    colors[i + 1] = chosenColor.g;
    colors[i + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom circular particle texture via canvas
  const particleMaterial = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, particleMaterial);
  threeScene.add(particleSystem);

  // 3. Create 3D Orbiting Cyber Shield Mesh (Icosahedron Wireframe)
  cyberMeshGroup = new THREE.Group();

  const icoGeometry = new THREE.IcosahedronGeometry(120, 1);
  const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.35,
    linewidth: 1.5
  });

  cyberPolyhedron = new THREE.LineSegments(icoWireframe, lineMaterial);
  cyberMeshGroup.add(cyberPolyhedron);

  // Inner floating core
  const coreGeometry = new THREE.OctahedronGeometry(60, 0);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
  cyberMeshGroup.add(innerCore);

  cyberMeshGroup.position.set(220, 50, -100);
  threeScene.add(cyberMeshGroup);

  // 4. Mouse & Touch Interactive Parallax Tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2);
  });

  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mouseX = (e.touches[0].clientX - window.innerWidth / 2);
      mouseY = (e.touches[0].clientY - window.innerHeight / 2);
    }
  }, { passive: true });

  // 5. Speed Toggle
  const fxToggleBtn = document.getElementById('fx-3d-toggle');
  if (fxToggleBtn) {
    fxToggleBtn.addEventListener('click', () => {
      warpSpeedMultiplier = warpSpeedMultiplier === 1 ? 3 : (warpSpeedMultiplier === 3 ? 0.4 : 1);
      showToast(`3D Warp Speed: ${warpSpeedMultiplier}x`, 'info');
    });
  }

  // 6. Window Resize Listener
  window.addEventListener('resize', () => {
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 7. 3D Render Loop (60 FPS)
  function animate3D() {
    requestAnimationFrame(animate3D);

    const speed = 0.001 * warpSpeedMultiplier;

    // Rotate particles
    if (particleSystem) {
      particleSystem.rotation.y += speed * 0.7;
      particleSystem.rotation.x += speed * 0.3;
    }

    // Rotate 3D cyber mesh
    if (cyberMeshGroup) {
      cyberMeshGroup.rotation.x += speed * 2;
      cyberMeshGroup.rotation.y += speed * 2.5;
      cyberPolyhedron.rotation.z += speed * 1.5;
    }

    // Smooth camera mouse parallax lerp
    targetX = mouseX * 0.25;
    targetY = mouseY * 0.25;

    threeCamera.position.x += (targetX - threeCamera.position.x) * 0.04;
    threeCamera.position.y += (-targetY - threeCamera.position.y) * 0.04;
    threeCamera.lookAt(threeScene.position);

    threeRenderer.render(threeScene, threeCamera);
  }

  animate3D();
}

/* ==========================================================================
   2. HERO MINI 3D INTERACTIVE VIEWPORT
   ========================================================================== */
function initMini3DViewport() {
  const container = document.getElementById('card-3d-viewport');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 300;
  const height = container.clientHeight || 110;

  const miniScene = new THREE.Scene();
  const miniCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  miniCamera.position.z = 7;

  const miniRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  miniRenderer.setSize(width, height);
  miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(miniRenderer.domElement);

  // Floating Cyber Diamond
  const octaGeo = new THREE.OctahedronGeometry(2.2, 0);
  const wireGeo = new THREE.WireframeGeometry(octaGeo);
  const octaMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
  const diamondMesh = new THREE.LineSegments(wireGeo, octaMat);
  miniScene.add(diamondMesh);

  // Orbiting ring
  const ringGeo = new THREE.TorusGeometry(3.2, 0.05, 8, 30);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.5 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  miniScene.add(ringMesh);

  function animateMini() {
    requestAnimationFrame(animateMini);
    diamondMesh.rotation.y += 0.015;
    diamondMesh.rotation.x += 0.008;
    ringMesh.rotation.z += 0.01;
    miniRenderer.render(miniScene, miniCamera);
  }

  animateMini();

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    miniCamera.aspect = w / h;
    miniCamera.updateProjectionMatrix();
    miniRenderer.setSize(w, h);
  });
}

/* ==========================================================================
   3. 3D INTERACTIVE CARD TILT PHYSICS
   ========================================================================== */
function init3DCardTiltPhysics() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   4. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('mf_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('mf_portfolio_theme', newTheme);
      
      showToast(`Theme switched to ${newTheme.toUpperCase()}`, 'info');
    });
  }
}

/* ==========================================================================
   5. DYNAMIC HERO TYPING EFFECT
   ========================================================================== */
function initDynamicTyping() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'Junior Cybersecurity Analyst',
    '3D WebGL & Full-Stack Developer',
    'Explainable AI (SHAP & LIME Interpretability)',
    'Creator of MalwareXAI (Random Forest Detection)',
    'Halwan Lost & Found Portal Architect',
    'Secure Coding (Bcrypt, CSRF, Prepared SQL)'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 35;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   6. MOBILE NAVIGATION & HAMBURGER
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* ==========================================================================
   7. SCROLL SPY & ACTIVE NAV LINK
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   8. PROJECT FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'perspective(1000px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   9. PROJECT MODALS
   ========================================================================== */
const projectData = {
  malwarexai: {
    title: 'MalwareXAI — Explainable AI Malware Detection Engine',
    tag: 'Flagship Machine Learning & XAI Project',
    overview: 'MalwareXAI is an innovative Explainable AI (XAI) security platform designed to classify malicious executables and explain machine learning decisions to security analysts. Utilizing Random Forest classification alongside SHAP (Shapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations), MalwareXAI eliminates the "black box" nature of AI threat detection.',
    features: [
      'Random Forest classifier trained on static PE headers, byte entropy, and import tables.',
      'SHAP global feature importance mapping to highlight universal malware characteristics.',
      'LIME local surrogate models providing granular explanations for why a specific binary was flagged.',
      'Interactive analyst dashboard built with Python (Flask) and JavaScript for rapid triage.',
      'Significant reduction in false positives through transparent feature attribution.'
    ],
    tech: ['Python 3.10+', 'Scikit-Learn (Random Forest)', 'SHAP', 'LIME', 'Flask', 'JavaScript ES6+', 'PEfile'],
    securityTakeaways: 'Demonstrated how explainability builds trust between AI systems and SOC teams, enabling actionable mitigation rather than unverified alerts.'
  },
  halwan: {
    title: 'Halwan Lost & Found Portal — Full-Stack Community Platform',
    tag: 'Flagship Full-Stack Web Platform (PHP/MySQL)',
    overview: 'Halwan Lost & Found Portal is an end-to-end community and campus platform facilitating secure lost item reporting, claim verification, and admin moderation. Built in PHP and MySQL with a rigorous focus on secure coding practices to safeguard user data and prevent exploitation.',
    features: [
      'Comprehensive Role-Based Access Control (Admin, Verifier, Regular User) with custom admin dashboards.',
      'Bcrypt password hashing with salt and secure session cookie flags (HttpOnly, SameSite).',
      'Full CSRF token protection on all state-changing POST and AJAX forms.',
      'Parameterized prepared SQL statements protecting against SQL Injection (SQLi).',
      'Robust file-upload pipeline with MIME-type verification, EXIF metadata stripping, and size validation.',
      'Responsive UI design optimized across smartphones, tablets, and desktop workstations.'
    ],
    tech: ['PHP 8.x', 'MySQL', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Bcrypt', 'CSRF Protection', 'Prepared Statements'],
    securityTakeaways: 'Engineered a resilient zero-trust web application adhering strictly to OWASP secure development principles.'
  },
  cybermetrics: {
    title: 'CyberMetrics — React.js Security Operations App',
    tag: 'Frontend Framework & Responsive UI',
    overview: 'A high-performance single-page application built with React.js for real-time security telemetry monitoring, log analysis, and firewall alerts.',
    features: [
      'Modular React component hierarchy with reusable UI widgets and state hooks.',
      'Responsive design adapting gracefully across mobile, tablet, and widescreen monitors.',
      'Live metric charts with asynchronous polling and client-side sanitization.',
      'Theme engine supporting seamless dark and light mode preferences.'
    ],
    tech: ['React.js', 'JavaScript (ES6+)', 'CSS Modules', 'Flask API Integration', 'Responsive Design'],
    securityTakeaways: 'Demonstrates modern frontend engineering with strict client-side sandboxing and minimal render latency.'
  },
  cybersentinel: {
    title: 'CyberSentinel — Automated Web Application Vulnerability Scanner',
    tag: 'Proactive Security & Audit Tool',
    overview: 'CyberSentinel is a modular automated vulnerability scanner created in Python and C++ to audit web applications against common security vulnerabilities. It crawls site structures, checks HTTP security headers, detects SQL injection vulnerabilities, and audits for XSS reflection.',
    features: [
      'Asynchronous multithreaded socket crawler with customizable payload injection engines.',
      'Checks for essential security headers (Content-Security-Policy, HSTS, X-Frame-Options).',
      'Automated generation of audit reports formatted with remediation steps and CVSS scores.',
      'Low-level C++ network routines for high-speed endpoint verification.'
    ],
    tech: ['Python', 'C++', 'Asyncio / Sockets', 'BeautifulSoup4', 'OWASP Benchmarks'],
    securityTakeaways: 'Provided hands-on experience identifying and remediating real-world injection and configuration flaws in live web apps.'
  },
  securegate: {
    title: 'SecureGate — Cryptographic Authentication & RBAC Engine',
    tag: 'Enterprise Authentication Microservice',
    overview: 'A robust identity and access management microservice featuring JWT dual-token rotation, redis-based token revocation blacklists, bcrypt password salting, brute-force throttling, and RFC 6238-compliant Two-Factor Authentication (TOTP).',
    features: [
      'Short-lived Access Tokens paired with rotating Refresh Tokens.',
      'Sliding window rate-limiter using Redis to defeat credential stuffing attacks.',
      'TOTP QR code generation and verification for Google Authenticator / Authy.',
      'Granular permission scopes for role-based microservice authorization.'
    ],
    tech: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Speakeasy (TOTP)', 'JWT'],
    securityTakeaways: 'Built to demonstrate enterprise-grade defensive practices against session hijacking and account takeovers.'
  },
  nettrace: {
    title: 'NetTrace — Low-Level Network Packet Sniffer & Anomaly Monitor',
    tag: 'Systems & Network Engineering (C++)',
    overview: 'NetTrace captures raw Ethernet frames, dissects IP, TCP, and UDP headers in real-time, and flags suspicious network patterns such as port sweeps, SYN flood attempts, and DNS tunneling anomalies.',
    features: [
      'Direct raw socket interaction in C++ with minimal CPU overhead.',
      'Protocol breakdown with customizable packet filters (BPF syntax).',
      'Export capability to .PCAP format for deeper Wireshark forensic investigation.'
    ],
    tech: ['C++', 'Python', 'Raw Sockets', 'Libpcap', 'Linux Networking'],
    securityTakeaways: 'Strengthened low-level TCP/IP understanding and intrusion detection fundamentals.'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modalOverlay || !modalBody || !closeBtn) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-header-sec">
          <span class="modal-tag"><i class="fa-solid fa-shield-halved"></i> ${data.tag}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>

        <p class="modal-overview">${data.overview}</p>

        <h4 class="modal-section-title"><i class="fa-solid fa-list-check"></i> Key Engineering Features</h4>
        <ul class="modal-features-list">
          ${data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('')}
        </ul>

        <h4 class="modal-section-title"><i class="fa-solid fa-code"></i> Technologies & Architecture</h4>
        <div class="project-tech-stack">
          ${data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-lock"></i> Security & Engineering Takeaway</h4>
        <p class="modal-overview">${data.securityTakeaways}</p>

        <div class="modal-footer-btns">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <a href="#contact" class="btn btn-outline modal-discuss-btn">
            <i class="fa-regular fa-comments"></i> Discuss This Project
          </a>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      const discussBtn = modalBody.querySelector('.modal-discuss-btn');
      if (discussBtn) {
        discussBtn.addEventListener('click', () => {
          closeModal();
        });
      }
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. INTERACTIVE TERMINAL EMULATOR
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');

  if (!terminalInput || !terminalOutput || !terminalBody) return;

  const commands = {
    help: `Available Commands:
  • help       : Show list of terminal commands
  • whoami     : Display Muhammad Farhan's bio summary
  • skills     : Display cybersecurity & full-stack skill matrix
  • xai        : Details on Explainable AI (SHAP & LIME) in MalwareXAI
  • 3d         : Information about the 3D WebGL particle engine
  • projects   : View key projects (MalwareXAI, Halwan Portal, React, etc.)
  • scan       : Execute a simulated web security vulnerability audit
  • contact    : View direct contact information and email
  • clear      : Clear terminal screen`,

    whoami: `Name: Muhammad Farhan (M Farhan)
Role: Junior Cybersecurity Analyst & Full-Stack Web Developer
Experience: 2 Years Professional Web Engineering & Threat Analysis
Specializations: 3D WebGL Animations, Explainable AI (SHAP & LIME), Secure Full-Stack Apps, OWASP Audits, Secure Coding (Bcrypt, CSRF, Prepared SQL).`,

    skills: `Technical Skills Matrix:
  [Languages]           : JavaScript (ES6+), HTML5, CSS3, PHP, Python, C++, SQL, Bash
  [Professional Exp]    : Junior Cybersecurity Analyst + 2 Years Professional Web Dev
  [Secure Practices]    : Bcrypt Hashing, CSRF Tokens, Prepared Statements, File MIME Validation
  [Machine Learning/XAI]: Random Forest Classifier, SHAP Interpretability, LIME Explanations
  [Frameworks & 3D]     : Three.js (3D WebGL), React.js (Frontend), Flask (Backend), PHP/MySQL Full-Stack
  [UI & Design]         : Responsive Web Design (Mobile / Tablet / Desktop) + 3D Tilt Physics`,

    xai: `[EXPLAINABLE AI ARCHITECTURE — MalwareXAI]
  • Model        : Random Forest Classifier (Scikit-Learn)
  • Explainers   : SHAP (Shapley Additive exPlanations) + LIME (Local Interpretable Model-agnostic Explanations)
  • Features     : PE Header byte entropy, DLL imports, section headers, opcodes
  • Objective    : Provide interpretable, transparent attribution for detected malware threats.`,

    '3d': `[3D WEBGL ENGINE SPECS]
  • Core Library : Three.js WebGL
  • Particles    : 1,400+ Interactive Cyber Starfield Points with Parallax Tracking
  • Mesh Objects : Floating Wireframe Icosahedron & Octahedron Core
  • Physics      : Real-time 3D Mouse Tilt & Raycast Parallax`,

    projects: `Featured Projects:
  1. MalwareXAI              - AI Malware Detection with Random Forest + SHAP & LIME Explainability
  2. Halwan Lost & Found     - Full-Stack PHP/MySQL Portal with Bcrypt, CSRF, & Prepared Statements
  3. CyberMetrics React App  - Real-Time Security Operations Dashboard (React.js + Flask)
  4. CyberSentinel           - Automated OWASP Top 10 Web Vulnerability Scanner (Python/C++)
  5. SecureGate              - Cryptographic 2FA & JWT Authentication Microservice
  6. NetTrace                - High-Performance C++ & Python Raw Packet Sniffer`,

    contact: `Contact Muhammad Farhan:
  • Email     : farhan@mypersonalwebsite.com
  • Website   : mypersonalwebsite.com
  • LinkedIn  : linkedin.com/in/muhammad-farhan
  • GitHub    : github.com/muhammad-farhan
  • Status    : Open for Full-Time & Consulting Roles`,

    scan: `[INITIALIZING SECURITY AUDIT SCAN]
Connecting to target endpoint... [OK]
Checking HTTP Security Headers (CSP, HSTS, X-Frame)... [SECURE]
Testing for SQL Injection vulnerabilities... [CLEAN - Prepared Statements Active]
Checking for Cross-Site Scripting (XSS) vectors... [PROTECTED]
Auditing CSRF Token Protection... [VERIFIED]
Auditing Password Hashing Schemes... [PASS - Bcrypt Active]
Auditing File-Upload Validation Pipeline... [PASS - MIME & EXIF Checks Active]
Checking 3D WebGL GPU Memory & Buffer Security... [SECURE]
Scanning open ports & services... [FILTERED]

>>> AUDIT SUMMARY: 0 Critical, 0 High, 0 Medium issues found.
>>> SECURITY HEALTH SCORE: 100% (OWASP Benchmark Compliant)`
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = terminalInput.value.trim();
      const cmd = rawInput.toLowerCase();

      if (!rawInput) return;

      const entryDiv = document.createElement('div');
      entryDiv.className = 'term-entry';

      const echoLine = document.createElement('div');
      echoLine.className = 'term-command-echo';
      echoLine.innerHTML = `<span class="text-green">farhan@cyber</span>:<span class="text-cyan">~</span>$ ${escapeHtml(rawInput)}`;
      entryDiv.appendChild(echoLine);

      if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        terminalInput.value = '';
        return;
      }

      const responseLine = document.createElement('div');
      responseLine.className = 'term-response';

      if (commands[cmd]) {
        responseLine.textContent = commands[cmd];
      } else {
        responseLine.innerHTML = `<span style="color:#ef4444;">Command not recognized: '${escapeHtml(cmd)}'.</span> Type <span class="term-cmd">help</span> for a list of valid commands.`;
      }

      entryDiv.appendChild(responseLine);
      terminalOutput.appendChild(entryDiv);

      terminalInput.value = '';
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('term-cmd')) {
      const cmd = e.target.textContent.trim();
      terminalInput.value = cmd;
      terminalInput.focus();
      terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    }
  });
}

/* ==========================================================================
   11. CONTACT FORM HANDLER WITH VALIDATION & TOASTS
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  const btnSpinner = document.getElementById('btn-spinner');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    btnText.textContent = 'Encrypting & Sending...';
    btnIcon.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Message Sent!';
      btnSpinner.style.display = 'none';
      btnIcon.className = 'fa-solid fa-check';
      btnIcon.style.display = 'inline-block';

      showToast(`Thank you, ${name}! Your secure message has been received. I'll reply to ${email} shortly.`, 'success');

      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fa-solid fa-paper-plane';
        submitBtn.disabled = false;
      }, 3000);

    }, 1200);
  });
}

/* ==========================================================================
   12. RESUME / CV DOWNLOAD TRIGGER
   ========================================================================== */
function initDownloadCV() {
  const downloadBtn = document.getElementById('download-cv-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    showToast('Muhammad Farhan Resume / CV PDF is ready! (Placeholder linked)', 'info');
  });
}

/* ==========================================================================
   13. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconHtml = '<i class="fa-solid fa-info-circle" style="color:var(--accent-cyan);"></i>';
  if (type === 'success') {
    iconHtml = '<i class="fa-solid fa-circle-check" style="color:var(--accent-green);"></i>';
  } else if (type === 'error') {
    iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return String(string).replace(/[&<>"'/]/g, (s) => entityMap[s]);
}
