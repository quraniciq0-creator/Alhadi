const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // ...existing code...
  // Add extractHeadings filter
  eleventyConfig.addFilter("extractHeadings", function (content) {
    // Extracts all Markdown or HTML headings (h1-h6) from content and generates anchor IDs
    const headings = [];
    // HTML headings
    for (const m of String(content).matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi)) {
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      headings.push({ text, id, level: m[1] });
    }
    // Markdown headings
    for (const m of String(content).matchAll(/^#{1,6} (.*)$/gm)) {
      const text = m[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      // Level is not available for markdown, default to 2
      headings.push({ text, id, level: 2 });
    }
    return headings;
  });
  // Add hasHeadings filter
  eleventyConfig.addFilter("hasHeadings", function (content) {
    // Checks for at least one Markdown or HTML heading (h1-h6)
    return /<h[1-6][^>]*>|^# .+/m.test(content);
  });
  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Add Sitemap plugin
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: "https://quraniciq.com",
    },
  });

  // Configure Markdown
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };

  const md = markdownIt(markdownItOptions)
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      permalink: false,
      slugify: s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    });
  eleventyConfig.setLibrary("md", md);

  // Copy static files
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.png");
  eleventyConfig.addPassthroughCopy("*.svg");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Add date filter
  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  // Add excerpt filter
  eleventyConfig.addFilter("excerpt", function (content) {
    return content.substr(0, 150) + "...";
  });

  // Add reading time filter
  eleventyConfig.addFilter("readingTime", function (content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  });

  // Add slug filter
  eleventyConfig.addFilter("slug", function (str) {
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^a-z0-9\-]/g, '')    // Remove all non-alphanumeric except -
      .replace(/-+/g, '-')             // Replace multiple - with single -
      .replace(/^-+|-+$/g, '');        // Trim - from start/end
  });

  // Add striptags filter
  eleventyConfig.addFilter("striptags", function (str) {
    return String(str).replace(/<[^>]*>/g, '');
  });

  // Add category filter
  eleventyConfig.addFilter("filterByCategory", function (posts, category) {
    if (!category || category === "all") {
      return posts;
    }
    return posts.filter(post => post.data.tags && post.data.tags.includes(category));
  });

  // Add collection for blog posts
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Add collection for categories
  eleventyConfig.addCollection("categories", function (collection) {
    const posts = collection.getFilteredByGlob("src/posts/**/*.md");
    const categories = new Set();

    posts.forEach(post => {
      if (post.data.category) {
        categories.add(post.data.category);
      }
    });

    return Array.from(categories);
  });

  // Add tagsList data function
  eleventyConfig.addGlobalData("tagsList", function () {
    return ["Quran", "Spiritual Growth", "Mental Health", "Daily Practice", "Tajweed", "Quran Recitation", "Arabic Pronunciation", "Islamic Learning", "tajweed", "quran-recitation", "islamic-education", "pronunciation"];
  });

  eleventyConfig.addFilter("getAllTags", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      if (item.data.tags) {
        let tags = Array.isArray(item.data.tags) ? item.data.tags : [item.data.tags];
        tags.forEach(tag => {
          if (tag !== "post" && tag !== "tagPage") {
            tagSet.add(tag);
          }
        });
      }
    });
    return Array.from(tagSet);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};