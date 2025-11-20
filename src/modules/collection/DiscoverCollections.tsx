import React, { useState } from 'react';
import { useGetDiscoverCollectionsQuery } from '../../redux/api/collectionApi';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, FolderOpen, Book, User, Users, ChevronLeft } from 'lucide-react';

const DiscoverCollections: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetDiscoverCollectionsQuery({ page, perPage: 12 });

  const navigate = useNavigate();

  if (isLoading) return <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">Loading collections...</div>;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Compass className="h-8 w-8 text-primary" />
            Discover Collections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore curated story collections from the community
          </p>
        </div>
      
      {data?.data.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Compass className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No public collections yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to create a public collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((collection) => (
            <Link 
              key={collection.id} 
              to={`/collection/${collection.id}`}
              className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all group block p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <FolderOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{collection.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {collection.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1">
                  <User size={14} />
                  {collection.author?.username}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Book size={14} />
                  {collection.storyCount || 0} {collection.storyCount === 1 ? 'story' : 'stories'}
                </span>
              </div>
              {collection.isCollaborative && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs dark:bg-blue-900 dark:text-blue-200">
                  <Users size={12} />
                  Collaborative
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {data && data.meta.lastPage > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {page} of {data.meta.lastPage}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.meta.lastPage}
            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default DiscoverCollections;
