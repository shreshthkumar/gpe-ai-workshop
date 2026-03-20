/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Converts GPE themed content banner (.themed-content) into Columns-Banner block table.
 * Source: https://www.gpe.co.uk/
 *
 * Source DOM: .themed-content
 *   .themed-content__image > picture > img
 *   .themed-content__text > h2 + p + a.btn
 *
 * Target AEM table (Columns): [image | heading + paragraph + CTA]
 */
export default function parse(element, { document }) {
  const cells = [];

  const imgEl = element.querySelector('.themed-content__image img');
  const textEl = element.querySelector('.themed-content__text');
  if (!imgEl && !textEl) return cells;

  // Column 1: Image
  const picture = document.createElement('picture');
  if (imgEl) {
    const newImg = document.createElement('img');
    newImg.src = imgEl.src;
    newImg.alt = imgEl.alt || '';
    picture.appendChild(newImg);
  }

  // Column 2: Text content
  const textContainer = document.createElement('div');

  if (textEl) {
    const heading = textEl.querySelector('h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      textContainer.appendChild(h2);
    }

    const paragraphs = textEl.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text) {
        const newP = document.createElement('p');
        newP.textContent = text;
        textContainer.appendChild(newP);
      }
    });

    const link = textEl.querySelector('a.btn');
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

  return cells;
}
