import React, { useState } from 'react';
import { useGetUserPublicCollectionsQuery } from '../../redux/api/collectionApi';
import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

interface UserCollectionsProps {
  username: string;
}

const UserCollections: React.FC<UserCollectionsProps> = ({ username }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUserPublicCollectionsQuery({ username, page, perPage: 6 });

  if (isLoading) return <div className="text-sm text-gray-500">Loading collections...</div>;

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <FolderOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
        <p>No public collections yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.data.map((collection) => (
          <Link
            key={collection.id}
            to={`/collection/${collection.id}`}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{collection.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
              {collection.description || 'No description'}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{collection.storyCount || 0} stories</span>
              {collection.isCollaborative && (
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
                  Collaborative
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {data.meta.lastPage > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50 rounded"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {data.meta.lastPage}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.meta.lastPage}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50 rounded"
          >
            Next
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <Link
          to="/discover-collections"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Discover more collections &rarr;
        </Link>
      </div>
    </div>
  );
};

export default UserCollections;
