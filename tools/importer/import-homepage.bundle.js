var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    element.querySelectorAll(".hero-pills__right, .hero-pills-prev, .hero-pills-next").forEach((el) => el.remove());
    const slides = Array.from(element.querySelectorAll(".hero-glide__slide"));
    if (!slides.length) return cells;
    const seenKeys = [];
    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      const img = slide.querySelector("picture img");
      const content = slide.querySelector(".hero-pills__content");
      if (!img || !content) continue;
      const heading = content.querySelector("h2");
      if (!heading) continue;
      const key = heading.textContent.trim();
      if (seenKeys.indexOf(key) !== -1) break;
      seenKeys.push(key);
      const picture = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      picture.appendChild(newImg);
      const textContainer = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.textContent = key;
      textContainer.appendChild(h2);
      const paragraph = content.querySelector("p");
      if (paragraph) {
        const link = paragraph.querySelector("a");
        const textParts = [];
        paragraph.childNodes.forEach((node) => {
          if (node.nodeType === 3) {
            const text = node.textContent.trim();
            if (text) textParts.push(text);
          }
        });
        if (textParts.length) {
          const p = document.createElement("p");
          p.textContent = textParts.join(" ");
          textContainer.appendChild(p);
        }
        if (link) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.href;
          let linkText = "";
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

  // tools/importer/parsers/cards-promo.js
  function parse2(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".promo-card");
    cards.forEach((card) => {
      const img = card.querySelector(".promo-card__picture img, .promo-card__image");
      const titleEl = card.querySelector(".promo-card__title");
      const introEl = card.querySelector(".promo-card__intro");
      const picture = document.createElement("picture");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        picture.appendChild(newImg);
      }
      const textContainer = document.createElement("div");
      if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        textContainer.appendChild(strong);
      }
      if (introEl) {
        const p = document.createElement("p");
        p.textContent = introEl.textContent.trim();
        textContainer.appendChild(p);
      }
      if (card.tagName === "A" && card.href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = card.href;
        a.textContent = titleEl ? titleEl.textContent.trim() : "Learn more";
        p.appendChild(a);
        textContainer.appendChild(p);
      }
      cells.push([picture, textContainer]);
    });
    return cells;
  }

  // tools/importer/parsers/columns-banner.js
  function parse3(element, { document }) {
    const cells = [];
    const imgEl = element.querySelector(".themed-content__image img");
    const textEl = element.querySelector(".themed-content__text");
    if (!imgEl && !textEl) return cells;
    const picture = document.createElement("picture");
    if (imgEl) {
      const newImg = document.createElement("img");
      newImg.src = imgEl.src;
      newImg.alt = imgEl.alt || "";
      picture.appendChild(newImg);
    }
    const textContainer = document.createElement("div");
    if (textEl) {
      const heading = textEl.querySelector("h2");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        textContainer.appendChild(h2);
      }
      const paragraphs = textEl.querySelectorAll("p");
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const newP = document.createElement("p");
          newP.textContent = text;
          textContainer.appendChild(newP);
        }
      });
      const link = textEl.querySelector("a.btn");
      if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        let linkText = "";
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

  // tools/importer/parsers/embed-search.js
  function parse4(element, { document }) {
    const cells = [];
    const a = document.createElement("a");
    a.href = "https://www.gpe.co.uk/portfolio";
    a.textContent = "https://www.gpe.co.uk/portfolio";
    cells.push([a]);
    return cells;
  }

  // tools/importer/parsers/cards-listing.js
  function parse5(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".flex-grid__card, .news-card");
    if (!cards.length) return cells;
    const seenHeadings = [];
    cards.forEach((card) => {
      const cardLink = card.querySelector("a.content-card, a.content-card-wide") || card;
      const img = cardLink.querySelector("img") || card.querySelector("img");
      const tag = cardLink.querySelector(".content-card-wide__tag, .content-card__tag, .news-card__tag");
      const heading = cardLink.querySelector(".content-card-wide__heading h2, .content-card__heading h2, .content-card-wide__heading h3, .content-card__heading h3, .news-card__heading h2, .news-card__heading h3");
      const date = cardLink.querySelector(".content-card__date, .content-card-wide__date, .news-card__date");
      const headingText = heading ? heading.textContent.trim() : "";
      if (headingText && seenHeadings.indexOf(headingText) !== -1) return;
      if (headingText) seenHeadings.push(headingText);
      const picture = document.createElement("picture");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        picture.appendChild(newImg);
      }
      const textContainer = document.createElement("div");
      if (tag) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = tag.textContent.trim();
        p.appendChild(em);
        textContainer.appendChild(p);
      }
      if (heading) {
        const strong = document.createElement("strong");
        strong.textContent = headingText;
        textContainer.appendChild(strong);
      }
      if (date) {
        const p = document.createElement("p");
        p.textContent = date.textContent.trim();
        textContainer.appendChild(p);
      }
      const linkEl = card.querySelector("a[href]") || (card.tagName === "A" ? card : null);
      if (linkEl && linkEl.href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = linkEl.href;
        a.textContent = headingText || "View";
        p.appendChild(a);
        textContainer.appendChild(p);
      }
      cells.push([picture, textContainer]);
    });
    return cells;
  }

  // tools/importer/parsers/cards-feature.js
  function parse6(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".circle-card");
    if (!cards.length) {
      if (element.classList.contains("circle-card")) {
        processCard(element, document, cells);
      }
      return cells;
    }
    cards.forEach((card) => processCard(card, document, cells));
    return cells;
  }
  function processCard(card, document, cells) {
    const img = card.querySelector(".circle-card__image, .circle-card__picture img");
    const title = card.querySelector(".circle-card__title");
    const intro = card.querySelector(".circle-card__intro");
    const picture = document.createElement("picture");
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      picture.appendChild(newImg);
    }
    const textContainer = document.createElement("div");
    if (title) {
      const strong = document.createElement("strong");
      strong.textContent = title.textContent.trim();
      textContainer.appendChild(strong);
    }
    if (intro) {
      const p = document.createElement("p");
      p.textContent = intro.textContent.trim();
      textContainer.appendChild(p);
    }
    cells.push([picture, textContainer]);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse7(element, { document }) {
    const cells = [];
    element.querySelectorAll(".feature-glide__arrows, .feature-glide__bullets").forEach((el) => el.remove());
    const slides = element.querySelectorAll(".feature-glide__slide");
    if (!slides.length) return cells;
    const seenQuotes = [];
    slides.forEach((slide) => {
      const card = slide.querySelector(".feature-card");
      if (!card) return;
      const img = card.querySelector(".feature-card__image, .feature-card__picture img");
      const blockquote = card.querySelector(".feature-card__blockquote p");
      const nameEl = card.querySelector(".feature-card__caption > p");
      const roleEl = card.querySelector(".feature-card__caption > div p");
      const quoteText = blockquote ? blockquote.textContent.trim() : "";
      if (quoteText && seenQuotes.indexOf(quoteText) !== -1) return;
      if (quoteText) seenQuotes.push(quoteText);
      const picture = document.createElement("picture");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        picture.appendChild(newImg);
      }
      const textContainer = document.createElement("div");
      if (blockquote) {
        const p = document.createElement("p");
        p.textContent = quoteText;
        textContainer.appendChild(p);
      }
      if (nameEl) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameEl.textContent.trim();
        p.appendChild(strong);
        textContainer.appendChild(p);
      }
      if (roleEl) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = roleEl.textContent.trim();
        p.appendChild(em);
        textContainer.appendChild(p);
      }
      cells.push([picture, textContainer]);
    });
    return cells;
  }

  // tools/importer/transformers/gpe-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#CybotCookiebotDialog",
        "#CybotCookiebotDialogBodyUnderlay"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".modal.modal--search"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/gpe-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "GPE corporate homepage with hero carousel, workspace types, customer charter, property search, featured properties, value propositions, thought leadership, testimonials, sustainability content, and latest news",
    urls: [
      "https://www.gpe.co.uk/"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".hero-glide"]
      },
      {
        name: "cards-promo",
        instances: [".promo-card-grid"]
      },
      {
        name: "columns-banner",
        instances: [".themed-content.theme--purple"]
      },
      {
        name: "embed-search",
        instances: [".quick-search"]
      },
      {
        name: "cards-listing",
        instances: [
          ".flex-grid__wrap.bg-circle-tr-purple .flex-grid__content",
          ".flex-grid__wrap.m-centered.w-max-lg:not(.bg-circle-tr-purple):not(.bg-circle-tr-green) .flex-grid__content",
          ".flex-grid__wrap.bg-circle-tr-green .flex-grid__content",
          ".news-glide"
        ]
      },
      {
        name: "cards-feature",
        instances: [".circle-card"]
      },
      {
        name: "carousel-testimonial",
        instances: [".feature-glide"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".hero-glide",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Workspace Types",
        selector: ".promo-card-grid",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Customer Charter Banner",
        selector: ".themed-content.theme--purple",
        style: "purple",
        blocks: ["columns-banner"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Find Perfect Space",
        selector: ".quick-search",
        style: null,
        blocks: ["embed-search"],
        defaultContent: [".quick-search__title"]
      },
      {
        id: "section-5",
        name: "Featured Properties",
        selector: ".flex-grid__wrap.bg-circle-tr-purple",
        style: null,
        blocks: ["cards-listing"],
        defaultContent: [".flex-grid__heading"]
      },
      {
        id: "section-6",
        name: "Why GPE",
        selector: [".circle-card", "h1.heading.heading--primary"],
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["h1.heading.heading--primary"]
      },
      {
        id: "section-7",
        name: "Thought Leadership Articles",
        selector: ".flex-grid__wrap.m-centered.w-max-lg:not(.bg-circle-tr-purple):not(.bg-circle-tr-green)",
        style: null,
        blocks: ["cards-listing"],
        defaultContent: [".flex-grid__heading"]
      },
      {
        id: "section-8",
        name: "Customer Testimonials",
        selector: ".feature-glide",
        style: null,
        blocks: ["carousel-testimonial"],
        defaultContent: [".feature__heading"]
      },
      {
        id: "section-9",
        name: "Helping London Thrive",
        selector: ".flex-grid__wrap.bg-circle-tr-green",
        style: null,
        blocks: ["cards-listing"],
        defaultContent: [".flex-grid__heading"]
      },
      {
        id: "section-10",
        name: "Latest News",
        selector: ".news-glide",
        style: null,
        blocks: ["cards-listing"],
        defaultContent: [".heading.heading--primary.text-center"]
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-promo": parse2,
    "columns-banner": parse3,
    "embed-search": parse4,
    "cards-listing": parse5,
    "cards-feature": parse6,
    "carousel-testimonial": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            const cells = parser(block.element, { document, url, params });
            if (cells && cells.length > 0) {
              const blockTable = WebImporter.Blocks.createBlock(document, {
                name: block.name,
                cells
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
