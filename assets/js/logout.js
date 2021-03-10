import { showAlert } from './alerts';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/user/logout',
    });
    if (res.data.status === 'success') {
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Please Try Again');
  }
};
