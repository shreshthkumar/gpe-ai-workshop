/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-search
 * Converts GPE property search (.quick-search) into Embed-Search block table.
 * Source: https://www.gpe.co.uk/
 *
 * The search is interactive/dynamic content that cannot be migrated as static content.
 * We embed a link to the portfolio page as a placeholder.
 *
 * Target AEM table (Embed): [URL to search page]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Create a link to the portfolio/search page as embed placeholder
  const a = document.createElement('a');
  a.href = 'https://www.gpe.co.uk/portfolio';
  a.textContent = 'https://www.gpe.co.uk/portfolio';

  cells.push([a]);

  return cells;
}
