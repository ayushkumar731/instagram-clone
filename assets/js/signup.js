import { showAlert } from './alerts';

export const signup = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/create',
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/email-verification');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
