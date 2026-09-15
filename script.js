/**
 * Muhammad Farhan (M Farhan) — Portfolio Script
 * Matching Reference Design with Auto Dark/Light Support & 3D WebGL
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initDynamicTyping();
  initNavigation();
  initProjectFiltering();
  initProjectModals();
  initInteractiveTerminal();
  initContactForm();
  initCopyEmailButtons();
  initThreeJSBackground();
  initDownloadCV();
});

/* ==========================================================================
   1. AUTO DARK / LIGHT THEME MANAGER (SYSTEM DETECTION + MANUAL TOGGLE)
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // 1. Check for manual saved preference in localStorage
  const savedTheme = localStorage.getItem('mf_portfolio_theme');

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // 2. Auto-detect user's OS/device color scheme
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = systemPrefersDark ? 'dark' : 'light';
    applyTheme(initialTheme);
  }

  // 3. Listen for OS theme changes in real-time
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't explicitly set a preference
    if (!localStorage.getItem('mf_portfolio_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Device theme changed: ${newTheme.toUpperCase()} mode active`, 'info');
    }
  });

  // 4. Manual toggle click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      applyTheme(newTheme);
      localStorage.setItem('mf_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
  }
}

/* ==========================================================================
   2. DYNAMIC TYPING EFFECT
   ========================================================================== */
function initDynamicTyping() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'IT Support Technician',
    'Cybersecurity Analyst',
    'Hardware & PC Repair Specialist',
    'MalwareXAI Creator (SHAP & LIME)',
    'Based in Dubai, UAE'
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
   3. SEPARATE NAVBAR, MULTI-PAGE ACTIVE STATE & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const menuIcon = document.getElementById('menu-icon');
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  // Multi-page Active Nav Link Detection (supports both file.html and clean route /about)
  const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
  const currentPath = pathname.split('/').pop() || 'index.html';
  const cleanPath = currentPath.replace('.html', '').toLowerCase();
  
  navItems.forEach(item => {
    const itemHref = (item.getAttribute('href') || '').replace('.html', '').toLowerCase();
    if (itemHref === cleanPath || (cleanPath === '' && (itemHref === 'index' || itemHref === '')) || (cleanPath === 'index' && (itemHref === 'index' || itemHref === ''))) {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    }
  });

  // Mobile Hamburger Toggle
  if (menuIcon && navbar) {
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('active');
      const isOpen = navbar.classList.contains('active');
      menuIcon.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav item
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close mobile navbar when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('active') && !navbar.contains(e.target) && !menuIcon.contains(e.target)) {
        navbar.classList.remove('active');
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // Sticky Header Shadow
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
      header.classList.toggle('sticky', window.scrollY > 50);
    }
  });
}

/* ==========================================================================
   4. 1-CLICK EMAIL COPY
   ========================================================================== */
