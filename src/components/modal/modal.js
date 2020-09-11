/* eslint-disable no-invalid-this, no-unused-expressions */

/**
 * -----------------------------------------------------------------------------
 * MODAL WINDOWS
 * -----------------------------------------------------------------------------
 *
 * Add load() method to Bootstrap modals
 *
 */

jQuery(document).ready(($) => {
  // For some reason, the arrow function does not work here
  $('.js-open-modal').on('click', function(e) { // eslint-disable-line

    let href         = '';
    const $modal     = $('#modal');
    const $container = $('.modal-content');

    // Cancel the link behavior
    e.preventDefault();

    if ($(this).is('a')) {
      href = $(this).attr('href');
    } else {
      href = $(this).attr('data-href');
    }

    // $container.load(`${href} .js-modal-content`);

    $container.load(`${href} .js-modal-content`, () => {
      $('.form__fieldset.is-fundraising').hide();
    });

    // $container.load(`${href} .js-modal-content`, () => {
    //   modal.modal('show');
    // });

    // Clear modal content to prevent show it before new document has been loaded
    $modal.on('hidden.bs.modal', () => {
      $container.empty();
    });
  });

  // Hide modal on Esc
  $(document).keydown((e) => {
    if (e.keyCode === 27) {
      $('.modal').hide;
      // $('.modal').removeClass('in', function() {
      //   $(this).hide();
      //   // $(this).hide(400);
      // });
    }
  });

});
