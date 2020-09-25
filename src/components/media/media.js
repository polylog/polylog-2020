/**
 * -----------------------------------------------------------------------------
 * MEDIA
 * -----------------------------------------------------------------------------
 */

(($) => {
  // Wrap image to make rounded corners and semitransparent inner border
  $('.article > img:not([class]), .article-body > img:not([class]), .article-body > .image.image-_original').wrap('<div class="media-wrapper"></div>');
  $('.sec-gallery > img:not([class]), figure.gallery > img:not([class]), #gallery > img:not([class])').wrap('<div class="media-wrapper"></div>');

  // HIDE BROKEN IMAGES
  $('img').error(function hideBrokenImg() {
    const el = $(this); // eslint-disable-line no-invalid-this
    const wrapper = el.parent('div');
    el.hide();
    wrapper.hide();
    wrapper.next('.gallery').hide();
  });

  // MAGNIFIC POPUP IMAGE
  // 1) Remove text from preloader
  // 2) String that contains classes that will be added to the root element of
  // popup wrapper and to dark overlay

  $('.js-mfp').magnificPopup({
    type: 'image',
    tLoading: '', // 1
    removalDelay: 300,
    mainClass: 'mfp-fade', // 2
    fixedContentPos: true,
  });


  // MAGNIFIC POPUP VIDEO
  // 1) Remove text from preloader
  // 2) By default Magnific Popup supports only one type of URL for each
  // service:
  // YouTube
  // https://www.youtube.com/watch?v=WV75H2oqSvI
  // Vimeo
  // https://vimeo.com/123123
  // Google Maps
  // https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom
  // 3) But it can be rewrited w/ additional parameters

  $('.js-mfp-video').magnificPopup({
    type: 'iframe',
    tLoading: '', // 1
    mainClass: 'mfp-fade',

    iframe: {
      patterns: {
        youtube: { // 2
          src: 'https://www.youtube.com/embed/%id%?rel=0&modestbranding=1&autohide=1&showinfo=0&autoplay=1', // 3
        },
      },
    },
  });

  // FLASH

  let hasFlash = false;
  try {
    const fo = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    if (fo) {
      hasFlash = true;
    }
  } catch (e) {
    if (navigator.mimeTypes
      && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined
      && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
      hasFlash = true;
    }
  }

  if (hasFlash) {
    $('.video-flash.primary').addClass('play-it');
  } else {
    $('.video.fallback, .video-caption.fallback').addClass('play-it');
  }
})(jQuery);
