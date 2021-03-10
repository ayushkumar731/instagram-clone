import { showAlert } from './alerts';

export const reset = async (password, confirmPassword, url) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        password,
        confirmPassword,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
      showAlert('success', 'Password changed successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
