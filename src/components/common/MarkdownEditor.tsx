import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here using Markdown...',
  className = '',
  minHeight = '400px',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`border border-input rounded-md overflow-hidden bg-background ${className}`}>
      <div className="bg-muted/50 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span className="font-semibold">Markdown Formatting:</span>
          <span className="px-2 py-1 bg-background rounded border border-border">**bold**</span>
          <span className="px-2 py-1 bg-background rounded border border-border">*italic*</span>
          <span className="px-2 py-1 bg-background rounded border border-border"># Heading</span>
          <span className="px-2 py-1 bg-background rounded border border-border">[link](url)</span>
          <span className="px-2 py-1 bg-background rounded border border-border">- list</span>
        </div>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-4 bg-background text-foreground resize-none focus:outline-none focus:ring-0"
        style={{ minHeight }}
      />
    </div>
  );
};
