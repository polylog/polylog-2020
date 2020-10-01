/**
 * -----------------------------------------------------------------------------
 * LIST VIEW
 * -----------------------------------------------------------------------------
 * src/components/list-view/list-view.js
 * Remove breaks in title list
 *
 */

(() => {
  const titleListBr = document.querySelectorAll('.list-view-item br');
  titleListBr.forEach((el) => {
    const br = el;
    br.style.display = 'none';
  });
})();

/**
 * -----------------------------------------------------------------------------
 * OLD GALLERIES
 * -----------------------------------------------------------------------------
 * /src/components/media/gallery/legacy.js
 */

(($) => {
  // Old gallery
  // 1) Cancel the link behavior
  // 2) Create figcaption text
  $('a[data-role="gallery-tbn"], a[data-role="gallerycontrol"], a[data-widget="gallery"], a[rel*="gallery"]').click((e) => {
    const href       = $(this).attr('href');
    const figure     = $(this).closest('figure.gallery, .sec-gallery').children('.media-wrapper');
    const figcaption = $(figure.children('p'));
    let title;

    e.preventDefault(); // 1

    if ($(this).attr('title') && $(figcaption)[0]) { // 2
      title = $(this).attr('title');
    } else {
      title = '';
    }

    $(figure.children('img')).remove();
    figcaption.empty();
    figure.prepend(`<img src="${href}" alt="${title}">`);
    figcaption.append(title);
  });
})(jQuery);

