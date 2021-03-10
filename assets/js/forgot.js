import { showAlert } from './alerts';

export const forgot = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/forgot-password',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Check Your Mail');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
