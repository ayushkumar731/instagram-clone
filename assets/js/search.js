import { searchBtn } from './index';
import { showAlert } from './alerts';

let searchedContainer = document.getElementById('searched-user');

export const search = async () => {
  try {
    const searchValue = searchBtn.value;
    if (searchValue == '') {
      searchedContainer.innerHTML = '';
    } else {
      const res = await axios({
        method: 'GET',
        url: `/api/v1/search/${searchValue}`,
      });
      searchedContainer.innerHTML = '';
      for (let user of res.data.data.user) {
        var searchUser = `<div class="searched-user-container">
            <div class="user-photo">
                <img src="/img/users/${user.photo}" alt="user-photo" />
            </div>
            <div class="user-name-email">
                <div class="user-name"><a href="/${user._id}">${user.name}</a></div>
                <div class="user-email">${user.email}</div>
             </div>
          </div>`;
        searchedContainer.innerHTML += searchUser;
      }
    }
  } catch (err) {
    showAlert('error', 'Please Try Again');
  }
};
