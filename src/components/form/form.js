/**
 * -----------------------------------------------------------------------------
 * FORM
 * -----------------------------------------------------------------------------
 */

jQuery(document).ready(($) => {
  const $subscriptionBtn = $('.subscription .form-submit, .webform-client-form-3601 .form-submit');
  const $disclaimerToolptip = $('.subscription .form-disclaimer, .webform-client-form-3601 .form-disclaimer');

  /**
   * Round corners of page header of 2nd and the next rwsult pages and layed
   * out above the projects filter
   */
  $('.row.filter, #views-exposed-form-projects-page, #views-exposed-form-projects-en-page').prev('.page-header').css('border-radius', '3px');

  // Disable subscription form on it thank you page.
  $('.section-blog.page-thanks .subscription input, .section-blog.page-thanks .subscription button').prop('disabled', true);

  // Togle filter button
  $('.form-select').change(function enableFilterButton() {
    $(this).closest('form').find('.form-type-button').removeClass('disabled'); // eslint-disable-line no-invalid-this
  });

  // Show disclaimer toolptip on subscription
  if (window.matchMedia('(min-width: 992px)').matches) {
    $subscriptionBtn.mouseover(() => {
      $disclaimerToolptip.addClass('open');
    });

    $(document).on('click', () => {
      $disclaimerToolptip.removeClass('open');
    });

    $(document).keydown((e) => {
      if (e.keyCode === 27) {
        $disclaimerToolptip.removeClass('open');
      }
    });
  }

  /**
   * TOGGLE FUNDRAISING FIELDSET
   */
  function fundraisingDetails() {
    const $services = $('#form-services');
    const $fieldsetFundraising = $('.form__fieldset.is-fundraising');
    const $fundraisingRequired = $('.form__fieldset.is-fundraising .optional-required');

    if (($services.val() === 'Fundraising' || $services.val() === 'Фандрайзинг') && $fieldsetFundraising.is(':hidden')) {
      $fundraisingRequired.prop('required', true);
      $fieldsetFundraising.slideDown(1000);
    } else if (($services.val() !== 'Fundraising' || $services.val() !== 'Фандрайзинг') && $fieldsetFundraising.is(':visible')) {
      $fundraisingRequired.removeProp('required');
      $fieldsetFundraising.slideUp(1000);
    }
  }

  // Hide fieldset on full page
  $('.form__fieldset.is-fundraising').hide();

  // Toggle fieldset in modal
  // $('.modal-content').on('change', '#form-services', fundraisingDetails);

  // Toggle fieldset on full page
  $('#form-services').on('change', fundraisingDetails);
});
