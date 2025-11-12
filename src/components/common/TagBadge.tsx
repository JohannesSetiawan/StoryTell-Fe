import React from 'react';

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
  variant?: 'default' | 'selected';
}

export const TagBadge: React.FC<TagBadgeProps> = ({ name, onRemove, variant = 'default' }) => {
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors";
  const variantClasses = variant === 'selected' 
    ? "bg-blue-500 text-white" 
    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${name} tag`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
