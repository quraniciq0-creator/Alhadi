const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const matter = require('gray-matter');
const readingTime = require('reading-time');

// Define blog post directories
const POSTS_DIRS = [
    path.join(__dirname, '..', 'blogposts'),
    path.join(__dirname, '..', '_site', 'posts')
];

function calculateReadingTime(content) {
    const stats = readingTime(content);
    return Math.ceil(stats.minutes);
}

function generateSchema(frontmatter, content, filepath) {
    const slug = path.basename(filepath, '.md');
    const readingTimeMinutes = calculateReadingTime(content);
    const blogUrl = frontmatter.canonical_url || `https://quraniciq.com/blog/${slug}`;

    // Use summary as description if available
    const description = frontmatter.summary || frontmatter.description || '';

    // Extract headings for article structure
    const headings = content.match(/^#+\s+(.+)$/gm) || [];
    const articleStructure = headings.map(h => {
        const level = (h.match(/^#+/)[0] || '').length;
        const text = h.replace(/^#+\s+/, '');
        return { level, text };
    });

    // Calculate content complexity
    const wordCount = content.split(/\s+/).length;
    const complexityScore = Math.min(Math.ceil(wordCount / 200), 10); // 1-10 scale

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": frontmatter.title,
        "description": description,
        "datePublished": frontmatter.date,
        "dateModified": frontmatter.lastModified || frontmatter.date,
        "timeRequired": `PT${readingTimeMinutes}M`,
        "keywords": frontmatter.keywords || frontmatter.tags || [],
        "url": blogUrl,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": blogUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "Quranic IQ Center",
            "url": "https://quraniciq.com"
        },
        "author": {
            "@type": "Person",
            "name": frontmatter.author || "Quranic IQ Team",
            "url": frontmatter.authorUrl || "https://quraniciq.com/team"
        },
        "about": {
            "@type": "Thing",
            "name": frontmatter.tags?.[0] || "Islamic Education",
            "description": description
        },
        "articleSection": frontmatter.category || "Islamic Education",
        "wordCount": wordCount,
        "contentComplexity": {
            "@type": "PropertyValue",
            "name": "Content Complexity Score",
            "value": complexityScore,
            "minValue": 1,
            "maxValue": 10
        },
        "articleStructure": articleStructure,
        "relatedContent": (frontmatter.relatedPosts || []).map(post => ({
            "@type": "BlogPosting",
            "url": `https://quraniciq.com/blog/${post}`,
            "name": post.replace(/-/g, ' ').replace(/^\d{4}-\d{2}-\d{2}-/, '')
        }))
    };

    // Only add image if it exists
    if (frontmatter.image) {
        schema.image = {
            "@type": "ImageObject",
            "url": frontmatter.image
        };
    }

    // Add clean article body without markdown
    schema.articleBody = content.replace(/[#*`]/g, '').trim();

    return schema;
}

function findRelatedPosts(currentTags, allPosts) {
    return allPosts
        .filter(post => {
            const postTags = matter(fs.readFileSync(post, 'utf8')).data.tags || [];
            return postTags.some(tag => currentTags.includes(tag)) && !post.endsWith('index.md');
        })
        .map(post => path.basename(post, '.md'))
        .slice(0, 3); // Limit to 3 related posts
}

function addSchemaToPost(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const { data: frontmatter, content: markdown } = matter(content);

        // Find related posts based on tags
        const currentTags = frontmatter.tags || [];
        const allPosts = POSTS_DIRS.reduce((posts, dir) => {
            if (fs.existsSync(dir)) {
                return posts.concat(
                    fs.readdirSync(dir)
                        .filter(file => file.endsWith('.md'))
                        .map(file => path.join(dir, file))
                        .filter(post => post !== filepath)
                );
            }
            return posts;
        }, []);

        frontmatter.relatedPosts = findRelatedPosts(currentTags, allPosts);

        // Calculate complexity metrics
        const wordCount = markdown.split(/\s+/).length;
        frontmatter.wordCount = wordCount;
        frontmatter.readingTime = calculateReadingTime(markdown);
        frontmatter.contentComplexity = Math.min(Math.ceil(wordCount / 200), 10);

        // Add or update last modified date
        frontmatter.lastModified = new Date().toISOString().split('T')[0];

        // Generate and update schema
        const schema = generateSchema(frontmatter, markdown, filepath);
        frontmatter.schema = schema;

        const newContent = matter.stringify(markdown, frontmatter);
        fs.writeFileSync(filepath, newContent);
        console.log(`Updated schema for ${filepath}`);

    } catch (error) {
        console.error(`Error processing ${filepath}:`, error.message);
    }
}

// Process all existing posts first
POSTS_DIRS.forEach(dir => {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    files.forEach(file => {
        const filepath = path.join(dir, file);
        addSchemaToPost(filepath);
    });
});

// Watch for changes
POSTS_DIRS.forEach(dir => {
    const watcher = chokidar.watch(`${dir}/**/*.md`, {
        persistent: true,
        ignoreInitial: false
    });

    watcher
        .on('add', addSchemaToPost)
        .on('change', addSchemaToPost);
});

console.log('Watching for blog post changes...');