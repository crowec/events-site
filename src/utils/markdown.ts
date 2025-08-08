import { marked } from 'marked';

// Configure marked for security and styling
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Custom renderer to add classes and prevent XSS
const renderer = new marked.Renderer();

// Override link rendering to add security attributes
renderer.link = (href: string, title: string | null, text: string) => {
  // Only allow safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:'];
  const url = new URL(href, 'https://example.com'); // Safe parsing
  
  if (!safeProtocols.includes(url.protocol)) {
    return text; // Return text without link if protocol is unsafe
  }
  
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

// Override paragraph rendering to add classes
renderer.paragraph = (text: string) => {
  return `<p class="markdown-paragraph">${text}</p>`;
};

// Override strong/bold rendering
renderer.strong = (text: string) => {
  return `<strong class="markdown-bold">${text}</strong>`;
};

// Override emphasis/italic rendering
renderer.em = (text: string) => {
  return `<em class="markdown-italic">${text}</em>`;
};

// Override list rendering
renderer.list = (body: string, ordered: boolean) => {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag} class="markdown-list">${body}</${tag}>`;
};

renderer.listitem = (text: string) => {
  return `<li class="markdown-list-item">${text}</li>`;
};

marked.use({ renderer });

/**
 * Safely render markdown to HTML
 */
export const renderMarkdown = (markdown: string): string => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }
  
  try {
    // Parse markdown
    const html = marked.parse(markdown);
    
    // Basic XSS prevention - remove potentially dangerous tags
    const dangerousTags = /<script[\s\S]*?<\/script>|<iframe[\s\S]*?<\/iframe>|<object[\s\S]*?<\/object>|<embed[\s\S]*?<\/embed>/gi;
    const safeHtml = html.replace(dangerousTags, '');
    
    return safeHtml;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return markdown; // Return original text if parsing fails
  }
};

/**
 * Check if text contains markdown formatting
 */
export const hasMarkdownFormatting = (text: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Simple check for common markdown patterns
  const markdownPatterns = [
    /\*\*.*\*\*/,  // Bold
    /\*.*\*/,      // Italic
    /^#+\s/m,      // Headers
    /^\s*[-*+]\s/m, // Lists
    /\[.*\]\(.*\)/, // Links
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
};