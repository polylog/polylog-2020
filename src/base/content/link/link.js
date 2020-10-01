/**
 * -----------------------------------------------------------------------------
 * LINKS
 * -----------------------------------------------------------------------------
 *
 * Anti spam protection for email addresses
 *
 */

(() => {
  document.querySelectorAll('.js-contact').forEach((el) => {
    const email = el;
    email.href = el.href
      .replace('(at)gmail', '@polylog')
      .replace('(dot)com', '.ru');
  });
})();
