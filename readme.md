# Quranic IQ Learning Platform 🌟

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fquraniciq.com)](https://quraniciq.com)
[![Made with Eleventy](https://img.shields.io/badge/Made%20with-Eleventy-1f425f.svg)](https://www.11ty.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Transform your Quranic learning journey with our comprehensive online platform. Learn Quran with Tajweed, memorization techniques, and Islamic studies from certified teachers.

## 🎯 About The Project

Quranic IQ is a modern, accessible platform dedicated to making Quranic education available to everyone worldwide. Our platform combines traditional Islamic teaching methods with cutting-edge technology to provide an immersive learning experience.

### ✨ Key Features

- **Online Quran Classes**: One-on-one sessions with certified teachers
- **Flexible Learning**: Schedule classes at your convenience
- **Comprehensive Courses**: From basic Quran reading to advanced Tajweed
- **Progress Tracking**: Monitor your learning journey
- **Mobile-Friendly**: Learn anywhere, anytime
- **Interactive Content**: Engaging learning materials and resources
- **Multi-Language Support**: Learn in your preferred language

## 🛠️ Technical Stack

- **Static Site Generator**: [11ty (Eleventy)](https://www.11ty.dev/)
- **Templating**: Nunjucks
- **Styling**: Custom CSS
- **JavaScript**: Vanilla JS
- **Markdown Processing**: Markdown-it with custom plugins
- **Build & Deploy**: GitHub Actions
- **Hosting**: GitHub Pages
- **SEO**: Custom Schema.org implementation
- **RSS**: Eleventy RSS plugin
- **Sitemap**: Eleventy Sitemap plugin

## 📚 Content Structure

```text
src/
├── _data/         # Site data files
├── _includes/     # Template partials
├── posts/         # Blog posts
├── images/        # Image assets
└── pages/         # Static pages
```

## 🚀 Getting Started

### Windows Prerequisites

To run this project on Windows, you will need the following tools installed:

1. **Git**: Install [Git for Windows](https://gitforwindows.org/) to clone and manage branches.
2. **Node.js**: Install [Node.js](https://nodejs.org/) (v18.x or higher is recommended; v14 or higher is supported).
3. **Command Line Interface (CLI)**: We highly recommend using **Git Bash** (installed with Git for Windows), but you can also use **PowerShell** or **Command Prompt (cmd)**.

---

### Windows Cloning & Installation

Follow these steps to clone and run the project locally on your Windows machine:

1. **Open Git Bash** (or your preferred terminal).
2. **Clone the repository**:
   ```bash
   git clone https://github.com/bilal-512/Alhadi.git
   ```
3. **Navigate into the project directory**:
   ```bash
   cd Alhadi
   ```
4. **Install all dependencies**:
   ```bash
   npm install
   ```
5. **Start the local development server**:
   ```bash
   npm run start
   ```
   *Note: This command spins up the Eleventy live-reload server. You can view the live site in your browser at `http://localhost:8080` (or the port outputted in the console).*
6. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🤝 Contributing & Branching Workflow

We welcome and encourage community contributions! If you want to propose changes, add features, or publish a blog, please follow this branching workflow:

1. **Ensure your main branch is up-to-date**:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a new branch** for your specific changes:
   ```bash
   git checkout -b <your-branch-name>
   ```
   *Naming Conventions:*
   - For blog posts: `blog/your-blog-slug` (e.g., `blog/benefits-of-tajweed`)
   - For features: `feature/your-feature-name` (e.g., `feature/contact-page-fix`)
   - For bug fixes: `bugfix/issue-description` (e.g., `bugfix/broken-link`)
3. **Make your changes** in the codebase and test them locally using `npm run start`.
4. **Stage and commit your changes**:
   ```bash
   git add .
   git commit -m "Brief but descriptive commit message"
   ```
5. **Push your branch to GitHub**:
   ```bash
   git push -u origin <your-branch-name>
   ```
6. **Open a Pull Request (PR)**: Go to the GitHub repository page and open a Pull Request from your branch to the `main` branch.

---

## ✍️ How to Publish a Blog

If you would like to submit a blog post, it must follow the structure below to be approved and merged.

### 📂 File Location & Naming

1. **Target Folder**: All blog posts must be placed inside the `src/posts/` directory:
   - [src/posts/](file:///home/bilal/Desktop/Project/QuranicIq/Alhadi/src/posts)
2. **Filename Format**: The file must be named using the date and slug format:
   - `YYYY-MM-DD-blog-slug.md` (e.g., `2026-06-20-how-to-learn-tajweed-online.md`)

---

### 📝 Blog Post Format

Every blog post must be written in **Markdown** and include a **YAML Frontmatter** block at the very top.

#### 1. YAML Frontmatter Template
Copy and paste this template at the top of your markdown file, filling in your post's details:

```yaml
---
layout: layouts/post.njk
title: "Your Blog Post Title"
description: "A short, engaging summary of the post (1-2 sentences) used for search engine snippets and the post excerpt."
category: "Quran Learning" # Example categories: Quran Learning, Tajweed, Islamic Education, Spiritual Growth
date: 2026-06-20T00:00:00.000Z # The publication date in ISO format
icon: "fas fa-book" # FontAwesome icon class for the post metadata header
tags:
  - quran-learning
  - spiritual-growth
  - tajweed
image: "https://quraniciq.com/images/quran-comfort.png" # Featured image URL
author: "Your Name" # Optional: defaults to the site's default author
---
```

#### 2. Writing the Markdown Body
Follow these formatting rules when writing your blog post:
- ❌ **Do NOT include a `# H1` Heading at the top**: The `layouts/post.njk` layout template automatically renders the `title` frontmatter field as the main `<h1>` header of the page.
- ⚡ **Use H2 (`##`) and H3 (`###`) for headings**: Use proper hierarchy to structure your sections. These headings are automatically scanned to populate the **Table of Contents (TOC)** widget.
- 🖼️ **Optimize Images**: If your post references custom images, save them in the `/images/` directory and keep them optimized for fast web loading.

#### 3. Automatic Schema & Metadata Generation
Our build system features an automated script (`scripts/addBlogSchema.js`) that reads post markdown and appends SEO-friendly structured schema (JSON-LD), word counts, reading time, and related posts to the frontmatter. 
- You do **not** need to write the `schema:` block manually.
- Running `npm run start` or `npm run watch` will automatically update the frontmatter of your newly created blog file to include these fields before building!

---

## 🌐 SEO Features

- **Schema.org Integration**: Rich snippets for better search visibility
- **Meta Tags**: Optimized meta descriptions and titles
- **Open Graph**: Social media sharing optimization
- **Sitemap**: Automated sitemap generation
- **RSS Feed**: Syndication support
- **Canonical URLs**: Proper URL management
- **Structured Data**: Enhanced search engine understanding


## 📈 Analytics and Monitoring

- Google Analytics integration
- Performance monitoring
- User behavior tracking
- Content effectiveness analysis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Website: [https://quraniciq.com](https://quraniciq.com)
- Email: [contact@quraniciq.com](mailto:contact@quraniciq.com)
- Twitter: [@QuranicIQ](https://twitter.com/QuranicIQ)

## 🙏 Acknowledgments

- Our dedicated teachers and students
- The open-source community
- All contributors and supporters

---

<div align="center">
Made with ❤️ for the Muslim Ummah
</div>