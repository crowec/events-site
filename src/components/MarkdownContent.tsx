import { renderMarkdown, hasMarkdownFormatting } from '../utils/markdown';
import './MarkdownContent.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent = ({ content, className = '' }: MarkdownContentProps) => {
  // If no markdown formatting is detected, render as plain text
  if (!hasMarkdownFormatting(content)) {
    return (
      <div className={className}>
        <p>{content}</p>
      </div>
    );
  }

  // Render markdown content
  const htmlContent = renderMarkdown(content);

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownContent;