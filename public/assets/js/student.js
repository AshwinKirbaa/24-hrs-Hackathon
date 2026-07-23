/**
 * TWINEVAL AI - STUDENT MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('student-page') || document.querySelector('.student-dashboard') || document.getElementById('shell')) {
    StudentModule.init();
  }
});

const StudentModule = {
  init() {
    this.populateUserInfo();
    this.fetchDashboardData();
    this.renderDashboardCharts();
    this.initSearchFilter();
  },

  populateUserInfo() {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        const name = user.full_name || user.name;
        if (name) {
          const welcomeHeading = document.querySelector('.page-header .h1') || document.getElementById('welcomeHeading');
          if (welcomeHeading) {
            welcomeHeading.textContent = `Welcome back, ${name}`;
          }
        }
      }
    } catch (e) {}
  },

  async fetchDashboardData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = (window.TwinEval && window.TwinEval.getApiUrl) ? window.TwinEval.getApiUrl("/api/student/dashboard") : "/api/student/dashboard";

    try {
      const res = await fetch(apiUrl, {
        headers: { "Authorization": "Bearer " + token }
      });
      const json = await res.json();

      if (json.success && json.data) {
        const stats = json.data.stats || {};
        const statCards = document.querySelectorAll(".stat");
        if (statCards.length >= 4) {
          if (stats.completed_evaluations !== undefined) statCards[0].textContent = stats.completed_evaluations;
          if (stats.average_score !== undefined) statCards[1].textContent = stats.average_score + "%";
          if (stats.concepts_mastered !== undefined) statCards[2].textContent = stats.concepts_mastered;
          if (stats.bloom_coverage !== undefined) statCards[3].textContent = stats.bloom_coverage;
        }
      }
    } catch (e) {
      // Graceful fallback to static dashboard presentation
    }
  },

  renderDashboardCharts() {
    if (document.getElementById('overallProgressRing')) {
      TwinEvalApp.Charts.createDonutChart('overallProgressRing', 'Avg Performance', 88, '#06b6d4');
    }

    if (document.getElementById('subjectPerformanceChart')) {
      const labels = ['DSA', 'OS', 'DBMS', 'CN', 'AI/ML'];
      const values = [88, 82, 91, 78, 95];
      TwinEvalApp.Charts.createBarChart('subjectPerformanceChart', labels, values, '#4a7ef3');
    }

    if (document.getElementById('trendLineChart')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const scores = [72, 78, 81, 85, 84, 89, 92];
      TwinEvalApp.Charts.createLineChart('trendLineChart', months, scores, '#4a7ef3');
    }

    if (document.getElementById('bloomSkillRadar')) {
      const skills = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
      const levels = [95, 90, 85, 80, 88, 75];
      TwinEvalApp.Charts.createRadarChart('bloomSkillRadar', skills, levels);
    }
  },

  initSearchFilter() {
    const searchInput = document.getElementById('assignmentSearchInput') || document.querySelector('.search input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.submission-table-row, .card');
      rows.forEach(row => {
        if (row.classList.contains('page-header') || row.classList.contains('topbar')) return;
        const text = row.textContent.toLowerCase();
        if (query.trim() !== '' && row.querySelector('.h3, h3, .stat')) {
          row.style.opacity = text.includes(query) ? '1' : '0.4';
        } else {
          row.style.opacity = '1';
        }
      });
    });
  }
};
