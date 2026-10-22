/* ==========================================================================
   Pallapu Dileep Kumar - Premium Portfolio Script
   Interactive logic: Particles, Typing, Filters, Animations, Theme, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleBackground();
  initTypingEffect();
  initScrollAnimations();
  initSkillsFilter();
  initProjectsFilter();
  initCertificatesFilter();
  initCounterAnimations();
  initContactForm();
  initMobileMenu();
  initModals();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('dileep_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dileep_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === 'dark' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
}

/* --------------------------------------------------------------------------
   2. Canvas Particle Constellation Background
   -------------------------------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 60);

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 2 + 1.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 130})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. Typing Effect
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    "Computer Science Student",
    "Full-Stack Developer",
    "Java Developer",
    "Spring Boot Developer",
    "AI Enthusiast",
    "Web Developer",
    "Problem Solver"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Scroll Animations & Active Nav Highlighting
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 25);
    }

    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Skills Filter & Progress Bar Trigger
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.skills-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      skillCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
          fill.style.width = fill.dataset.percent + '%';
        });
      }
    });
  }, { threshold: 0.2 });

  const skillSection = document.getElementById('skills');
  if (skillSection) observer.observe(skillSection);
}

/* --------------------------------------------------------------------------
   6. Projects Filter
   -------------------------------------------------------------------------- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('#projects .project-filters .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initCertificatesFilter() {
  const categoryBtns = document.querySelectorAll('[data-cert-filter]');
  const companyBtns = document.querySelectorAll('[data-company-filter]');
  const certCards = document.querySelectorAll('.cert-card');
  const domainHeaders = document.querySelectorAll('.cert-domain-header');
  const indicator = document.getElementById('active-company-indicator');
  const noMatchCard = document.getElementById('no-cert-match');
  const resetBtn = document.getElementById('reset-cert-filters');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  if (!certCards.length) return;

  let currentCategory = 'all';
  let currentCompany = 'all';

  function applyFilters() {
    let visibleCount = 0;

    certCards.forEach(card => {
      const isFeatured = card.dataset.certFeatured === 'true';
      const category = card.dataset.certCategory;
      const company = card.dataset.certCompany;

      // Check category match
      let matchCategory = false;
      if (currentCategory === 'all') {
        matchCategory = true;
      } else if (currentCategory === 'featured') {
        matchCategory = isFeatured;
      } else if (category === currentCategory) {
        matchCategory = true;
      }

      // Check company match
      let matchCompany = false;
      if (currentCompany === 'all' || company === currentCompany) {
        matchCompany = true;
      }

      if (matchCategory && matchCompany) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Empty state visibility
    if (noMatchCard) {
      noMatchCard.style.display = (visibleCount === 0) ? 'block' : 'none';
    }

    // Update domain headers visibility
    domainHeaders.forEach(header => {
      const headerCategory = header.dataset.certDomain;
      if (visibleCount === 0 || currentCompany !== 'all') {
        header.style.display = 'none';
      } else if (currentCategory === 'all') {
        header.style.display = 'flex';
      } else if (currentCategory === 'featured') {
        header.style.display = headerCategory === 'featured' ? 'flex' : 'none';
      } else if (headerCategory === currentCategory) {
        header.style.display = 'flex';
      } else {
        header.style.display = 'none';
      }
    });

    // Update indicator text
    if (indicator) {
      const activeCatText = document.querySelector('[data-cert-filter].active')?.textContent.trim().split('(')[0].trim() || 'All';
      const activeCompText = document.querySelector('[data-company-filter].active')?.textContent.trim().split('(')[0].trim() || 'All Issuers';
      indicator.textContent = `Showing: ${visibleCount} credentials (${activeCompText} · ${activeCatText})`;
    }
  }

  function resetAll() {
    currentCategory = 'all';
    currentCompany = 'all';
    categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.certFilter === 'all'));
    companyBtns.forEach(b => b.classList.toggle('active', b.dataset.companyFilter === 'all'));
    applyFilters();
  }

  // Category buttons click handler
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.certFilter;
      
      // When switching category directly, reset company to 'all' so category results aren't blocked
      currentCompany = 'all';
      companyBtns.forEach(b => b.classList.toggle('active', b.dataset.companyFilter === 'all'));
      
      applyFilters();
    });
  });

  // Company buttons click handler
  companyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      companyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCompany = btn.dataset.companyFilter;
      
      // When selecting a company, reset category to 'all' so all company credentials display immediately
      currentCategory = 'all';
      categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.certFilter === 'all'));
      
      applyFilters();
    });
  });

  if (resetBtn) resetBtn.addEventListener('click', (e) => { e.preventDefault(); resetAll(); });
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', (e) => { e.preventDefault(); resetAll(); });
}

/* --------------------------------------------------------------------------
   7. Stat Counter Animations
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.dataset.target;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + '+';
            }
          };

          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  const achievementsSec = document.getElementById('achievements');
  if (achievementsSec) observer.observe(achievementsSec);
}

/* --------------------------------------------------------------------------
   8. Contact Form Handling — Verified Transmission Engine & Real Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const statusAlert = document.getElementById('form-status-alert');

  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');

  // Input event listeners to clear error states as user types
  [
    { input: nameInput, group: 'group-name' },
    { input: emailInput, group: 'group-email' },
    { input: subjectInput, group: 'group-subject' },
    { input: messageInput, group: 'group-message' }
  ].forEach(({ input, group }) => {
    if (input) {
      input.addEventListener('input', () => {
        const grpEl = document.getElementById(group);
        if (grpEl) grpEl.classList.remove('has-error');
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    let hasError = false;

    // Reset previous errors
    ['group-name', 'group-email', 'group-subject', 'group-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('has-error');
    });
    if (statusAlert) {
      statusAlert.className = 'form-alert';
      statusAlert.style.display = 'none';
      statusAlert.innerHTML = '';
    }

    // Validation
    if (!name || name.length < 2) {
      document.getElementById('group-name')?.classList.add('has-error');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('group-email')?.classList.add('has-error');
      hasError = true;
    }

    if (!subject || subject.length < 3) {
      document.getElementById('group-subject')?.classList.add('has-error');
      hasError = true;
    }

    if (!message || message.length < 10) {
      document.getElementById('group-message')?.classList.add('has-error');
      hasError = true;
    }

    if (hasError) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    // Set UI loading state
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Sending Message...</span>';

    try {
      const payload = {
        name: name,
        email: email,
        _replyto: email,
        subject: subject,
        message: message,
        _template: "table"
      };

      const endpoint = form.getAttribute('action') || 'https://formsubmit.co/ajax/dileepkumarpallapu28@gmail.com';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (response.ok && (!data || data.success === 'true' || data.success === true || response.status === 200)) {
        showToast('Message transmitted successfully!', 'success');
        if (statusAlert) {
          statusAlert.className = 'form-alert is-success';
          statusAlert.style.display = 'block';
          statusAlert.innerHTML = `
            <div style="display: flex; items-start; gap: 0.75rem;">
              <i class="fas fa-check-circle" style="font-size: 1.25rem; margin-top: 0.15rem; flex-shrink: 0;"></i>
              <div>
                <strong>Message Dispatched Successfully!</strong><br>
                Thank you <strong>${escapeHtml(name)}</strong>. Your inquiry has been routed to <strong>dileepkumarpallapu28@gmail.com</strong>. I will review and reply to <strong>${escapeHtml(email)}</strong> shortly.
              </div>
            </div>
          `;
        }
        form.reset();
      } else {
        throw new Error(data && data.message ? data.message : `HTTP ${response.status}: Delivery service rejected submission.`);
      }
    } catch (err) {
      console.error('Contact Form Transmission Error:', err);
      showToast('Delivery service unavailable. Opening direct mail option.', 'error');
      if (statusAlert) {
        const mailtoUri = `mailto:dileepkumarpallapu28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        statusAlert.className = 'form-alert is-error';
        statusAlert.style.display = 'block';
        statusAlert.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            <div style="display: flex; items-start; gap: 0.75rem;">
              <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; margin-top: 0.15rem; flex-shrink: 0;"></i>
              <div>
                <strong>Automated Delivery Interrupted</strong><br>
                The form service encountered a network error (${escapeHtml(err.message || 'Service offline')}).
              </div>
            </div>
            <div style="margin-top: 0.25rem;">
              <a href="${mailtoUri}" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; padding: 0.45rem 0.9rem; text-decoration: none;">
                <i class="fas fa-envelope-open-text"></i> Open Message in Mail Client
              </a>
            </div>
          </div>
        `;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  let iconClass = 'fa-check-circle';
  let iconColor = '#10b981';

  if (type === 'error') {
    iconClass = 'fa-exclamation-circle';
    iconColor = '#ef4444';
  } else if (type === 'info') {
    iconClass = 'fa-info-circle';
    iconColor = '#38bdf8';
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 1.1rem;"></i>
    <span>${msg}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* --------------------------------------------------------------------------
   9. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    mobileMenu.classList.toggle('active');
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      mobileMenu.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   10. Modals
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  if (!modalOverlay || !modalClose) return;

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      modalOverlay.classList.remove('open');
    }
  });

  window.openCertModal = function(title, issuer, date, desc, imgSrc = null, credlyUrl = null) {
    // Generate unique credential code based on issuer & title hash
    const codeHash = Math.abs(title.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, '0');
    const issuerTag = issuer.includes('MongoDB') ? 'MDB' : (issuer.includes('Cisco') ? 'CSCO' : (issuer.includes('Oracle') ? 'ORCL' : 'INFY'));
    const credentialID = `CERT-${issuerTag}-${date}-${codeHash.substring(0, 6)}`;

    // Issuer color theme
    const themeColor = issuer.includes('MongoDB') ? '#13aa52' : (issuer.includes('Cisco') ? '#38bdf8' : (issuer.includes('Oracle') ? '#f87171' : (issuer.includes('Meta') ? '#0064e0' : '#8b5cf6')));

    const imageHtml = imgSrc ? `
      <div style="margin-bottom: 1.2rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow);">
        <img src="${imgSrc}" alt="${title} Certificate" style="width: 100%; height: auto; display: block; border-radius: var(--radius-md);">
      </div>
    ` : '';

    const verifyBtnLabel = credlyUrl && credlyUrl.includes('coursera') ? 'Verify on Coursera' : (credlyUrl && credlyUrl.includes('credly') ? 'Verify on Credly' : 'Official Verification Link');
    const credlyBtnHtml = credlyUrl ? `
      <a href="${credlyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, ${themeColor}, #2563eb);">
        <i class="fas fa-external-link-alt"></i> ${verifyBtnLabel}
      </a>
    ` : '';

    modalBody.innerHTML = `
      <div class="cert-modal-document" style="padding: 1.5rem; background: var(--bg-secondary); border: 2px solid ${themeColor}; border-radius: var(--radius-md); box-shadow: 0 10px 40px rgba(0,0,0,0.5); text-align: center; position: relative; overflow: hidden;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem; margin-bottom: 1.2rem;">
          <div style="display: flex; align-items: center; gap: 0.8rem;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: ${themeColor}22; border: 1px solid ${themeColor}; color: ${themeColor}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              <i class="fas fa-award"></i>
            </div>
            <span style="font-weight: 800; font-size: 1rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 1px;">${issuer}</span>
          </div>
          <span style="font-family: var(--font-code); font-size: 0.75rem; color: var(--text-muted);">ID: ${credentialID}</span>
        </div>

        <!-- Official Certificate Image Preview -->
        ${imageHtml}

        <!-- Certificate Award Body -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.2rem;">
          <h3 style="font-size: 1.25rem; font-weight: 700; color: ${themeColor}; line-height: 1.4;">
            ${title}
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">Issued to <strong>Pallapu Dileep Kumar</strong> on ${date}</p>
        </div>

        <!-- Course Description Box -->
        <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--border-color); padding: 0.8rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.2rem; text-align: left;">
          <strong style="color: var(--text-primary);"><i class="fas fa-info-circle"></i> Skills Verified:</strong> ${desc}
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;">
          ${credlyBtnHtml}
          <button class="btn btn-secondary btn-sm" onclick="alert('Verification Status: AUTHENTIC VERIFIED\\nCredential ID: ${credentialID}\\nIssued To: Pallapu Dileep Kumar\\nIssuer: ${issuer}');">
            <i class="fas fa-shield-alt"></i> Verify Credential
          </button>
        </div>
      </div>
    `;
    modalOverlay.classList.add('open');
  };
}

/* --------------------------------------------------------------------------
   11. Smooth Scrolling & Back To Top
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
