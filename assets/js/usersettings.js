import { showAlert } from './alerts';

export const userData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/profile/me',
      data,
    });
    if (res.data.status === 'success') {
      document.getElementById(
        'my-img'
      ).src = `/img/users/${res.data.data.user.photo}`;
      document.getElementById(
        'user-img'
      ).src = `/img/users/${res.data.data.user.photo}`;
      showAlert('success', 'Data Updated successfully');
    }
  } catch (err) {
    showAlert('error', err);
  }
};

export const passwordChange = async (
  currentPassword,
  password,
  confirmPassword
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/update-password',
      data: {
        currentPassword,
        password,
        confirmPassword,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully.');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
