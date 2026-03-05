module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const slug = data.page.fileSlug;
      if (!slug || slug === "index") return "/index.html";
      return `/${slug}.html`;
    }
  }
};
