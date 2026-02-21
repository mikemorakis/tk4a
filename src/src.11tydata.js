module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      const slug = data.page.fileSlug;
      if (!slug || slug === "index") return "/index.html";
      return `/${slug}.html`;
    }
  }
};
