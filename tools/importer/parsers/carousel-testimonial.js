/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-testimonial
 * Converts GPE testimonial carousel (.feature-glide) into Carousel-Testimonial block table.
 * Source: https://www.gpe.co.uk/
 *
 * Source DOM: .feature-glide > .feature-glide__slides > li.feature-glide__slide
 *   Each slide: .feature-card
 *     .feature-card__picture img
 *     .feature-card__content > .feature-card__text > figure
 *       blockquote > p (quote)
 *       figcaption > p (name) + div > p (title/company)
 *
 * Target AEM table (Carousel): [image | quote + attribution]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Remove navigation controls
  element.querySelectorAll('.feature-glide__arrows, .feature-glide__bullets').forEach((el) => el.remove());

  const slides = element.querySelectorAll('.feature-glide__slide');
  if (!slides.length) return cells;

  // Deduplicate by quote text (Glide.js clones)
  const seenQuotes = [];

  slides.forEach((slide) => {
    const card = slide.querySelector('.feature-card');
    if (!card) return;

    const img = card.querySelector('.feature-card__image, .feature-card__picture img');
    const blockquote = card.querySelector('.feature-card__blockquote p');
    const nameEl = card.querySelector('.feature-card__caption > p');
    const roleEl = card.querySelector('.feature-card__caption > div p');

    // Dedup by quote text
    const quoteText = blockquote ? blockquote.textContent.trim() : '';
    if (quoteText && seenQuotes.indexOf(quoteText) !== -1) return;
    if (quoteText) seenQuotes.push(quoteText);

    // Column 1: Image
    const picture = document.createElement('picture');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      picture.appendChild(newImg);
    }

    // Column 2: Quote and attribution
    const textContainer = document.createElement('div');

    if (blockquote) {
      const p = document.createElement('p');
      p.textContent = quoteText;
      textContainer.appendChild(p);
    }

    if (nameEl) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      p.appendChild(strong);
      textContainer.appendChild(p);
    }

    if (roleEl) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = roleEl.textContent.trim();
      p.appendChild(em);
      textContainer.appendChild(p);
    }

    cells.push([picture, textContainer]);
  });

  return cells;
}
