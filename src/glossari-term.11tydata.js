/**
 * Sidecar data for glossari-term.njk — computes jsonLd, author, category, sameCategory
 * via JS (these need access to the term + glossary registries).
 */
const jsonld = require('../lib/glossari/jsonld');

module.exports = {
  eleventyComputed: {
    author: (data) => {
      if (!data.term) return null;
      return data.glossary.authors.find((a) => a.slug === data.term.author) || null;
    },
    category: (data) => {
      if (!data.term) return null;
      return data.glossary.categories.find((c) => c.slug === data.term.category) || null;
    },
    sameCategory: (data) => {
      if (!data.term) return [];
      return data.glossary.terms
        .filter((t) => t.category === data.term.category && t.slug !== data.term.slug)
        .slice(0, 6);
    },
    jsonLd: (data) => {
      if (!data.term) return null;
      const author = data.glossary.authors.find((a) => a.slug === data.term.author);
      const category = data.glossary.categories.find((c) => c.slug === data.term.category);
      if (!author || !category) return [];
      return jsonld.termPageJsonLd(data.term, author, category, data.glossary.ctx);
    },
  },
};
