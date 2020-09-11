/**
 * -----------------------------------------------------------------------------
 * OLD GALLERIES
 * -----------------------------------------------------------------------------
 */


jQuery(document).ready(function($) {

  // Old gallery
  // 1) Cancel the link behavior
  // 2) Create figcaption text
  $('a[data-role="gallery-tbn"], a[data-role="gallerycontrol"], a[data-widget="gallery"], a[rel*="gallery"]').click(function(e) {

    var href       = $(this).attr('href');
    var figure     = $(this).closest('figure.gallery, .sec-gallery').children('.media-wrapper');
    var figcaption = $(figure.children('p'));
    var title;

    e.preventDefault(); // 1

    if ($(this).attr('title') && $(figcaption)[0]) { // 2
      title = $(this).attr('title');
    } else {
      title = '';
    }

    $(figure.children('img')).remove();
    figcaption.empty();
    figure.prepend('<img src="' + href + '" alt="' + title + '">');
    figcaption.append(title);
  });

  // The oldest gallery
  // 1) Cancel the link behavior
  // 2) Load HTML in gallery frame
  $('a.loadinto-gallery').click(function(e) {
    e.preventDefault(); // 1
    var href = $(this).attr('href');
    $('#gallery').load(href); // 2
  });

});
