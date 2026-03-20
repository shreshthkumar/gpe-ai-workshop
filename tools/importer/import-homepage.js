/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsPromoParser from './parsers/cards-promo.js';
import columnsBannerParser from './parsers/columns-banner.js';
import embedSearchParser from './parsers/embed-search.js';
import cardsListingParser from './parsers/cards-listing.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';

// TRANSFORMER IMPORTS
import gpeCleanupTransformer from './transformers/gpe-cleanup.js';
import gpeSectionsTransformer from './transformers/gpe-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'GPE corporate homepage with hero carousel, workspace types, customer charter, property search, featured properties, value propositions, thought leadership, testimonials, sustainability content, and latest news',
  urls: [
    'https://www.gpe.co.uk/'
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.hero-glide']
    },
    {
      name: 'cards-promo',
      instances: ['.promo-card-grid']
    },
    {
      name: 'columns-banner',
      instances: ['.themed-content.theme--purple']
    },
    {
      name: 'embed-search',
      instances: ['.quick-search']
    },
    {
      name: 'cards-listing',
      instances: [
        '.flex-grid__wrap.bg-circle-tr-purple .flex-grid__content',
        '.flex-grid__wrap.m-centered.w-max-lg:not(.bg-circle-tr-purple):not(.bg-circle-tr-green) .flex-grid__content',
        '.flex-grid__wrap.bg-circle-tr-green .flex-grid__content',
        '.news-glide'
      ]
    },
    {
      name: 'cards-feature',
      instances: ['.circle-card']
    },
    {
      name: 'carousel-testimonial',
      instances: ['.feature-glide']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.hero-glide',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Workspace Types',
      selector: '.promo-card-grid',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Customer Charter Banner',
      selector: '.themed-content.theme--purple',
      style: 'purple',
      blocks: ['columns-banner'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Find Perfect Space',
      selector: '.quick-search',
      style: null,
      blocks: ['embed-search'],
      defaultContent: ['.quick-search__title']
    },
    {
      id: 'section-5',
      name: 'Featured Properties',
      selector: '.flex-grid__wrap.bg-circle-tr-purple',
      style: null,
      blocks: ['cards-listing'],
      defaultContent: ['.flex-grid__heading']
    },
    {
      id: 'section-6',
      name: 'Why GPE',
      selector: ['.circle-card', 'h1.heading.heading--primary'],
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['h1.heading.heading--primary']
    },
    {
      id: 'section-7',
      name: 'Thought Leadership Articles',
      selector: '.flex-grid__wrap.m-centered.w-max-lg:not(.bg-circle-tr-purple):not(.bg-circle-tr-green)',
      style: null,
      blocks: ['cards-listing'],
      defaultContent: ['.flex-grid__heading']
    },
    {
      id: 'section-8',
      name: 'Customer Testimonials',
      selector: '.feature-glide',
      style: null,
      blocks: ['carousel-testimonial'],
      defaultContent: ['.feature__heading']
    },
    {
      id: 'section-9',
      name: 'Helping London Thrive',
      selector: '.flex-grid__wrap.bg-circle-tr-green',
      style: null,
      blocks: ['cards-listing'],
      defaultContent: ['.flex-grid__heading']
    },
    {
      id: 'section-10',
      name: 'Latest News',
      selector: '.news-glide',
      style: null,
      blocks: ['cards-listing'],
      defaultContent: ['.heading.heading--primary.text-center']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-promo': cardsPromoParser,
  'columns-banner': columnsBannerParser,
  'embed-search': embedSearchParser,
  'cards-listing': cardsListingParser,
  'cards-feature': cardsFeatureParser,
  'carousel-testimonial': carouselTestimonialParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  gpeCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [gpeSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          const cells = parser(block.element, { document, url, params });
          if (cells && cells.length > 0) {
            const blockTable = WebImporter.Blocks.createBlock(document, {
              name: block.name,
              cells,
            });
            block.element.replaceWith(blockTable);
          }
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
