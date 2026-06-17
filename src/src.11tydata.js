module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const slug = data.page.fileSlug;
      if (!slug || slug === "index") return "/index.html";
      return `/${slug}.html`;
    },
    breadcrumbs: (data) => {
      if (data.breadcrumbs) return data.breadcrumbs;
      if (data.isHome) return null;
      if (!data.page || !data.page.url) return null;
      if (data.page.url === "/" || data.page.url === "/index.html") return null;
      const rawTitle = data.title || data.page.fileSlug || "";
      const name = rawTitle.split(" | ")[0].split(" — ")[0].trim() || data.page.fileSlug;
      return [
        { name: "Αρχική", url: "/" },
        { name }
      ];
    }
  }
};