function initCopyEmailButtons() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'syedfarhansaif@gmail.com';
      
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied to clipboard: ${email}`, 'success');
      }).catch(() => {
        showToast(`Email: ${email}`, 'info');
      });
    });
  });
}

/* ==========================================================================
   5. PORTFOLIO PROJECT FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioBoxes = document.querySelectorAll('.portfolio-box');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioBoxes.forEach(box => {
        const category = box.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          box.style.display = 'flex';
          setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';
          }, 10);
        } else {
          box.style.opacity = '0';
          box.style.transform = 'scale(0.95)';
          setTimeout(() => {
            box.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  malwarexai: {
    title: 'MalwareXAI — Explainable AI Malware Detection Platform',
    tag: 'Flagship Academic Project (Cybersecurity & AI)',
    overview: 'MalwareXAI is an Explainable AI (XAI) threat classification system engineered using Random Forest machine learning paired with SHAP (Shapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) to analyze Windows executable (.exe) files and deliver transparent, explainable feature attributions for security analysts.',
    features: [
      'Random Forest classifier trained on PE headers, byte entropy, and import tables.',
      'SHAP global feature impact analysis for universal threat patterns.',
      'LIME local surrogate models explaining individual file classifications.',
      'Web-based interface built with React.js and Flask backend API.'
    ],
    tech: ['Python', 'Random Forest', 'SHAP', 'LIME', 'React.js', 'Flask'],
    securityTakeaways: 'Eliminated the AI black box to build trust between automated classification systems and security analysts.'
  },
  halwan: {
    title: 'Halwan Lost & Found Portal — Full-Stack Web Platform',
    tag: 'Full-Stack Web Architecture (PHP / MySQL)',
    overview: 'A full-stack community lost-and-found recovery platform designed with AI-assisted modern UI and engineered with secure-by-design backend standards in PHP and MySQL.',
    features: [
      'Role-Based Access Control (Admin, Verifier, Regular User) with custom dashboard views.',
      'Bcrypt password hashing with salt and CSRF token protection on all forms.',
      'Parameterized prepared SQL statements protecting against SQL Injection (SQLi).',
      'Secure MIME and EXIF file validation pipeline for safe user image uploads.'
    ],
    tech: ['PHP 8.x', 'MySQL', 'JavaScript', 'HTML5/CSS3', 'Bcrypt', 'CSRF Tokens'],
    securityTakeaways: 'Zero-trust file upload processing and strict parameterization adhering to OWASP standards.'
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
        <div class="service-tags" style="justify-content: flex-start; margin-bottom: 2rem;">
          ${data.tech.map(t => `<span>${t}</span>`).join('')}
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-lock"></i> Security & Engineering Takeaway</h4>
        <p class="modal-overview">${data.securityTakeaways}</p>

        <div class="modal-footer-btns">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn">
            <i class="fa-brands fa-github"></i> View GitHub Code
          </a>
          <a href="mailto:syedfarhansaif@gmail.com" class="btn btn-secondary">
            <i class="fa-regular fa-envelope"></i> Inquire via Email
          </a>
        </div>
      `;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
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
   7. INTERACTIVE TERMINAL EMULATOR
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
  • projects   : View key projects (MalwareXAI, Halwan Portal, React, etc.)
  • scan       : Execute a simulated web security vulnerability audit
  • contact    : View direct contact information and email
  • clear      : Clear terminal screen`,

    whoami: `Name: Muhammad Farhan (M Farhan)
Role: IT Support Technician & Junior Cybersecurity Analyst
Location: Dubai, United Arab Emirates
Phone/WhatsApp: +971 52 153 5928
Email: syedfarhansaif@gmail.com
Experience: IT Support Intern (SRS Computing LLC - 6 Months)
Education: BSc Cybersecurity (De Montfort University – Dubai, 09/2025), HND, Pearson BTEC Level 3
Languages: English (Fluent), Urdu (Fluent)`,

    skills: `Technical Skills Matrix (From Official CV):
  [IT Support & Systems]  : Windows 10/11, Office 365, Hardware Troubleshooting, Desktop/Laptop Repair, OS Formatting
  [Peripherals & Setup]   : Printer & Peripheral Setup, Cable Management, Software Installation
  [Networking & Security] : Basic Networking (TCP/IP), Router/Switch Config, Threat Mitigation, Wireshark
  [Programming & XAI]     : Python (Basic), React.js & Flask (Academic), Random Forest, SHAP & LIME Explainability
  [User Support]          : Friendly, Patient, and Professional Technical Support Delivery`,

    xai: `[EXPLAINABLE AI ARCHITECTURE — MalwareXAI]
  • Academic Project : MalwareXAI (Developed using React.js, Flask, Random Forest, SHAP & LIME)
  • Model            : Random Forest Classifier (Scikit-Learn)
  • Explainers       : SHAP (Shapley Additive exPlanations) + LIME (Local Interpretable Model-agnostic Explanations)
  • Target           : Windows Executable (.exe) binary classification with transparent feature attribution.`,

    projects: `Featured Flagship Projects:
  1. MalwareXAI          - Explainable AI Malware Detection with Random Forest + SHAP & LIME (React.js + Flask)
  2. Halwan Lost & Found - Full-Stack Community Platform with Bcrypt Auth, CSRF, & Prepared Statements (PHP/MySQL)`,

    contact: `Contact Muhammad Farhan:
  • Location  : Dubai, United Arab Emirates
  • Mobile    : +971 52 153 5928
  • Email     : syedfarhansaif@gmail.com
  • CV File   : assets/Muhammad_Farhan_CV.pdf
  • Status    : Actively available for IT Support & Cybersecurity Roles in UAE`,

    scan: `[INITIALIZING SYSTEM & NETWORK DIAGNOSTIC SCAN]
