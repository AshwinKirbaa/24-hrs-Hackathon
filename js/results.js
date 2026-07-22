/**
 * TWINEVAL AI - RESULTS & FEEDBACK MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.results-page') || document.querySelector('.feedback-page')) {
    ResultsModule.init();
  }
});

const ResultsModule = {
  init() {
    this.renderResultDonut();
    this.initReportDownload();
    this.initFeedbackTabs();
  },

  renderResultDonut() {
    const container = document.getElementById('scoreDonutContainer');
    if (container) {
      TwinEvalApp.Charts.createDonutChart('scoreDonutContainer', 'Final AI Mark', 88, '#2563eb');
    }
  },

  initReportDownload() {
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
      TwinEvalApp.showToast('Generating PDF Report', 'Preparing your comprehensive AI evaluation report...', 'info');
      
      setTimeout(() => {
        // Create mock PDF download trigger
        const element = document.createElement('a');
        const file = new Blob([
          `TWINEVAL AI EVALUATION REPORT\n----------------------------\nStudent: Alex Morgan\nSubject: Data Structures & Algorithms\nScore: 88/100 (Grade: A+)\nAI Confidence: 98.4%\nBloom's Taxonomy: Analyzing Level\nEvaluated: July 22, 2026\nStatus: Approved by Teacher`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'TwinEval_AI_Report_AlexMorgan.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        TwinEvalApp.showToast('Report Downloaded', 'Evaluation report saved successfully.', 'success');
      }, 1200);
    });
  },

  initFeedbackTabs() {
    const tabBtns = document.querySelectorAll('.question-tab-btn');
    const tabPanes = document.querySelectorAll('.feedback-tab-pane');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetQ = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetQ);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }
};
