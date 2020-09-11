/**
 * -----------------------------------------------------------------------------
 * LINKS
 * -----------------------------------------------------------------------------
 *
 * Anti spam protection for email addresses
 *
 */

jQuery(document).ready(function($) {

  /**
   * This snippet slightly ‘obfuscates’ email addresses to make it harder for
   * spambots to harvest them, while still offering a readable address to visitors.
   * <a href="mailto:foo(at)gmail(dot)com">…</a>
   * →
   * <a href="mailto:foo@polylog.ru">…</a>
   */

  $('.js-contact').each(function() {
    this.href = this.href.replace('(at)gmail', '@polylog').replace('(dot)com', '.ru');
  });
});
