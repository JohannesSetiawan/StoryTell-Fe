import React, { useState } from 'react';
import { useGetAllTagsQuery } from '../../redux/api/tagApi';
import { TagBadge } from '../common/TagBadge';

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ 
  selectedTagIds, 
  onTagsChange,
  disabled = false 
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: tagsData, isLoading } = useGetAllTagsQuery({
    page: 1,
    limit: 100,
    category: categoryFilter || undefined,
    name: searchTerm || undefined,
  });

  const toggleTag = (tagId: string) => {
    if (disabled) return;
    
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTagIds.filter(id => id !== tagId));
  };

  const selectedTags = tagsData?.data.filter(tag => selectedTagIds.includes(tag.id)) || [];
  const availableTags = tagsData?.data.filter(tag => !selectedTagIds.includes(tag.id)) || [];

  // Get unique categories
  const categories = Array.from(new Set(tagsData?.data.map(tag => tag.category) || []));

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Tags ({selectedTags.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                variant="selected"
                onRemove={disabled ? undefined : () => removeTag(tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Tags
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={disabled}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Available Tags
        </label>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading tags...</div>
        ) : availableTags.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter ? 'No tags found matching filters' : 'No more tags available'}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                disabled={disabled}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
