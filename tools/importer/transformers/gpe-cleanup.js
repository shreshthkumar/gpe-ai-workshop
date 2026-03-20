/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: GPE site cleanup.
 * Removes non-authorable content from gpe.co.uk pages.
 * Selectors from captured DOM of https://www.gpe.co.uk/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (CybotCookiebot)
    WebImporter.DOMUtils.remove(element, [
      '#CybotCookiebotDialog',
      '#CybotCookiebotDialogBodyUnderlay',
    ]);

    // Search modal overlay
    WebImporter.DOMUtils.remove(element, [
      '.modal.modal--search',
    ]);
  }

  if (hookName === H.after) {
    // Header and navigation
    WebImporter.DOMUtils.remove(element, [
      'header.header',
    ]);

    // Footer
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
    ]);

    // Safe element removal
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
