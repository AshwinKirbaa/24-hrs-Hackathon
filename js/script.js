/**
 * TWINEVAL AI - CORE JAVASCRIPT ENGINE & GLOBAL UTILITIES
 * Series-A SaaS Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  TwinEvalApp.init();
});

const TwinEvalApp = {
  init() {
    this.initTheme();
    this.initSidebar();
    this.initRipples();
    this.initToastSystem();
    this.initParticles();
    this.initActiveLinks();
    this.loadState();
    this.initGlobalEvents();
  },

  /* ==========================================
     1. THEME ENGINE (LIGHT/DARK MODE)
     ========================================== */
  initTheme() {
    const savedTheme = localStorage.getItem('twineval_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('twineval_theme', newTheme);
        this.updateThemeIcon(newTheme);
        this.showToast('Theme Updated', `Switched to ${newTheme} mode`, 'info');
      });
    });
  },

  updateThemeIcon(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn i');
    toggleBtns.forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    });
  },

  /* ==========================================
     2. SIDEBAR NAV & MOBILE COLLAPSE
     ========================================== */
  initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  },

  initActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  /* ==========================================
     3. BUTTON RIPPLE EFFECT
     ========================================== */
  initRipples() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .glass-card-interactive, .nav-link');
      if (!target) return;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  },

  /* ==========================================
     4. TOAST NOTIFICATION ENGINE
     ========================================== */
  initToastSystem() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(title, message, type = 'primary') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const iconMap = {
      primary: 'fa-solid fa-circle-info',
      success: 'fa-solid fa-circle-check',
      danger: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-bolt'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="${iconMap[type] || iconMap.primary} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  /* ==========================================
     5. PARTICLE & AI BACKGROUND ENGINE
     ========================================== */
  initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1
    }));

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.22 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    render();
  },

  /* ==========================================
     6. STATE MANAGEMENT ENGINE
     ========================================== */
  loadState() {
    if (!localStorage.getItem('twineval_user')) {
      const defaultUser = {
        name: '{{student_name}}',
        email: '',
        role: 'Student',
        college: '',
        department: '',
        year: ''
      };
      localStorage.setItem('twineval_user', JSON.stringify(defaultUser));
    }

    if (!localStorage.getItem('twineval_submissions')) {
      localStorage.setItem('twineval_submissions', JSON.stringify([]));
    }
  },

  getUser() {
    return JSON.parse(localStorage.getItem('twineval_user'));
  },

  setUser(userData) {
    localStorage.setItem('twineval_user', JSON.stringify(userData));
    this.updateUserUI();
  },

  updateUserUI() {
    const user = this.getUser();
    if (!user) return;
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.name);
    document.querySelectorAll('.user-role-display').forEach(el => el.textContent = user.role);
    document.querySelectorAll('.user-email-display').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.user-dept-display').forEach(el => el.textContent = user.department);
  },

  initGlobalEvents() {
    this.updateUserUI();
    
    // Quick logout handler
    document.querySelectorAll('.logout-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('Logged Out', 'Redirecting to sign-in page...', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      });
    });
  },

  /* ==========================================
     7. PURE VANILLA SVG CHART GENERATOR ENGINE
     ========================================== */
  Charts: {
    createBarChart(containerId, labels, values, color = '#2563eb') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const maxVal = Math.max(...values, 100);
      const svgHeight = 220;
      const containerWidth = container.clientWidth || 400;
      const barWidth = Math.min(42, Math.floor((containerWidth - 60) / labels.length - 16));
      const spacing = (containerWidth - 40) / labels.length;

      let barsHtml = labels.map((label, idx) => {
        const val = values[idx];
        const barHeight = Math.max(10, (val / maxVal) * (svgHeight - 60));
        const x = 25 + idx * spacing + (spacing - barWidth) / 2;
        const y = svgHeight - 35 - barHeight;

        return `
          <g class="bar-group">
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${color}" opacity="0.85">
              <animate attributeName="height" from="0" to="${barHeight}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
              <animate attributeName="y" from="${svgHeight - 35}" to="${y}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
            </rect>
            <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-main)">${val}%</text>
            <text x="${x + barWidth / 2}" y="${svgHeight - 12}" text-anchor="middle" font-size="11" fill="var(--text-muted)">${label}</text>
          </g>
        `;
      }).join('');

      container.innerHTML = `
        <svg width="100%" height="${svgHeight}" style="overflow: visible;">
          <line x1="15" y1="${svgHeight - 35}" x2="100%" y2="${svgHeight - 35}" stroke="var(--border-subtle)" stroke-width="1.5"/>
          ${barsHtml}
        </svg>
      `;
    },

    createDonutChart(containerId, label, percentage, color = '#06b6d4') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const radius = 60;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;

      container.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 160px; height: 160px; margin: 0 auto;">
          <svg width="160" height="160" style="transform: rotate(-90deg);">
            <circle cx="80" cy="80" r="${radius}" stroke="var(--border-subtle)" stroke-width="12" fill="transparent"/>
            <circle cx="80" cy="80" r="${radius}" stroke="${color}" stroke-width="12" fill="transparent"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                    stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"/>
          </svg>
          <div style="position: absolute; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); line-height: 1;">${percentage}%</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-top: 2px;">${label}</div>
          </div>
        </div>
      `;
    },

    createLineChart(containerId, labels, values, color = '#2563eb') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const height = 220;
      const width = container.clientWidth || 400;
      const padding = 35;
      const maxVal = Math.max(...values, 100);
      const minVal = 50;

      const points = values.map((val, idx) => {
        const x = padding + (idx * (width - 2 * padding)) / (labels.length - 1);
        const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
        return { x, y, val, label: labels[idx] };
      });

      const pathD = points.reduce((acc, p, idx) => {
        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
      }, '');

      const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

      let dotsHtml = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="5" fill="${color}" stroke="var(--bg-card)" stroke-width="2"/>
        <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-main)">${p.val}%</text>
        <text x="${p.x}" y="${height - 12}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${p.label}</text>
      `).join('');

      container.innerHTML = `
        <svg width="100%" height="${height}" style="overflow: visible;">
          <defs>
            <linearGradient id="lineGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-subtle)" stroke-width="1.5"/>
          <path d="${areaD}" fill="url(#lineGrad-${containerId})"/>
          <path d="${pathD}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          ${dotsHtml}
        </svg>
      `;
    },

    createRadarChart(containerId, labels, values) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const size = 260;
      const center = size / 2;
      const radius = 85;
      const total = labels.length;

      let gridHtml = '';
      for (let r = 0.25; r <= 1; r += 0.25) {
        const points = [];
        for (let i = 0; i < total; i++) {
          const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
          const x = center + radius * r * Math.cos(angle);
          const y = center + radius * r * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        gridHtml += `<polygon points="${points.join(' ')}" fill="none" stroke="var(--border-subtle)" stroke-width="1"/>`;
      }

      const dataPoints = values.map((val, i) => {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const x = center + (radius * (val / 100)) * Math.cos(angle);
        const y = center + (radius * (val / 100)) * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');

      const labelsHtml = labels.map((lbl, i) => {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const lx = center + (radius + 22) * Math.cos(angle);
        const ly = center + (radius + 14) * Math.sin(angle);
        return `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-main)">${lbl}</text>`;
      }).join('');

      container.innerHTML = `
        <svg width="${size}" height="${size}" style="margin: 0 auto; display: block;">
          ${gridHtml}
          <polygon points="${dataPoints}" fill="rgba(37, 99, 235, 0.25)" stroke="#2563eb" stroke-width="2.5"/>
          ${labelsHtml}
        </svg>
      `;
    }
  }
};
