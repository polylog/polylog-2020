/**
 * -----------------------------------------------------------------------------
 * CAROUSEL
 * -----------------------------------------------------------------------------
 *
 * Preventing carousel from auto sliding.
 * Links to specific slide from inner pages.
 * Swiping to go back and forth between the slides.
 * Change body background color to yellow and vice versa.
 * Set slide counter in footer.
 *
 */

jQuery(document).ready(function($) {

  var carousel     = $('.carousel');

  // Preventing Bootstrap carousel from auto sliding

  $('.carousel.js-manual').carousel({
    interval: 0
  });

 // Automatically cycling carousel
  $('.carousel.js-auto').carousel({
    interval: 12000
  });


/* --------------------------------------------------------------------------
   Touch events
   -------------------------------------------------------------------------- */

  /**
   * Prev
   *
   * For swipe touch event head jQuery Mobile, create a custom build with
   * just Touch and add it to project.
   * jquerymobile.com/download-builder/ => /src/js/jquery.mobile.custom.js
   */

  carousel.swiperight(function() {
    $(this).carousel('prev');
  });

  // Next

  carousel.swipeleft(function() {
    $(this).carousel('next');
  });

});
