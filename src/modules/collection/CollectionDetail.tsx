import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetCollectionQuery, useRemoveStoryFromCollectionMutation } from '../../redux/api/collectionApi';
import { Button } from '../../components/common/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FolderOpen, ChevronLeft, Edit, Trash2, Book, User, Calendar, Globe, Users } from 'lucide-react';
import CreateCollectionModal from './CreateCollectionModal';

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: collection, isLoading, error } = useGetCollectionQuery(id || '');
  const [removeStory] = useRemoveStoryFromCollectionMutation();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">Loading collection...</div>;
  if (error || !collection) return <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">Collection not found or error loading.</div>;

  const isOwner = currentUser?.userId === collection.userId;

  const handleRemoveStory = async (storyId: string) => {
    if (window.confirm('Remove this story from collection?')) {
      await removeStory({ collectionId: collection.id, storyId });
    }
  };

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
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <FolderOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{collection.name}</h1>
                </div>
                <p className="text-muted-foreground mb-4">{collection.description || 'No description'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <User size={14} />
                    By {collection.author?.username}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(collection.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Book size={14} />
                    {collection.stories?.length || 0} {collection.stories?.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {collection.isPublic && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs dark:bg-green-900 dark:text-green-200">
                      <Globe size={12} />
                      Public
                    </span>
                  )}
                  {collection.isCollaborative && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs dark:bg-blue-900 dark:text-blue-200">
                      <Users size={12} />
                      Collaborative
                    </span>
                  )}
                </div>
              </div>
              {isOwner && (
                <Button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Collection
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            Stories
          </h2>
          {collection.stories?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Book className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No stories yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Start adding stories to this collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {collection.stories?.map((story: any) => (
                <div key={story.id} className="bg-card rounded-xl border border-border hover:shadow-md transition-shadow p-5 flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/read-story/${story.id}`} className="group">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{story.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User size={12} />
                      <span>By {story.author?.username}</span>
                    </div>
                  </div>
                  {isOwner && (
                    <button 
                      onClick={() => handleRemoveStory(story.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Collection Modal */}
        <CreateCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          collection={collection}
        />
      </div>
    </div>
  );
};

export default CollectionDetail;
