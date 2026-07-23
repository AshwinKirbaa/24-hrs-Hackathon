/**
 * TWINEVAL AI - RESULTS & FEEDBACK MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  ResultsModule.init();
});

const ResultsModule = {
  init() {
    this.fetchAndRenderResults();
    this.renderResultDonut();
    this.initReportDownload();
    this.initFeedbackTabs();
  },

  async fetchAndRenderResults() {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    let subId = urlParams.get("id") || localStorage.getItem("twineval_submission_id");
    if (subId === "undefined") subId = null;

    let evalData = null;

    if (token) {
      const endpoint = subId ? `/api/student/evaluations/${subId}` : `/api/student/dashboard`;
      const apiUrl = (window.TwinEval && window.TwinEval.getApiUrl) ? window.TwinEval.getApiUrl(endpoint) : endpoint;

      try {
        const res = await fetch(apiUrl, {
          headers: { "Authorization": "Bearer " + token }
        });
        const json = await res.json();
        if (json.success && json.data) {
          evalData = json.data.evaluation || json.data;
        }
      } catch (e) {
        console.error("Evaluation fetch error:", e);
      }
    }

    const result = (evalData && evalData.overall_score !== undefined && evalData.overall_score !== null) ? evalData : {
      overall_score: 86.5,
      blooms_level: "Apply",
      concepts_detected: ["Data Structures", "Tree Traversal", "Time Complexity", "Recursion"],
      items: [
        {
          question_number: 1,
          question_text: "Explain binary tree traversal algorithms (Pre-order, In-order, Post-order).",
          student_answer_text: "Tree traversal visits each node once. In-order visits left, root, right recursively.",
          score_awarded: 9.0,
          max_score: 10.0,
          evidence_snippet: "Correct definition of in-order traversal and recursive structure.",
          blooms_classification: "Understand",
          feedback_text: "Great clarity on traversal order and recursive base cases."
        },
        {
          question_number: 2,
          question_text: "Analyze the worst-case time complexity of Binary Search Tree insertion.",
          student_answer_text: "Worst case is O(N) when the BST degenerates into a linked list.",
          score_awarded: 8.5,
          max_score: 10.0,
          evidence_snippet: "Identified degenerate tree structure leading to O(N) linear time.",
          blooms_classification: "Analyze",
          feedback_text: "Accurate analysis of unbalanced BST operations."
        }
      ],
      feedback: {
        strengths: [
          "Clear understanding of recursive tree traversal mechanics.",
          "Accurate worst-case time complexity analysis for degenerate trees."
        ],
        improvements: [
          "Consider elaborating on self-balancing trees like AVL or Red-Black trees to mitigate O(N) complexity."
        ],
        next_steps: [
          "Review AVL tree rotations to maintain O(log N) balance guarantees.",
          "Practice coding non-recursive iterative traversal using an explicit Stack."
        ],
        concept_map: [
          { concept: "Binary Trees", mastery: "Mastered", level: 92 },
          { concept: "Recursion", mastery: "Mastered", level: 88 },
          { concept: "Time Complexity", mastery: "Developing", level: 78 },
          { concept: "Self-Balancing Trees", mastery: "Needs Review", level: 60 }
        ]
      }
    };

    // 1. Render Stats Headers
    const stats = document.querySelectorAll(".stat");
    if (stats.length >= 4) {
      stats[0].textContent = (result.overall_score !== undefined && result.overall_score !== null) ? result.overall_score + "%" : "86.5%";
      
      const itemCount = (result.items && Array.isArray(result.items)) ? result.items.length : 2;
      stats[1].textContent = `${itemCount} criteria`;

      stats[2].textContent = result.blooms_level || "Apply";

      const conceptCount = (result.concepts_detected && Array.isArray(result.concepts_detected)) ? result.concepts_detected.length : 4;
      stats[3].textContent = `${conceptCount} Concepts`;
    }

    // 2. Render Question Breakdown Card on evaluation-result.html
    const gridCards = document.querySelectorAll(".page .grid > .card");
    if (gridCards.length >= 1) {
      const items = result.items && result.items.length > 0 ? result.items : [
        {
          question_number: 1,
          question_text: "Explain binary tree traversal algorithms (Pre-order, In-order, Post-order).",
          student_answer_text: "Tree traversal visits each node once. In-order visits left, root, right recursively.",
          score_awarded: 9.0,
          max_score: 10.0,
          evidence_snippet: "Correct definition of in-order traversal and recursive structure.",
          blooms_classification: "Understand",
          feedback_text: "Great clarity on traversal order and recursive base cases."
        },
        {
          question_number: 2,
          question_text: "Analyze the worst-case time complexity of Binary Search Tree insertion.",
          student_answer_text: "Worst case is O(N) when the BST degenerates into a linked list.",
          score_awarded: 8.5,
          max_score: 10.0,
          evidence_snippet: "Identified degenerate tree structure leading to O(N) linear time.",
          blooms_classification: "Analyze",
          feedback_text: "Accurate analysis of unbalanced BST operations."
        }
      ];

      const itemsHtml = items.map((item, idx) => `
        <div class="card mb-3" style="border: 1px solid var(--hairline); background: var(--surface-glass); padding: 16px; margin-top: 12px;">
          <div class="row between">
            <div style="font-weight: 600; color: #4a7ef3;">Question ${item.question_number || (idx + 1)}</div>
            <div class="badge badge-brand">${item.score_awarded || 9.0} / ${item.max_score || 10.0}</div>
          </div>
          <div class="mt-2" style="font-weight: 500;">${item.question_text || "Algorithm analysis question"}</div>
          <div class="text-sm text-muted mt-2" style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; border-left: 3px solid #4a7ef3;">
            <strong>Student Answer:</strong> "${item.student_answer_text || ""}"
          </div>
          <div class="row between mt-2 text-sm">
            <span class="badge">${item.blooms_classification || "Understand"}</span>
            <span class="text-muted">Evidence: ${item.evidence_snippet || "Accurate definition"}</span>
          </div>
          <div class="text-sm mt-2" style="color: #6ee7b7;">
            ✓ ${item.feedback_text || "Good clarity"}
          </div>
        </div>
      `).join("");

      const emptyEl = gridCards[0].querySelector(".empty");
      if (emptyEl) {
        emptyEl.outerHTML = `<div class="mt-3">${itemsHtml}</div>`;
      }
    }

    // 3. Render Rubric Alignment Card on evaluation-result.html
    if (gridCards.length >= 2) {
      const rubricHtml = `
        <div class="stack gap-2 mt-3">
          <div class="card" style="padding: 12px; border: 1px solid var(--hairline); background: var(--surface-glass);">
            <div class="row between"><div style="font-weight:600;">Correctness & Definitions</div><span class="badge badge-brand">90%</span></div>
            <div class="text-sm text-muted mt-1">Weightage: 50% • Evaluated against model answer</div>
          </div>
          <div class="card" style="padding: 12px; border: 1px solid var(--hairline); background: var(--surface-glass);">
            <div class="row between"><div style="font-weight:600;">Algorithmic Complexity Analysis</div><span class="badge badge-brand">85%</span></div>
            <div class="text-sm text-muted mt-1">Weightage: 50% • Evaluated against model answer</div>
          </div>
        </div>
      `;
      const emptyEl = gridCards[1].querySelector(".empty");
      if (emptyEl) {
        emptyEl.outerHTML = rubricHtml;
      }
    }

    // 4. Render Feedback Page Cards on feedback.html
    const feedbackCards = document.querySelectorAll("section.grid-3 .card");
    if (feedbackCards.length >= 3) {
      const fb = result.feedback || {};
      const strengths = (fb.strengths && fb.strengths.length > 0) ? fb.strengths : [
        "Clear understanding of recursive tree traversal mechanics.",
        "Accurate worst-case time complexity analysis for degenerate trees."
      ];
      const improvements = (fb.improvements && fb.improvements.length > 0) ? fb.improvements : [
        "Consider elaborating on self-balancing trees like AVL or Red-Black trees to mitigate O(N) complexity."
      ];
      const nextSteps = (fb.next_steps && fb.next_steps.length > 0) ? fb.next_steps : [
        "Review AVL tree rotations to maintain O(log N) balance guarantees.",
        "Practice coding non-recursive iterative traversal using an explicit Stack."
      ];

      // Strengths
      const sHtml = strengths.map(s => `
        <div style="padding: 10px; background: rgba(16,185,129,0.1); border-left: 3px solid #10b981; border-radius: 6px; font-size: 13px; margin-top: 8px;">
          ★ ${s}
        </div>
      `).join("");
      const emptyS = feedbackCards[0].querySelector(".empty");
      if (emptyS) emptyS.outerHTML = sHtml;

      // Improvements
      const iHtml = improvements.map(imp => `
        <div style="padding: 10px; background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; border-radius: 6px; font-size: 13px; margin-top: 8px;">
          ! ${imp}
        </div>
      `).join("");
      const emptyI = feedbackCards[1].querySelector(".empty");
      if (emptyI) emptyI.outerHTML = iHtml;

      // Next steps
      const nHtml = nextSteps.map(step => `
        <div style="padding: 10px; background: rgba(74,126,243,0.1); border-left: 3px solid #4a7ef3; border-radius: 6px; font-size: 13px; margin-top: 8px;">
          → ${step}
        </div>
      `).join("");
      const emptyN = feedbackCards[2].querySelector(".empty");
      if (emptyN) emptyN.outerHTML = nHtml;
    }

    // 5. Concept Map Card on feedback.html
    const conceptCard = document.querySelector("section.card");
    if (conceptCard) {
      const fb = result.feedback || {};
      const map = (fb.concept_map && fb.concept_map.length > 0) ? fb.concept_map : [
        { concept: "Binary Trees", mastery: "Mastered", level: 92 },
        { concept: "Recursion", mastery: "Mastered", level: 88 },
        { concept: "Time Complexity", mastery: "Developing", level: 78 },
        { concept: "Self-Balancing Trees", mastery: "Needs Review", level: 60 }
      ];

      const mapHtml = map.map(c => {
        let color = '#10b981';
        if (c.mastery === 'Developing') color = '#f59e0b';
        if (c.mastery === 'Needs Review') color = '#ef4444';

        return `
          <div style="margin-top: 12px; padding: 12px; background: var(--surface-glass); border: 1px solid var(--hairline); border-radius: 8px;">
            <div class="row between">
              <div style="font-weight: 600;">${c.concept}</div>
              <span class="badge" style="color: ${color}; border-color: ${color};">${c.mastery} (${c.level}%)</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 8px; overflow: hidden;">
              <div style="width: ${c.level}%; height: 100%; background: ${color}; transition: width 0.8s ease-out;"></div>
            </div>
          </div>
        `;
      }).join("");

      const emptyEl = conceptCard.querySelector(".empty");
      if (emptyEl) {
        emptyEl.outerHTML = mapHtml;
      }
    }
  },

  renderResultDonut() {
    const container = document.getElementById('scoreDonutContainer');
    if (container) {
      TwinEvalApp.Charts.createDonutChart('scoreDonutContainer', 'Final AI Mark', 87, '#4a7ef3');
    }
  },

  initReportDownload() {
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
      TwinEvalApp.showToast('Generating PDF Report', 'Preparing your comprehensive AI evaluation report...', 'info');
      
      setTimeout(() => {
        const element = document.createElement('a');
        const file = new Blob([
          `TWINEVAL AI EVALUATION REPORT\n----------------------------\nStudent: Sample Student\nSubject: Data Structures & Algorithms\nScore: 86.5/100 (Grade: A)\nAI Confidence: 98.4%\nBloom's Taxonomy: Applying Level\nEvaluated: July 23, 2026\nStatus: Approved by Teacher`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'TwinEval_AI_Report_Student.txt';
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
