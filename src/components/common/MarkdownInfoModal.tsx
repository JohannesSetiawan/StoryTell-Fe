import React from 'react';
import { X, Info } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MarkdownInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const markdownExample = `# Markdown Formatting Guide

## Basic Formatting

### Text Styling
- **Bold text** using \`**text**\` or \`__text__\`
- *Italic text* using \`*text*\` or \`_text_\`
- ***Bold and italic*** using \`***text***\`
- ~~Strikethrough~~ using \`~~text~~\`

### Headers
Use \`#\` for headers (1-6 levels):
\`\`\`
# Heading 1
## Heading 2
### Heading 3
\`\`\`

### Links and Images
- [Link text](https://example.com)
- ![Image alt text](image-url.jpg)

### Lists

**Unordered list:**
- Item 1
- Item 2
  - Nested item
  - Another nested item

**Ordered list:**
1. First item
2. Second item
3. Third item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Quotes
> This is a blockquote
> It can span multiple lines

### Code

Inline code: \`const example = "code"\`

Code blocks:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Horizontal Rule
Use \`---\` or \`***\` for a horizontal line:

---

### Escape Characters
Use backslash \`\\\` to escape special characters: \\* \\_ \\# \\[
`;

export const MarkdownInfoModal: React.FC<MarkdownInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Markdown Formatting Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>GitHub Flavored Markdown (GFM)</strong> is supported. Use these formatting options to make
                your content more engaging and readable.
              </p>
            </div>

            {/* Split view: Raw markdown on left, rendered on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Raw Markdown */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Markdown Syntax
                </h3>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">{markdownExample}</pre>
                </div>
              </div>

              {/* Rendered Markdown */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Preview
                </h3>
                <div className="bg-background border border-border p-4 rounded-lg overflow-x-auto">
                  <MarkdownRenderer content={markdownExample} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <p>
              <strong>Pro tip:</strong> You can preview your formatted content in real-time using the editor's preview
              mode. Experiment with different syntax to create beautifully formatted stories and chapters!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
