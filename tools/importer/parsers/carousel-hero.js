/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Converts GPE hero carousel (.hero-glide) into Carousel-Hero block table.
 * Source: https://www.gpe.co.uk/
 *
 * Target AEM table structure (Carousel):
 *   Row 0: block name "Carousel-Hero"
 *   Row N: [image | heading + paragraph + CTA link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Remove navigation controls before extracting content
  element.querySelectorAll('.hero-pills__right, .hero-pills-prev, .hero-pills-next').forEach((el) => el.remove());

  // Get slides as array for index-based loop
  const slides = Array.from(element.querySelectorAll('.hero-glide__slide'));
  if (!slides.length) return cells;

  // Use index-based for loop with explicit break for dedup
  const seenKeys = [];
  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    const img = slide.querySelector('picture img');
    const content = slide.querySelector('.hero-pills__content');
    if (!img || !content) continue;

    const heading = content.querySelector('h2');
    if (!heading) continue;

    const key = heading.textContent.trim();

    // Check if we already have this key using indexOf
    if (seenKeys.indexOf(key) !== -1) break;
    seenKeys.push(key);

    // Column 1: Image
    const picture = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    picture.appendChild(newImg);

    // Column 2: Text content
    const textContainer = document.createElement('div');

    const h2 = document.createElement('h2');
    h2.textContent = key;
    textContainer.appendChild(h2);

    const paragraph = content.querySelector('p');
    if (paragraph) {
      const link = paragraph.querySelector('a');
      const textParts = [];
      paragraph.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          if (text) textParts.push(text);
        }
      });

      if (textParts.length) {
        const p = document.createElement('p');
        p.textContent = textParts.join(' ');
        textContainer.appendChild(p);
      }

      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        let linkText = '';
        link.childNodes.forEach((node) => {
          if (node.nodeType === 3) linkText += node.textContent.trim();
        });
        a.textContent = linkText || link.textContent.trim();
        p.appendChild(a);
        textContainer.appendChild(p);
      }
    }

    cells.push([picture, textContainer]);
  }

  return cells;
}
