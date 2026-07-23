/**
 * TWINEVAL AI - TEACHER MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('teacher-page') || document.querySelector('.teacher-dashboard') || document.querySelector('.theme-teacher')) {
    TeacherModule.init();
  }
});

const TeacherModule = {
  init() {
    this.populateUserInfo();
    this.fetchDashboardData();
    this.initOverrideControls();
    this.initApprovalActions();
    this.renderTeacherCharts();
    this.initRubricMatrixBuilder();
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

    const apiUrl = (window.TwinEval && window.TwinEval.getApiUrl) ? window.TwinEval.getApiUrl("/api/teacher/dashboard") : "/api/teacher/dashboard";

    try {
      const res = await fetch(apiUrl, {
        headers: { "Authorization": "Bearer " + token }
      });
      const json = await res.json();

      if (json.success && json.data) {
        const stats = json.data.stats || {};
        const statCards = document.querySelectorAll(".stat");
        if (statCards.length >= 4) {
          if (stats.activeAssignments !== undefined) statCards[0].textContent = stats.activeAssignments;
          if (stats.pendingReviews !== undefined) statCards[1].textContent = stats.pendingReviews;
          if (stats.classAverage !== undefined) statCards[2].textContent = stats.classAverage + "%";
          if (stats.aiAgreement !== undefined) statCards[3].textContent = stats.aiAgreement + "%";
        }
      }
    } catch (e) {
      // Graceful fallback to static dashboard presentation
    }
  },

  initOverrideControls() {
    const slider = document.getElementById('teacherScoreSlider');
    const display = document.getElementById('teacherScoreDisplay');
    const finalScoreDisplay = document.getElementById('finalCalculatedScore');

    if (slider && display) {
      slider.addEventListener('input', (e) => {
        const val = e.target.value;
        display.textContent = `${val} / 100`;
        if (finalScoreDisplay) {
          finalScoreDisplay.textContent = `${val}%`;
        }
      });
    }
  },

  initApprovalActions() {
    const approveBtn = document.getElementById('approveSubmissionBtn');
    const rejectBtn = document.getElementById('rejectSubmissionBtn');

    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        TwinEvalApp.showToast('Submission Approved', 'Teacher evaluation finalized and sent to student dashboard.', 'success');
        setTimeout(() => {
          window.location.href = 'teacher-dashboard.html';
        }, 1200);
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        TwinEvalApp.showToast('Re-evaluation Requested', 'Answer sheet flagged for secondary AI re-assessment.', 'warning');
        setTimeout(() => {
          window.location.href = 'teacher-dashboard.html';
        }, 1200);
      });
    }
  },

  renderTeacherCharts() {
    if (document.getElementById('classPerformanceChart')) {
      const labels = ['Section A', 'Section B', 'Section C', 'Section D'];
      const scores = [84, 89, 76, 92];
      TwinEvalApp.Charts.createBarChart('classPerformanceChart', labels, scores, '#4a7ef3');
    }

    if (document.getElementById('gradeDistributionChart')) {
      const labels = ['Grade O', 'Grade A+', 'Grade A', 'Grade B', 'Grade C'];
      const counts = [18, 42, 28, 10, 2];
      TwinEvalApp.Charts.createBarChart('gradeDistributionChart', labels, counts, '#22d3ee');
    }

    if (document.getElementById('classBloomRadar')) {
      const skills = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
      const scores = [92, 88, 81, 74, 85, 70];
      TwinEvalApp.Charts.createRadarChart('classBloomRadar', skills, scores);
    }
  },

  initRubricMatrixBuilder() {
    const addCriterionBtn = document.getElementById('addCriterionBtn');
    const rubricContainer = document.getElementById('rubricCriteriaContainer');

    if (!addCriterionBtn || !rubricContainer) return;

    let criterionCount = 2;

    addCriterionBtn.addEventListener('click', () => {
      criterionCount++;
      const item = document.createElement('div');
      item.className = 'glass-card padding-md margin-bottom-sm animate-fade-in';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="font-weight: 600; color: #4a7ef3;">Criterion ${criterionCount}</div>
          <button class="btn btn-sm btn-ghost remove-criterion-btn" style="color: #ef4444;">Remove</button>
        </div>
        <div class="form-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
          <input type="text" class="input" placeholder="e.g. Code Efficiency & Complexity" required>
          <input type="number" class="input" placeholder="Marks (e.g. 10)" max="50" required>
        </div>
      `;

      rubricContainer.appendChild(item);

      item.querySelector('.remove-criterion-btn').addEventListener('click', () => {
        item.remove();
        TwinEvalApp.showToast('Criterion Removed', 'Rubric matrix updated.', 'info');
      });

      TwinEvalApp.showToast('Criterion Added', 'New grading standard appended to rubric matrix.', 'success');
    });
  }
};
