/**
 * TWINEVAL AI - PROFILE MODULE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.profile-page') || document.getElementById('profileForm')) {
    ProfileModule.init();
  }
});

const ProfileModule = {
  init() {
    this.populateForm();
    this.initFormSubmit();
    this.initPasswordChange();
  },

  populateForm() {
    const user = TwinEvalApp.getUser();
    if (!user) return;

    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const collegeInput = document.getElementById('profileCollege');
    const deptInput = document.getElementById('profileDept');
    const yearInput = document.getElementById('profileYear');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (collegeInput) collegeInput.value = user.college || '';
    if (deptInput) deptInput.value = user.department || '';
    if (yearInput) yearInput.value = user.year || '';
  },

  initFormSubmit() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        ...TwinEvalApp.getUser(),
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        college: document.getElementById('profileCollege').value,
        department: document.getElementById('profileDept').value,
        year: document.getElementById('profileYear').value
      };

      TwinEvalApp.setUser(updatedUser);
      TwinEvalApp.showToast('Profile Updated', 'Your profile details have been saved.', 'success');
    });
  },

  initPasswordChange() {
    const pwForm = document.getElementById('changePasswordForm');
    if (!pwForm) return;

    pwForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPw = document.getElementById('newPassword').value;
      const confirmPw = document.getElementById('confirmNewPassword').value;

      if (newPw !== confirmPw) {
        TwinEvalApp.showToast('Password Mismatch', 'New password and confirmation do not match.', 'danger');
        return;
      }

      pwForm.reset();
      TwinEvalApp.showToast('Password Updated', 'Your password has been changed securely.', 'success');
    });
  }
};
