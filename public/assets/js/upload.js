/**
 * TWINEVAL AI - UPLOAD ANSWER MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dz') || document.getElementById('uploadDropzone') || document.querySelector('.upload-page')) {
    UploadModule.init();
  }
});

const UploadModule = {
  selectedFile: null,

  init() {
    this.initDropzone();
    this.initFormTriggers();
  },

  initDropzone() {
    const dropzone = document.getElementById('dz') || document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('file') || document.getElementById('answerFileInput');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag');
      if (e.dataTransfer.files.length > 0) {
        this.handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });
  },

  handleFileSelect(file) {
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      TwinEvalApp.showToast('Invalid File Format', 'Please upload a valid PDF, PNG, or JPG document.', 'danger');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      TwinEvalApp.showToast('File Too Large', 'Maximum allowed file size is 25MB.', 'warning');
      return;
    }

    this.selectedFile = file;

    const nameDisplay = document.getElementById('fileName') || document.getElementById('selectedFileName');
    if (nameDisplay) {
      nameDisplay.textContent = `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    }

    TwinEvalApp.showToast('File Attached', `${file.name} is ready for evaluation.`, 'success');
  },

  initFormTriggers() {
    const startBtn = document.querySelector('a[href="processing.html"]') || document.getElementById('startEvaluationBtn');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        if (this.selectedFile) {
          localStorage.setItem('twineval_active_file', JSON.stringify({
            name: this.selectedFile.name,
            size: `${(this.selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
          }));
        }
        TwinEvalApp.showToast('Initializing AI Pipeline', 'Redirecting to AI processing engine…', 'info');
      });
    }
  }
};
