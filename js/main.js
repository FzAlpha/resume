/**
 * HRITABRATA BARDHAN (FzAlpha) - ANIMATED PORTFOLIO JAVASCRIPT ENGINE
 * Handles ambient canvas particles, typewriter effect, scroll reveal, 
 * interactive terminal, 3D card tilt, stats counter, and contact forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DYNAMIC TYPEWRITER EFFECT
  // =========================================================================
  const typedTextSpan = document.getElementById('typed-text');
  const titles = [
    'Software Developer',
    'C++ & Linux Systems Dev',
    'DSA & Low-Level Specialist',
    'Arch Linux & Hyprland Builder',
    'Multi-Agent AI & Web Dev'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeWriter() {
    if (!typedTextSpan) return;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextSpan.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      // Pause at end of word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
  }
  typeWriter();

  // =========================================================================
  // 2. AMBIENT PARTICLES CANVAS
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.6 ? 'rgba(255, 107, 82, 0.4)' : 'rgba(56, 189, 248, 0.25)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connection lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 107, 82, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // =========================================================================
  // 3. MOUSE SPOTLIGHT & 3D PHOTO PARALLAX
  // =========================================================================
  const spotlight = document.getElementById('cursor-spotlight');
  const photoStage = document.getElementById('photo-stage');

  window.addEventListener('mousemove', (e) => {
    if (spotlight) {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    }

    // 3D Parallax tilt on hero portrait stage
    if (photoStage && window.innerWidth > 992) {
      const rect = photoStage.getBoundingClientRect();
      const stageCenterX = rect.left + rect.width / 2;
      const stageCenterY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - stageCenterX) / 25;
      const deltaY = (e.clientY - stageCenterY) / 25;

      photoStage.style.transform = `rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
    }
  });

  if (photoStage) {
    photoStage.addEventListener('mouseleave', () => {
      photoStage.style.transform = 'rotateY(0deg) rotateX(0deg)';
      photoStage.style.transition = 'transform 0.5s ease';
    });
    photoStage.addEventListener('mouseenter', () => {
      photoStage.style.transition = 'transform 0.1s ease-out';
    });
  }

  // =========================================================================
  // 4. NAVBAR SCROLL & ACTIVE LINK DETECTION (SCROLLSPY)
  // =========================================================================
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header background blur
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scrollspy active section
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. MOBILE DRAWER NAVIGATION
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-contact-link');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  // =========================================================================
  // 6. SCROLL REVEAL & STATS COUNTER
  // =========================================================================
  const revealElements = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Animated Numbers Counter
  const statsValues = document.querySelectorAll('.stat-value');
  let countersAnimated = false;

  const statsSection = document.getElementById('stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statsValues.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 1800; // ms
            const stepTime = Math.max(Math.floor(duration / target), 12);

            const timer = setInterval(() => {
              current += Math.ceil(target / (duration / stepTime));
              if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
              } else {
                stat.textContent = current;
              }
            }, stepTime);
          });
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 7. PROJECT CATEGORY FILTERING
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // =========================================================================
  // 8. METRICS & INTERACTIVE CLI TAB CONTROLLER
  // =========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = document.getElementById(`tab-${btn.getAttribute('data-tab')}`);
      if (targetTab) {
        targetTab.classList.add('active');
        if (btn.getAttribute('data-tab') === 'cli-terminal') {
          const termInput = document.getElementById('terminal-input');
          if (termInput) termInput.focus();
        }
      }
    });
  });

  // =========================================================================
  // 9. INTERACTIVE DEVELOPER CLI TERMINAL
  // =========================================================================
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalScreen = document.getElementById('terminal-screen');

  if (terminalInput && terminalHistory) {
    const commands = {
      help: () => `
<span class="cmd-run">Available Commands:</span>
  <span class="term-highlight">about</span>       - Print bio and developer summary
  <span class="term-highlight">skills</span>      - List technical arsenal and stack
  <span class="term-highlight">projects</span>    - Display featured repositories & links
  <span class="term-highlight">specs</span>       - View workstation & OS architecture (Neofetch)
  <span class="term-highlight">contact</span>     - View direct email & social handles
  <span class="term-highlight">github</span>      - Open GitHub profile in new tab
  <span class="term-highlight">clear</span>       - Clear the terminal screen
  <span class="term-highlight">matrix</span>      - Trigger digital rain simulator
`,
      about: () => `
<span class="code-output info">Hritabrata Bardhan (FzAlpha)</span>
Computer Science Engineering Student focusing on:
• Low-level systems programming in C++ / POSIX
• Operating System Internals & Linux Shells
• Algorithms & Data Structures (150+ solved)
• Multi-Agent AI Orchestration & Full-Stack Automation
`,
      skills: () => `
<span class="code-output success">Core Languages:</span> C++, C, Python, Java, Bash, Lua, JavaScript, HTML5/CSS3
<span class="code-output success">Environment:</span>    Arch Linux, EndeavourOS, Hyprland, Docker, Git, Neovim, CMake
<span class="code-output success">Specialties:</span>    Process Management, State Engines, High-Performance Systems
`,
      projects: () => `
<span class="cmd-run">Featured Projects:</span>
1. <a href="https://github.com/FzAlpha/log-Manager" target="_blank" class="term-highlight">log-Manager</a> - C++ telemetry & DSA milestone state tracker
2. <a href="https://github.com/FzAlpha/custom-linux-shell" target="_blank" class="term-highlight">custom-linux-shell</a> - Custom Linux terminal with process piping & syscalls
3. <a href="https://github.com/FzAlpha/algo-vault" target="_blank" class="term-highlight">algo-vault</a> - 150+ optimal DSA algorithms & benchmarks
4. <a href="https://github.com/FzAlpha" target="_blank" class="term-highlight">Multi-Agent AI Swarm</a> - Autonomous agent workflows
`,
      specs: () => `
<span class="cmd-prompt">fzalpha@archlinux</span>
-----------------
<span class="term-highlight">OS:</span> Arch Linux x86_64
<span class="term-highlight">Kernel:</span> 6.10.3-arch1-1
<span class="term-highlight">WM:</span> Hyprland (Wayland compositor)
<span class="term-highlight">Terminal:</span> Kitty / Foot
<span class="term-highlight">Editor:</span> Neovim (Lua configs)
<span class="term-highlight">Shell:</span> custom-linux-shell / zsh
<span class="term-highlight">CPU:</span> Multi-Core High-Throughput Processor
<span class="term-highlight">Memory:</span> 16GB High-Speed DDR4
`,
      contact: () => `
<span class="code-output success">Reach Out:</span>
• Email: <a href="mailto:hritabratabardhan13579@gmail.com" class="term-highlight">hritabratabardhan13579@gmail.com</a>
• LinkedIn: <a href="https://www.linkedin.com/in/hritabrata-bardhan-12b498365/" target="_blank" class="term-highlight">Hritabrata Bardhan</a>
• GitHub: <a href="https://github.com/FzAlpha" target="_blank" class="term-highlight">github.com/FzAlpha</a>
• Discord: <span class="term-highlight">fz_alpha_1</span>
`,
      github: () => {
        window.open('https://github.com/FzAlpha', '_blank');
        return '<span class="code-output success">Opened https://github.com/FzAlpha in a new tab.</span>';
      },
      clear: () => {
        terminalHistory.innerHTML = '';
        return null;
      },
      matrix: () => `
<span class="code-output success">
01001000 01110010 01101001 01110100 01100001 01100010 01110010 01100001 01110100 01100001
01010011 01111001 01110011 01110100 01100101 01101101 01110011 00100000 01000011 00101011
Wake up, Neo... The Matrix has you. Follow the white rabbit.
</span>
`
    };

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        const cmd = rawCmd.toLowerCase();
        terminalInput.value = '';

        if (!rawCmd) return;

        const cmdRow = document.createElement('div');
        cmdRow.className = 'term-output-block';

        let outputContent = '';
        if (commands[cmd]) {
          const result = commands[cmd]();
          if (result === null) return; // For clear
          outputContent = result;
        } else {
          outputContent = `<span class="code-output warning">Command not found: '${rawCmd}'. Type <span class="term-highlight">help</span> for a list of valid commands.</span>`;
        }

        cmdRow.innerHTML = `
          <div><span class="term-prompt">fzalpha@portfolio:~$</span> <span class="term-cmd-echo">${escapeHtml(rawCmd)}</span></div>
          <div>${outputContent}</div>
        `;

        terminalHistory.appendChild(cmdRow);
        if (terminalScreen) {
          terminalScreen.scrollTop = terminalScreen.scrollHeight;
        }
      }
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 10. ONE-CLICK COPY CLIPS
  // =========================================================================
  const copyButtons = document.querySelectorAll('.copy-chip-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const tooltip = btn.querySelector('.tooltip');
          if (tooltip) {
            const orig = tooltip.textContent;
            tooltip.textContent = 'Copied!';
            setTimeout(() => {
              tooltip.textContent = orig;
            }, 2000);
          }
          showToast(`Copied "${textToCopy}" to clipboard!`, 'info');
        });
      }
    });
  });

  // =========================================================================
  // 11. TOAST NOTIFICATION ENGINE
  // =========================================================================
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // 12. CONTACT FORM VALIDATION & SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-form-btn');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
      }

      if (isValid) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const senderName = nameInput.value.trim();
        const senderEmail = emailInput.value.trim();
        const senderMsg = messageInput.value.trim();

        // Simulate delivery and dispatch mailto link
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          showToast(`Thanks ${senderName}! Your message was prepared.`, 'success');

          // Open mail client
          const mailtoUrl = `mailto:hritabratabardhan13579@gmail.com?subject=Project Inquiry from ${encodeURIComponent(
            senderName
          )}&body=${encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${senderMsg}`)}`;
          window.location.href = mailtoUrl;

          contactForm.reset();
        }, 1000);
      }
    });

    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          if (input.value.trim()) {
            input.classList.remove('invalid');
          }
        });
      }
    });
  }

  // =========================================================================
  // 13. RESUME PREVIEW MODAL
  // =========================================================================
  const resumeModal = document.getElementById('resume-modal-backdrop');
  const openResumeBtns = [
    document.getElementById('open-resume-btn'),
    document.getElementById('hero-resume-btn'),
    document.getElementById('drawer-resume-btn')
  ];
  const closeResumeBtn = document.getElementById('modal-close-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResume() {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openResumeBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', openResume);
  });

  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResume();
      closeDrawer();
    }
  });
});
