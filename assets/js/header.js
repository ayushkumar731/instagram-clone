const profileBtn = document.getElementById('profile');
const dropdownBtn = document.getElementsByClassName('dropdown')[0];

profileBtn.addEventListener('click', function () {
  dropdownBtn.classList.toggle('visible');
});
