/**
 * -----------------------------------------------------------------------------
 * OLD GALLERIES
 * -----------------------------------------------------------------------------
 */

(($) => {
  $(`
    a[data-role="gallery-tbn"],
    a[data-role="gallerycontrol"],
    a[data-widget="gallery"],
    a[rel*="gallery"]
  `).click((e) => {
    const href       = $(this).attr('href');
    const figure     = $(this).closest('figure.gallery, .sec-gallery').children('.media-wrapper');
    const figcaption = $(figure.children('p'));
    let title;

    // Cancel the link behavior
    e.preventDefault(); // 1

    // Create figcaption text
    if ($(this).attr('title') && $(figcaption)[0]) {
      title = $(this).attr('title');
    } else {
      title = '';
    }

    $(figure.children('img')).remove();
    figcaption.empty();
    figure.prepend(`<img src="${href}" alt="${title}">`);
    figcaption.append(title);
  });

  // The oldest gallery
  // 1) Cancel the link behavior
  // 2) Load HTML in gallery frame
  $('a.loadinto-gallery').click((e) => {
    e.preventDefault(); // 1
    const href = $(this).attr('href');
    $('#gallery').load(href); // 2
  });
})(jQuery);
