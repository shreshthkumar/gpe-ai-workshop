/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-promo
 * Converts GPE promo card grid (.promo-card-grid) into Cards-Promo block table.
 * Source: https://www.gpe.co.uk/
 *
 * Source DOM: .promo-card-grid > a.promo-card
 *   Each card: .promo-card__picture img + .promo-card__text (h3 + p)
 *
 * Target AEM table: [image | heading + description]
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = element.querySelectorAll('.promo-card');

  cards.forEach((card) => {
    const img = card.querySelector('.promo-card__picture img, .promo-card__image');
    const titleEl = card.querySelector('.promo-card__title');
    const introEl = card.querySelector('.promo-card__intro');

    // Column 1: Image
    const picture = document.createElement('picture');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      picture.appendChild(newImg);
    }

    // Column 2: Text content
    const textContainer = document.createElement('div');

    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textContainer.appendChild(strong);
    }

    if (introEl) {
      const p = document.createElement('p');
      p.textContent = introEl.textContent.trim();
      textContainer.appendChild(p);
    }

    // Include the card link as CTA
    if (card.tagName === 'A' && card.href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = card.href;
      a.textContent = titleEl ? titleEl.textContent.trim() : 'Learn more';
      p.appendChild(a);
      textContainer.appendChild(p);
    }

    cells.push([picture, textContainer]);
  });

  return cells;
}
