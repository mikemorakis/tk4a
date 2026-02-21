module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/tk.logo.white.png");
  eleventyConfig.addPassthroughCopy("src/tkorthodontics.webp");
  eleventyConfig.addPassthroughCopy("src/dr.tsiotras.jpg");
  eleventyConfig.addPassthroughCopy("src/metalika.siderakia.jpg");
  eleventyConfig.addPassthroughCopy("src/keramika.siderakia.jpg");
  eleventyConfig.addPassthroughCopy("src/aoratoi.narthikes.jpg");
  eleventyConfig.addPassthroughCopy("src/kinitoi.michanismoi.jpg");
  eleventyConfig.addPassthroughCopy("src/ba-case1-before.jpg");
  eleventyConfig.addPassthroughCopy("src/ba-case1-after.jpg");
  eleventyConfig.addPassthroughCopy("src/ba-case2-before.jpg");
  eleventyConfig.addPassthroughCopy("src/ba-case2-after.jpg");

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
