/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-listing
 * Converts GPE content card grids (.flex-grid__content, .news-glide) into Cards-Listing block table.
 * Source: https://www.gpe.co.uk/
 *
 * Source DOM patterns:
 *   .flex-grid__content > .flex-glide > .flex-glide__slides > .flex-glide__slide > .flex-grid__card
 *     Each card: a.content-card or a.content-card-wide
 *       .content-card__picture img + .content-card__content (tag + heading + date)
 *   OR .news-glide > .news-glide__slides > .news-glide__slide > .news-card
 *     Each card: .news-card__picture img + .news-card__content (tag + heading + date)
 *
 * Target AEM table (Cards): [image | tag + heading + description]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all content cards (flex-grid or news-glide patterns)
  const cards = element.querySelectorAll('.flex-grid__card, .news-card');
  if (!cards.length) return cells;

  // Deduplicate by heading text (Glide.js creates clones)
  const seenHeadings = [];

  cards.forEach((card) => {
    // Find the actual card link element
    const cardLink = card.querySelector('a.content-card, a.content-card-wide') || card;

    const img = cardLink.querySelector('img') || card.querySelector('img');
    const tag = cardLink.querySelector('.content-card-wide__tag, .content-card__tag, .news-card__tag');
    const heading = cardLink.querySelector('.content-card-wide__heading h2, .content-card__heading h2, .content-card-wide__heading h3, .content-card__heading h3, .news-card__heading h2, .news-card__heading h3');
    const date = cardLink.querySelector('.content-card__date, .content-card-wide__date, .news-card__date');

    // Dedup by heading
    const headingText = heading ? heading.textContent.trim() : '';
    if (headingText && seenHeadings.indexOf(headingText) !== -1) return;
    if (headingText) seenHeadings.push(headingText);

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

    if (tag) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = tag.textContent.trim();
      p.appendChild(em);
      textContainer.appendChild(p);
    }

    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = headingText;
      textContainer.appendChild(strong);
    }

    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textContainer.appendChild(p);
    }

    // Include link if card is a link
    const linkEl = card.querySelector('a[href]') || (card.tagName === 'A' ? card : null);
    if (linkEl && linkEl.href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = headingText || 'View';
      p.appendChild(a);
      textContainer.appendChild(p);
    }

    cells.push([picture, textContainer]);
  });

  return cells;
}
