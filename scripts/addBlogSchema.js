const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');

function generateSchema(frontmatter, filepath) {
    // Validate required properties
    if (!frontmatter.title || !frontmatter.author || !frontmatter.date || !frontmatter.description) {
        throw new Error('Missing required frontmatter properties');
    }

    const slug = path.basename(filepath, '.md');

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": frontmatter.title || '',
        "author": {
            "@type": "Person",
            "name": frontmatter.author || ''
        },
        "datePublished": frontmatter.date || '',
        "description": frontmatter.description || '',
        "keywords": Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        "articleSection": frontmatter.category || '',
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://alhadi.com/posts/${slug}`
        }
    };
}

function addSchemaToPost(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const { data, content: markdown } = matter(content);

        if (!data.schema) {
            const schema = generateSchema(data, filepath);
            if (schema) {
                data.schema = schema;
                const newContent = matter.stringify(markdown, data);
                fs.writeFileSync(filepath, newContent);
                console.log(`Added schema to ${filepath}`);
            }
        }
    } catch (error) {
        console.error(`Error processing ${filepath}:`, error.message);
    }
}

const watcher = chokidar.watch(`${POSTS_DIR}/[0-9]*.md`, {
    persistent: true,
    ignoreInitial: false
});

watcher
    .on('add', addSchemaToPost)
    .on('change', addSchemaToPost);

console.log('Watching for new blog posts...');