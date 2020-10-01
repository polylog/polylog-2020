/**
 * -----------------------------------------------------------------------------
 * SOCIAL SHARING
 * -----------------------------------------------------------------------------
 *
 * Open share popup
 * Sticky like'n'share box
 *
 */

jQuery(document).ready(($) => {

  $('.js-share').click(function sharingWin () {

    const el   = $(this); // eslint-disable-line no-invalid-this
    const href = el.data('href');

    if (el.hasClass('email-md') || el.hasClass('whatsapp')) {
      window.location.href = href;
    } else {
      window.open(href,'shareWin', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    }
  });

  // Make like'n'share box sticky
  if (window.matchMedia('(min-width: 576px)').matches) {
    $('.social-options.js-sticky').sticky({topSpacing: 27});

    // Hide and show sticky
    $(window).scroll(() => {

      const sticky = $('.social-options.js-sticky');
      const bottomNeighbors = $('.comments, .cta, .footer, .article-related, .out-of-bounds');

      if (bottomNeighbors.is(':in-viewport')) {
        sticky.addClass('hidden');
      } else {
        sticky.removeClass('hidden');
      }

    }); // / end: hide and show sticky
  } // end: window.matchMedia

});



