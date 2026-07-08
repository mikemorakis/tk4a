/**
 * JSON-LD generators for glossary pages.
 *
 * CommonJS port of glossari/src/schema/jsonld.ts — usable from Eleventy filters
 * and data files. Pure functions: take a term + context, return plain objects
 * ready to JSON.stringify into a <script type="application/ld+json">.
 *
 * Re-port when glossari/src/schema/jsonld.ts changes upstream.
 */

function lang(term, ctx) {
  return term.inLanguage || ctx.defaultLanguage || 'el-GR';
}

function termUrl(term, ctx) {
  return `${ctx.siteUrl}/${ctx.glossaryRoot}/${term.slug}/`;
}

function categoryUrl(categorySlug, ctx) {
  return `${ctx.siteUrl}/${ctx.glossaryRoot}/${categorySlug}/`;
}

function authorRef(author, ctx) {
  return {
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    jobTitle: author.role,
    ...(author.url ? { url: `${ctx.siteUrl}${author.url}` } : {}),
    ...(author.image ? { image: `${ctx.siteUrl}${author.image}` } : {}),
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  };
}

function publisherRef(ctx) {
  return {
    '@type': 'Organization',
    name: ctx.publisher.name,
    url: ctx.publisher.url,
    ...(ctx.publisher.logo ? { logo: { '@type': 'ImageObject', url: `${ctx.siteUrl}${ctx.publisher.logo}` } } : {}),
  };
}

function imageRef(img, ctx) {
  const url = img.src.startsWith('http') ? img.src : `${ctx.siteUrl}${img.src}`;
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    width: img.width,
    height: img.height,
    ...(img.caption ? { caption: img.caption } : {}),
    ...(img.credit ? { creditText: img.credit } : {}),
  };
}

function definedTermSchema(term, ctx) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${termUrl(term, ctx)}#term`,
    name: term.term,
    description: term.definition,
    inLanguage: lang(term, ctx),
    dateModified: term.updatedAt + 'T00:00:00Z',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: ctx.setName,
      url: `${ctx.siteUrl}/${ctx.glossaryRoot}/`,
    },
    url: termUrl(term, ctx),
    ...(term.sameAs && term.sameAs.length > 0 ? { sameAs: term.sameAs } : {}),
    ...(term.synonyms && term.synonyms.length > 0 ? { alternateName: term.synonyms } : {}),
    ...(term.keywords && term.keywords.length > 0 ? { keywords: term.keywords.join(', ') } : {}),
  };
}

function approxWordCount(term) {
  const blob = [
    term.definition,
    term.whereUsed,
    ...(term.advantages || []),
    ...(term.mistakes || []),
    term.cost || '',
    term.whenItMakesSense || '',
    ...(term.faqs || []).flatMap((f) => [f.q, f.a]),
  ].join(' ');
  return blob.split(/\s+/).filter(Boolean).length;
}

function articleSchema(term, author, ctx) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${termUrl(term, ctx)}#article`,
    headline: term.h1,
    alternativeHeadline: term.metaTitle,
    description: term.metaDescription,
    inLanguage: lang(term, ctx),
    datePublished: term.publishedAt + 'T00:00:00Z',
    dateModified: term.updatedAt + 'T00:00:00Z',
    author: authorRef(author, ctx),
    publisher: publisherRef(ctx),
    mainEntityOfPage: term.reviewedBy
      ? {
          '@type': 'MedicalWebPage',
          '@id': termUrl(term, ctx),
          reviewedBy: {
            '@type': 'Person',
            name: term.reviewedBy.name,
            description: term.reviewedBy.credentials,
          },
          lastReviewed: term.reviewedBy.reviewedAt,
        }
      : { '@type': 'WebPage', '@id': termUrl(term, ctx) },
    ...(term.heroImage ? { image: imageRef(term.heroImage, ctx) } : {}),
    about: { '@id': `${termUrl(term, ctx)}#term` },
    ...(term.keywords && term.keywords.length > 0 ? { keywords: term.keywords.join(', ') } : {}),
    wordCount: approxWordCount(term),
    proficiencyLevel: 'Beginner',
    articleSection: term.category,
  };
}

