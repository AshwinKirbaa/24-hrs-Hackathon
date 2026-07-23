/**
 * TWINEVAL AI - SHARED FRONTEND ENGINE & UTILITIES
 * - SVG Chart Generator Engine (Bar, Donut, Line, Radar)
 * - Notification Toast System
 * - LocalStorage User State Management
 */

(function () {
  "use strict";

  window.TwinEvalApp = window.TwinEvalApp || {};

  // Alias TwinEval and TwinEvalApp to ensure complete interoperability
  window.TwinEval = window.TwinEval || {};
  Object.assign(window.TwinEval, window.TwinEvalApp);
  Object.assign(window.TwinEvalApp, window.TwinEval);

  // ---- Toast Notification System ----
  window.TwinEvalApp.showToast = function (title, message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'pointer-events:auto;min-width:280px;padding:12px 16px;border-radius:10px;background:#131b2e;color:#e8ecf5;border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 25px rgba(0,0,0,0.5);font-family:sans-serif;font-size:13px;animation:fadeUp 0.3s ease-out;';
    
    let accentColor = '#4a7ef3';
    if (type === 'success') accentColor = '#10b981';
    if (type === 'warning') accentColor = '#f59e0b';
    if (type === 'danger') accentColor = '#ef4444';

    toast.style.borderLeft = '4px solid ' + accentColor;
    toast.innerHTML = `
      <div style="font-weight:600;margin-bottom:2px;color:${accentColor}">${title}</div>
      <div style="color:#94a3b8;font-size:12px">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // ---- Pure Vanilla SVG Chart Generator Engine ----
  window.TwinEvalApp.Charts = {
    createBarChart(containerId, labels, values, color = '#4a7ef3') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const maxVal = Math.max(...values, 100);
      const svgHeight = 200;
      const containerWidth = container.clientWidth || 360;
      const barWidth = Math.min(36, Math.floor((containerWidth - 40) / labels.length - 12));
      const spacing = containerWidth / labels.length;

      let barsHtml = labels.map((label, idx) => {
        const val = values[idx];
        const barHeight = Math.max(10, (val / maxVal) * (svgHeight - 50));
        const x = idx * spacing + (spacing - barWidth) / 2;
        const y = svgHeight - 30 - barHeight;

        return `
          <g class="bar-group">
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${color}" opacity="0.9"/>
            <text x="${x + barWidth / 2}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="600" fill="#e8ecf5">${val}%</text>
            <text x="${x + barWidth / 2}" y="${svgHeight - 8}" text-anchor="middle" font-size="10" fill="#94a3b8">${label}</text>
          </g>
        `;
      }).join('');

      container.innerHTML = `
        <svg width="100%" height="${svgHeight}" style="overflow: visible;">
          <line x1="0" y1="${svgHeight - 25}" x2="100%" y2="${svgHeight - 25}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          ${barsHtml}
        </svg>
      `;
    },

    createDonutChart(containerId, label, percentage, color = '#22d3ee') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const radius = 55;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;

      container.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 140px; height: 140px; margin: 0 auto;">
          <svg width="140" height="140" style="transform: rotate(-90deg);">
            <circle cx="70" cy="70" r="${radius}" stroke="rgba(255,255,255,0.08)" stroke-width="10" fill="transparent"/>
            <circle cx="70" cy="70" r="${radius}" stroke="${color}" stroke-width="10" fill="transparent"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                    stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"/>
          </svg>
          <div style="position: absolute; text-align: center;">
            <div style="font-size: 1.4rem; font-weight: 700; color: #e8ecf5; line-height: 1;">${percentage}%</div>
            <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 500; margin-top: 2px;">${label}</div>
          </div>
        </div>
      `;
    },

    createLineChart(containerId, labels, values, color = '#4a7ef3') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const height = 200;
      const width = container.clientWidth || 360;
      const padding = 30;
      const maxVal = Math.max(...values, 100);
      const minVal = 40;

      const points = values.map((val, idx) => {
        const x = padding + (idx * (width - 2 * padding)) / Math.max(1, labels.length - 1);
        const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
        return { x, y, val, label: labels[idx] };
      });

      const pathD = points.reduce((acc, p, idx) => {
        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
      }, '');

      const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

      let dotsHtml = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}"/>
        <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="10" font-weight="600" fill="#e8ecf5">${p.val}%</text>
        <text x="${p.x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#94a3b8">${p.label}</text>
      `).join('');

      container.innerHTML = `
        <svg width="100%" height="${height}" style="overflow: visible;">
          <defs>
            <linearGradient id="lineGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <path d="${areaD}" fill="url(#lineGrad-${containerId})"/>
          <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
          ${dotsHtml}
        </svg>
      `;
    },

    createRadarChart(containerId, labels, values) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const size = 220;
      const center = size / 2;
      const radius = 70;
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
        gridHtml += `<polygon points="${points.join(' ')}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
      }

      const dataPoints = values.map((val, i) => {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const x = center + (radius * (val / 100)) * Math.cos(angle);
        const y = center + (radius * (val / 100)) * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');

      const labelsHtml = labels.map((lbl, i) => {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const lx = center + (radius + 18) * Math.cos(angle);
        const ly = center + (radius + 10) * Math.sin(angle);
        return `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" font-weight="600" fill="#94a3b8">${lbl}</text>`;
      }).join('');

      container.innerHTML = `
        <svg width="${size}" height="${size}" style="margin: 0 auto; display: block;">
          ${gridHtml}
          <polygon points="${dataPoints}" fill="rgba(74, 126, 243, 0.25)" stroke="#4a7ef3" stroke-width="2"/>
          ${labelsHtml}
        </svg>
      `;
    }
  };
})();
