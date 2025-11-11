import React, { useState } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`border border-input rounded-md overflow-hidden bg-background ${className}`}>
      {/* Header with Tabs */}
      <div className="bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'edit'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Edit3 size={14} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>

          {/* Markdown Quick Reference */}
          {activeTab === 'edit' && (
            <div className="hidden sm:flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="font-semibold">Quick ref:</span>
              <span className="px-2 py-0.5 bg-background rounded border border-border">**bold**</span>
              <span className="px-2 py-0.5 bg-background rounded border border-border">*italic*</span>
              <span className="px-2 py-0.5 bg-background rounded border border-border"># Heading</span>
              <span className="px-2 py-0.5 bg-background rounded border border-border">[link](url)</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ minHeight }}>
        {activeTab === 'edit' ? (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-background text-foreground resize-none focus:outline-none focus:ring-0"
            style={{ minHeight }}
          />
        ) : (
          <div className="w-full h-full p-4 overflow-y-auto" style={{ minHeight }}>
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Eye size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No content to preview</p>
                  <p className="text-xs mt-1">Switch to Edit tab to start writing</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