function faqPageSchema(term, ctx) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${termUrl(term, ctx)}#faq`,
    inLanguage: lang(term, ctx),
    dateModified: term.updatedAt + 'T00:00:00Z',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.faq__q', '.faq__a', '.tldr__text'],
    },
    mainEntity: (term.faqs || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function howToSchema(term, ctx) {
  if (!term.steps || term.steps.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${termUrl(term, ctx)}#howto`,
    name: `Πώς γίνεται: ${term.term}`,
    description: term.definition,
    inLanguage: lang(term, ctx),
    ...(term.heroImage ? { image: imageRef(term.heroImage, ctx) } : {}),
    step: term.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.duration ? { performTime: s.duration } : {}),
    })),
  };
}

const PRICE_RX = /€\s*(\d{1,5}(?:[.,]\d+)?)/g;

function productSchema(term, ctx) {
  if (!term.cost || !term.priceAsOf) return null;
  const matches = [...term.cost.matchAll(PRICE_RX)].map((m) => parseFloat(m[1].replace(',', '.')));
  if (matches.length === 0) return null;

  const minPrice = Math.min(...matches);
  const maxPrice = matches.length > 1 ? Math.max(...matches) : undefined;

  const [year, month] = term.priceAsOf.split('-').map(Number);
  const valid = new Date(Date.UTC(year, month - 1 + 6, 1));
  const priceValidUntil = valid.toISOString().slice(0, 10);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${termUrl(term, ctx)}#product`,
    name: term.term,
    description: term.definition,
    inLanguage: lang(term, ctx),
    ...(term.heroImage ? { image: imageRef(term.heroImage, ctx) } : {}),
    category: term.category,
    offers:
      maxPrice && maxPrice !== minPrice
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: matches.length,
            priceValidUntil,
            availability: 'https://schema.org/InStock',
            seller: publisherRef(ctx),
          }
        : {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: minPrice,
            priceValidUntil,
            availability: 'https://schema.org/InStock',
            seller: publisherRef(ctx),
          },
  };
}

function tableSchema(term, ctx) {
  if (!term.comparisons || term.comparisons.length === 0) return null;
  return term.comparisons.map((c, i) => ({
    '@context': 'https://schema.org',
    '@type': 'Table',
    '@id': `${termUrl(term, ctx)}#comparison-${i}`,
    name: `${term.term} vs ${c.against}`,
    description: c.verdict || `Σύγκριση ${term.term} και ${c.against}.`,
    inLanguage: lang(term, ctx),
    about: { '@id': `${termUrl(term, ctx)}#term` },
  }));
}

function breadcrumbSchema(term, category, ctx, glossaryLabel = 'Γλωσσάρι') {
  const items = [
    { label: 'Αρχική', href: '/' },
    { label: glossaryLabel, href: `/${ctx.glossaryRoot}/` },
    { label: category.label, href: `/${ctx.glossaryRoot}/${category.slug}/` },
    { label: term.term },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${ctx.siteUrl}${c.href}` } : {}),
    })),
  };
}

function definedTermSetSchema(allTerms, ctx) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${ctx.siteUrl}/${ctx.glossaryRoot}/#set`,
    name: ctx.setName,
    url: `${ctx.siteUrl}/${ctx.glossaryRoot}/`,
    inLanguage: ctx.defaultLanguage || 'el-GR',
    publisher: publisherRef(ctx),
    hasDefinedTerm: allTerms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${termUrl(t, ctx)}#term`,
      name: t.term,
      url: termUrl(t, ctx),
    })),
  };
}

/** Bundle all applicable schemas for a term page. */
function termPageJsonLd(term, author, category, ctx, glossaryLabel) {
  const schemas = [
    definedTermSchema(term, ctx),
    articleSchema(term, author, ctx),
    faqPageSchema(term, ctx),
    breadcrumbSchema(term, category, ctx, glossaryLabel),
  ];
  const howto = howToSchema(term, ctx);
  if (howto) schemas.push(howto);
  const product = productSchema(term, ctx);
  if (product) schemas.push(product);
  const tables = tableSchema(term, ctx);
  if (tables) schemas.push(...tables);
  return schemas;
}

module.exports = {
  definedTermSchema,
  articleSchema,
  faqPageSchema,
  howToSchema,
  productSchema,
  tableSchema,
  breadcrumbSchema,
  definedTermSetSchema,
  termPageJsonLd,
};
