/**
 * TWINEVAL AI - TEACHER MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('teacher-page') || document.querySelector('.teacher-dashboard') || document.querySelector('.review-workspace')) {
    TeacherModule.init();
  }
});

const TeacherModule = {
  init() {
    this.initOverrideControls();
    this.initApprovalActions();
    this.renderTeacherCharts();
    this.initRubricMatrixBuilder();
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
      TwinEvalApp.Charts.createBarChart('classPerformanceChart', labels, scores, '#2563eb');
    }

    if (document.getElementById('gradeDistributionChart')) {
      const labels = ['Grade O', 'Grade A+', 'Grade A', 'Grade B', 'Grade C'];
      const counts = [18, 42, 28, 10, 2];
      TwinEvalApp.Charts.createBarChart('gradeDistributionChart', labels, counts, '#06b6d4');
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
          <div style="font-weight: 600; color: var(--primary);">Criterion ${criterionCount}</div>
          <button class="btn btn-sm btn-ghost remove-criterion-btn" style="color: var(--danger);"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="form-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
          <input type="text" class="form-input" placeholder="e.g. Code Efficiency & Complexity" required>
          <input type="number" class="form-input" placeholder="Marks (e.g. 10)" max="50" required>
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
