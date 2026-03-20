/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Converts GPE circle cards (.circle-card) into Cards-Feature block table.
 * Source: https://www.gpe.co.uk/
 *
 * Source DOM: .circle-card
 *   .circle-card__picture img + .circle-card__text (.circle-card__title + .circle-card__intro)
 *
 * Target AEM table (Cards): [image | title + description]
 */
export default function parse(element, { document }) {
  const cells = [];

  // The element is the container with circle-card items
  const cards = element.querySelectorAll('.circle-card');
  if (!cards.length) {
    // If element itself is a circle-card
    if (element.classList.contains('circle-card')) {
      processCard(element, document, cells);
    }
    return cells;
  }

  cards.forEach((card) => processCard(card, document, cells));

  return cells;
}

function processCard(card, document, cells) {
  const img = card.querySelector('.circle-card__image, .circle-card__picture img');
  const title = card.querySelector('.circle-card__title');
  const intro = card.querySelector('.circle-card__intro');

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

  if (title) {
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    textContainer.appendChild(strong);
  }

  if (intro) {
    const p = document.createElement('p');
    p.textContent = intro.textContent.trim();
    textContainer.appendChild(p);
  }

  cells.push([picture, textContainer]);
}
