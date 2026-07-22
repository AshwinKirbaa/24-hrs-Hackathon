/**
 * TWINEVAL AI - UPLOAD ANSWER MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('uploadDropzone') || document.querySelector('.upload-page')) {
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
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('answerFileInput');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
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
    // Validate file type & size
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

    // Display selected file card
    const card = document.getElementById('selectedFileCard');
    const fileName = document.getElementById('selectedFileName');
    const fileSize = document.getElementById('selectedFileSize');
    const startBtn = document.getElementById('startEvaluationBtn');

    if (card && fileName && fileSize) {
      fileName.textContent = file.name;
      fileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document`;
      card.style.display = 'flex';
      card.classList.add('animate-fade-in');
    }

    if (startBtn) {
      startBtn.disabled = false;
      startBtn.classList.remove('btn-disabled');
    }

    TwinEvalApp.showToast('File Uploaded', `${file.name} is ready for AI evaluation.`, 'success');
  },

  initFormTriggers() {
    const startBtn = document.getElementById('startEvaluationBtn');
    const removeBtn = document.getElementById('removeFileBtn');

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedFile = null;
        const card = document.getElementById('selectedFileCard');
        if (card) card.style.display = 'none';
        if (startBtn) {
          startBtn.disabled = true;
          startBtn.classList.add('btn-disabled');
        }
        const fileInput = document.getElementById('answerFileInput');
        if (fileInput) fileInput.value = '';
        TwinEvalApp.showToast('File Removed', 'Please select another answer sheet.', 'info');
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const fileName = this.selectedFile ? this.selectedFile.name : 'answer_sheet_document.pdf';
        sessionStorage.setItem('uploaded_file_name', fileName);
        
        if (this.selectedFile) {
          localStorage.setItem('twineval_active_file', JSON.stringify({
            name: this.selectedFile.name,
            size: `${(this.selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
          }));
        } else {
          const demoFile = { name: 'answer_sheet_document.pdf', size: '1.2 MB' };
          localStorage.setItem('twineval_active_file', JSON.stringify(demoFile));
        }

        TwinEvalApp.showToast('Initializing AI Pipeline', 'Redirecting to AI processing engine...', 'primary');
        setTimeout(() => {
          window.location.href = 'processing.html';
        }, 800);
      });
    }
  }
};
