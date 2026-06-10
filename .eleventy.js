const jsonld = require('./lib/glossari/jsonld');
const { slugify, stripAccents } = require('./lib/glossari/slug');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.webp");
  eleventyConfig.addPassthroughCopy("src/**/*.avif");
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear().toString());

  // ──────── Glossari filters ────────

  /** Resolve author by slug. */
  eleventyConfig.addFilter("authorBySlug", function (authorSlug) {
    const all = this.ctx?.glossary?.authors || this.ctx?.environments?.glossary?.authors;
    if (!all) return null;
    return all.find((a) => a.slug === authorSlug) || null;
  });

  /** Resolve category by slug. */
  eleventyConfig.addFilter("categoryBySlug", function (categorySlug) {
    const all = this.ctx?.glossary?.categories || this.ctx?.environments?.glossary?.categories;
    if (!all) return null;
    return all.find((c) => c.slug === categorySlug) || null;
  });

  /** Build the JSON-LD bundle for a term page. */
  eleventyConfig.addFilter("termJsonLd", function (term) {
    const { authors, categories, ctx } = this.ctx.glossary;
    const author = authors.find((a) => a.slug === term.author);
    const category = categories.find((c) => c.slug === term.category);
    if (!author || !category) return [];
    return jsonld.termPageJsonLd(term, author, category, ctx);
  });

  /** JSON-LD for the glossary root (DefinedTermSet). Pass the terms array as input. */
  eleventyConfig.addFilter("glossarySetJsonLd", function (terms) {
    const ctx = this.ctx.glossary.ctx;
    return jsonld.definedTermSetSchema(terms, ctx);
  });

  /** Terms in same category, excluding current. */
  eleventyConfig.addFilter("sameCategory", function (term, limit = 6) {
    const all = this.ctx.glossary.terms;
    return all
      .filter((t) => t.category === term.category && t.slug !== term.slug)
      .slice(0, limit);
  });

  /** First sentence of a string. */
  eleventyConfig.addFilter("firstSentence", function (text) {
    if (!text) return '';
    const m = text.match(/^[^.!?]+[.!?]/);
    return (m ? m[0] : text).trim();
  });

  /** Group terms by category — for index page. */
  eleventyConfig.addFilter("groupByCategory", function (terms, categories) {
    return categories
      .map((cat) => ({
        category: cat,
        items: terms.filter((t) => t.category === cat.slug),
      }))
      .filter((g) => g.items.length > 0);
  });

  /** Strip Greek accents for search/comparison. */
  eleventyConfig.addFilter("stripAccents", stripAccents);

  /** Greeklish slug. */
  eleventyConfig.addFilter("slugify", slugify);

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
