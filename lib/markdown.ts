// Simple markdown-to-HTML converter (no dependencies required)

interface MarkdownOptions {
  allowHtml?: boolean;
}

export function parseMarkdown(markdown: string, options: MarkdownOptions = {}): string {
  let html = markdown;

  // Escape HTML if not allowed
  if (!options.allowHtml) {
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Code blocks (```language\n...\n```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const languageClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${languageClass}>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br />');

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[hupob]|<li|<hr|<pre|<code|<img|<del|<strong|<em|<a )(.+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  // Line breaks
  html = html.replace(/\n\n/g, '\n');

  return html;
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/[#*`~>\[\]()!-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + '...';
}