/**
 * -----------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------
 * Spin footer wheel on CTA hover on the Chinese and Japanese landings.
 */

(() => {
  const spinTheFooterWheel = () => {
    document.querySelector('.footer').classList.add('js-cta-hovered');
  };

  const stopTheFooterWheel = () => {
    document.querySelector('.footer').classList.remove('js-cta-hovered');
  };

  const btn = document.querySelector('.btn.is-spinner');

  if (btn) {
    document.querySelector('.btn.is-bottom-cta')
      .addEventListener('mouseover', spinTheFooterWheel);

    document.querySelector('.btn.is-bottom-cta')
      .addEventListener('mouseout', stopTheFooterWheel);
  }
})();
