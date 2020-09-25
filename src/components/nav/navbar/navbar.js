/**
 * -----------------------------------------------------------------------------
 * RESPONSIVE FUNCTIONS
 * -----------------------------------------------------------------------------
 */

(($) => {
  // Disable Dropdowns on Mobiles and Change Dropdowns Triggers on Laptops
  function controlDropdowns() {
    if (window.matchMedia('(max-width: 767px)').matches) {
      $('.js-menu-link, .navbar-dropdown-toggle-split').attr('data-toggle', '');
    } else if (window.matchMedia('(min-width: 768px) and (max-width: 1199px)').matches) {
      // Turn off dropdown trigger behavior on split button link and turn on it
      // on link
      $('.js-menu-link').attr('data-toggle', 'dropdown');
      $('.navbar-dropdown-toggle-split').attr('data-toggle', '');
    } else {
      // Turn off dropdown trigger behavior on link and turn on it on split
      // button
      $('.js-menu-link').attr('data-toggle', '');
      $('.navbar-dropdown-toggle-split').attr('data-toggle', 'dropdown');
    }
  }

  // Hide dropdown after mouse leaved navbar area
  // $('.navbar-item.dropdown').mouseenter((e) => {
  //   const el = $(e.currentTarget);
  //     setTimeout(() => {
  //       if (!el.hasClass('show')) {
  //         $('.navbar-item.dropdown.show').removeClass('show');
  //       }
  //     }, 2000);
  // });

  // $('.navbar-item.dropdown').mouseleave((e) => {
  //   const el = $(e.currentTarget);
  //     setTimeout(() => {
  //       if (el.hasClass('show')) {
  //         $('.navbar-item.dropdown.show').removeClass('show');
  //       }
  //     }, 1500);
  // });

  $('.navbar').mouseleave(() => {
    setTimeout(() => {
      $('.navbar-item.dropdown.show .navbar-dropdown-toggle-split').attr('aria-expanded', 'false');
      $('.navbar-item.dropdown.show').removeClass('show');
    }, 1500);
  });

  /**
   * Change CTA Label
   */
  function changeCTAlabel() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('.navbar-btn-primary').text('Обратная связь');
    } else {
      $('.navbar-btn-primary').text('Пишите');
    }
  }

  // Execute
  controlDropdowns();
  changeCTAlabel();

  // Execute on window resize
  $(window).resize(() => {
    controlDropdowns();
    changeCTAlabel();
  });
})(jQuery);
