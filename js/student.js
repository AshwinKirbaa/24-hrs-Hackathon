/**
 * TWINEVAL AI - STUDENT MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('student-page') || document.querySelector('.student-dashboard')) {
    StudentModule.init();
  }
});

const StudentModule = {
  init() {
    this.renderDashboardCharts();
    this.initSearchFilter();
  },

  renderDashboardCharts() {
    // Render progress donut chart
    if (document.getElementById('overallProgressRing')) {
      TwinEvalApp.Charts.createDonutChart('overallProgressRing', 'Avg Performance', 88, '#06b6d4');
    }

    // Render bar chart for subjects
    if (document.getElementById('subjectPerformanceChart')) {
      const labels = ['DSA', 'OS', 'DBMS', 'CN', 'AI/ML'];
      const values = [88, 82, 91, 78, 95];
      TwinEvalApp.Charts.createBarChart('subjectPerformanceChart', labels, values, '#2563eb');
    }

    // Render analytics charts if on student analytics page
    if (document.getElementById('trendLineChart')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const scores = [72, 78, 81, 85, 84, 89, 92];
      TwinEvalApp.Charts.createLineChart('trendLineChart', months, scores, '#2563eb');
    }

    if (document.getElementById('bloomSkillRadar')) {
      const skills = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
      const levels = [95, 90, 85, 80, 88, 75];
      TwinEvalApp.Charts.createRadarChart('bloomSkillRadar', skills, levels);
    }
  },

  initSearchFilter() {
    const searchInput = document.getElementById('assignmentSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('.submission-table-row');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
};