Checking Windows OS & Registry Health... [OK]
Auditing TCP/IP Network Interfaces... [ONLINE]
Testing Hardware Integrity (RAM, Storage, CPU)... [HEALTHY]
Checking Security Protocols & Antivirus Status... [ACTIVE]
Auditing Password Security & Account Protections... [PASS - Bcrypt Protected]

>>> SYSTEM HEALTH SCORE: 100% (All Workstation Components Operational)`
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
   8. CONTACT FORM HANDLER (WITH REAL EMAIL NOTIFICATION TO syedfarhansaif@gmail.com)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const submitBtn = document.getElementById('contact-submit-btn') || document.getElementById('submit-btn') || contactForm.querySelector('button[type="submit"]');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') || submitBtn : null;
  const btnIcon = submitBtn ? submitBtn.querySelector('i') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.spinner-loader') : null;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const mobileInput = document.getElementById('contact-mobile');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Message';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please fill out Name, Email, and Message.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (btnText) btnText.textContent = 'Sending...';
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;

    // Send via Web3Forms API
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '23e803c6-2c5e-47f6-b184-4d8cb845b5fe', // Public Web3Forms forwarder key
          name: name,
          email: email,
          phone: mobile || 'Not specified',
          subject: subject,
          message: message,
          from_name: `${name} (via Farhan Portfolio)`,
          to_email: 'syedfarhansaif@gmail.com'
        })
      });

      const result = await response.json();

      if (response.status === 200 || result.success) {
        showSuccessState(name);
      } else {
        // Fallback: direct mailto client opening
        triggerMailtoFallback(name, email, mobile, subject, message);
      }
    } catch (err) {
      // Offline fallback
      triggerMailtoFallback(name, email, mobile, subject, message);
    }
  });

  function showSuccessState(name) {
    if (btnText) btnText.textContent = 'Message Sent!';
    if (btnSpinner) btnSpinner.style.display = 'none';
    if (btnIcon) {
      btnIcon.className = 'fa-solid fa-check';
      btnIcon.style.display = 'inline-block';
    }

    showToast(`Thank you, ${name}! Your message has been sent to syedfarhansaif@gmail.com.`, 'success');
    contactForm.reset();

    setTimeout(() => {
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) {
        btnIcon.className = 'fa-solid fa-paper-plane';
        btnIcon.style.display = 'inline-block';
      }
      if (submitBtn) submitBtn.disabled = false;
    }, 3500);
  }

  function triggerMailtoFallback(name, email, mobile, subject, message) {
    if (btnSpinner) btnSpinner.style.display = 'none';
    if (btnText) btnText.textContent = 'Opening Email...';

    const mailtoBody = encodeURIComponent(`From: ${name}\nEmail: ${email}\nPhone: ${mobile}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:syedfarhansaif@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;
    
    window.location.href = mailtoUrl;

    showToast(`Opening your email client to send message to syedfarhansaif@gmail.com`, 'info');
    contactForm.reset();

    setTimeout(() => {
      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) {
        btnIcon.className = 'fa-solid fa-paper-plane';
        btnIcon.style.display = 'inline-block';
      }
      if (submitBtn) submitBtn.disabled = false;
    }, 3500);
  }
}

/* ==========================================================================
   9. CV DOWNLOAD TRIGGER
   ========================================================================== */
function initDownloadCV() {
  const downloadBtn = document.getElementById('download-cv-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    showToast('Muhammad Farhan CV / Resume is ready for download.', 'info');
  });
}

/* ==========================================================================
   10. THREE.JS 3D BACKGROUND
   ========================================================================== */
function initThreeJSBackground() {
  const canvas = document.getElementById('bg-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System
  const particleCount = 800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyan = new THREE.Color(0x00eeff);
  const green = new THREE.Color(0x10b981);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1400;
    positions[i + 1] = (Math.random() - 0.5) * 1400;
    positions[i + 2] = (Math.random() - 0.5) * 1000;

    const chosenColor = Math.random() < 0.65 ? cyan : green;
    colors[i] = chosenColor.r;
    colors[i + 1] = chosenColor.g;
    colors[i + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.15;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0004;

    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   11. TOAST UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconHtml = '<i class="fa-solid fa-info-circle" style="color:var(--main-color);"></i>';
  if (type === 'success') {
    iconHtml = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i>';
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
