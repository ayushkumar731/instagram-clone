import { forgot } from './forgot';
import { login } from './login';
import { logout } from './logout';
import { reset } from './reset';
import { search } from './search';
import { signup } from './signup';
import { userData, passwordChange } from './usersettings';
import { showAlert } from './alerts';

const forgotForm = document.getElementById('form-forgot');
const logInForm = document.getElementById('form-login');
const logOutBtn = document.getElementById('logout');
const resetFrom = document.getElementById('form-reset');
export const searchBtn = document.getElementById('search-user');
const signUpForm = document.getElementById('form-signup');
const userDataForm = document.getElementById('form-user-data');
const userPasswordForm = document.getElementById('form-current-user-password');

if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('forgot').textContent = 'Processing...';
    const email = document.getElementById('email').value;
    await forgot(email);
    document.getElementById('forgot').textContent = 'Send Login Link';
    document.getElementById('email').value = '';
  });
}

if (logInForm) {
  logInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('log-in').textContent = 'Processing...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    document.getElementById('log-in').textContent = 'Log In';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (resetFrom) {
  resetFrom.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('reset').textContent = 'Processing...';
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const url = window.location.href;
    await reset(password, confirmPassword, url);
    document.getElementById('reset').textContent = 'Reset Password';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
  });
}

if (searchBtn) searchBtn.addEventListener('keyup', search);

if (signUpForm) {
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('sign-up').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    await signup(name, email, password, confirmPassword);
    document.getElementById('sign-up').textContent = 'Sign up';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('btn-save-user').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await userData(form);
    document.getElementById('btn-save-user').textContent = 'SAVE SETTINGS';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('btn-save-user-password').textContent =
      'Updating...';

    const currentPassword = document.getElementById('currentPassword').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    await passwordChange(currentPassword, password, confirmPassword);

    document.getElementById('currentPassword').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('btn-save-user-password').textContent =
      'SAVE PASSWORD';
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
