import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose dark:prose-invert max-w-none break-words ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 break-words" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3 break-words" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2 break-words" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mt-3 mb-2 break-words" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-base font-semibold mt-2 mb-1 break-words" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-sm font-semibold mt-2 mb-1 break-words" {...props} />,
          
          // Paragraph styles
          p: ({ node, ...props }) => <p className="mb-4 leading-relaxed break-words" {...props} />,
          
          // List styles
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          
          // Link styles
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          
          // Pre styles (for code blocks)
          pre: ({ node, ...props }) => (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4 max-w-full" {...props} />
          ),
          
          // Code styles
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono break-words whitespace-pre-wrap" {...props}>
                {children}
              </code>
            ) : (
              <code className={`block font-mono text-sm whitespace-pre-wrap break-words ${className}`} {...props}>
                {children}
              </code>
            );
          },
          
          // Blockquote styles
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
          
          // Strong/Bold
          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          
          // Emphasis/Italic
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          
          // Table styles (GFM)
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full border-collapse border border-border" {...props} />
              </div>
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border border-border px-2 sm:px-4 py-2 text-left font-semibold text-sm whitespace-nowrap" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border border-border px-2 sm:px-4 py-2 text-sm break-words" {...props} />,
          
          // Strikethrough (GFM)
          del: ({ node, ...props }) => <del className="line-through text-muted-foreground" {...props} />,
          
          // Task list items (GFM)
          input: ({ node, ...props }) => (
            <input className="mr-2 align-middle" disabled {...props} />
          ),
          
          // Image styles
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto rounded-md my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
