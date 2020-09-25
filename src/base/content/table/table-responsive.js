(($) => {
  let switched = false;

  function setCellHeights(original, copy) {
    const tr      = original.find('tr');
    const trCopy   = copy.find('tr');
    const heights   = [];

    tr.each((index) => {
      const self  = $(this);
      const tx      = self.find('th, td');

      tx.each(() => {
        const height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });
    });

    trCopy.each((index) => {
      $(this).height(heights[index]);
    });
  }

  function splitTable(original) {
    original.wrap('<div class=\'table-wrapper\' />');

    const copy = original.clone();
    copy.find('td:not(:first-child), th:not(:first-child)').css('display', 'none');
    copy.removeClass('responsive');

    original.closest('.table-wrapper').append(copy);
    copy.wrap('<div class=\'pinned\' />');
    original.wrap('<div class=\'scrollable\' />');

    setCellHeights(original, copy);
  }

  function unsplitTable(original) {
    original.closest('.table-wrapper').find('.pinned').remove();
    original.unwrap();
    original.unwrap();
  }

  // eslint-disable-next-line consistent-return
  const updateTables = () => {
    if (($(window).width() < 767) && !switched) {
      switched = true;
      $('.table-responsive').each((i, element) => {
        splitTable($(element));
      });
      return true;
    }
    if (switched && ($(window).width() > 767)) {
      switched = false;
      $('.table-responsive').each((i, element) => {
        unsplitTable($(element));
      });
    }
  };

  $(window).load(updateTables);
  $(window).on('redraw', () => { switched = false; updateTables(); }); // An event to listen for
  $(window).on('resize', updateTables);
})(jQuery);
