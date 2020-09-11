/**
 * -----------------------------------------------------------------------------
 * SEARCH
 * -----------------------------------------------------------------------------
 *
 * Set placeholder text
 */
const setSearchPlaceholder = () => {
  const input = document.getElementById('gsc-i-id1');
  const lang = document.getElementsByTagName('html')[0].getAttribute('lang');

  if (window.matchMedia('(max-width: 575px)').matches) {
    input.placeholder = (lang === 'ru') ? 'Поиск' : 'Site search';
  } else if (window.matchMedia('(min-width: 576px) and (max-width: 991px)').matches) {
    input.placeholder = (lang === 'ru') ? 'Поиск: PR, event-менеджмент' : 'Search PR and event management';
  } else {
    input.placeholder = (lang === 'ru') ? 'Поиск: PR, организация мероприятий, IT-решения' : 'Search PR, event management and IT solutions';
  }
};

window.addEventListener('load', () => {
  setSearchPlaceholder();

  const searchForm = document.querySelector('.gsc-control-wrapper-cse > .gsc-search-box');
  const searchInput = document.querySelector('.gsib_a > .gsc-input');
  const searchCancel = document.querySelector('.header__search-cancel');

  // Show form
  document.addEventListener('click', (e) => {
    if (e.target.closest('.header__search-toggler')) {
      searchForm.classList.add('is-visible');
      searchCancel.classList.add('is-visible');
      searchInput.focus();
    }
  }, false);

  // Hide form
  document.addEventListener('click', (e) => {
    if (e.target.matches('.header__search-cancel')) {
      searchForm.classList.remove('is-visible');
      searchCancel.classList.remove('is-visible');
      // searchInput.blur();
    }
  }, false);
}, false);

window.addEventListener('resize', () => {
  setSearchPlaceholder();
}, false);
