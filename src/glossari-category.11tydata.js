/**
 * Sidecar for glossari-category.njk — generates one page per category.
 */
module.exports = {
  eleventyComputed: {
    termsInCategory: (data) => {
      if (!data.category) return [];
      return data.glossary.terms.filter((t) => t.category === data.category.slug);
    },
  },
};
