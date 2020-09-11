/**
 * -----------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------
 * Rotate footer ring on CTA hover on the Chinese and Japabese landings.
 */

jQuery(document).ready(($) => {
  $('.btn.is-bottom-cta').hover(() => {
    $('.footer').toggleClass('js-cta-hovered');
  });
});
