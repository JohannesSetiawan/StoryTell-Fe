import React, { useState } from 'react';
import { useGetAllTagsQuery } from '../../redux/api/tagApi';
import { TagBadge } from '../common/TagBadge';

interface TagFilterProps {
  selectedTagIds: string[];
  onFilterChange: (tagIds: string[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ selectedTagIds, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: tagsData, isLoading } = useGetAllTagsQuery({
    page: 1,
    limit: 100,
    category: categoryFilter || undefined,
  });

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onFilterChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onFilterChange([...selectedTagIds, tagId]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  const selectedTags = tagsData?.data.filter(tag => selectedTagIds.includes(tag.id)) || [];
  const categories = Array.from(new Set(tagsData?.data.map(tag => tag.category) || []));

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filter by Tags
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active Filters ({selectedTags.length})
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                variant="selected"
                onRemove={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Expanded Tag Selection */}
      {isExpanded && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Tags
            </label>
            {isLoading ? (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                Loading tags...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {tagsData?.data
                  .filter(tag => !selectedTagIds.includes(tag.id))
                  .map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
