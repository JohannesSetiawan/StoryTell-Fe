import React, { useState } from 'react';
import { useGetUserCollectionsQuery, useDeleteCollectionMutation } from '../../redux/api/collectionApi';
import CreateCollectionModal from './CreateCollectionModal';
import { Collection } from '../../redux/types/collection';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Edit, Trash2, Book, ChevronLeft, Globe, Users } from 'lucide-react';

const CollectionList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUserCollectionsQuery({ page, perPage: 10 });
  const [deleteCollection] = useDeleteCollectionMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCollection(undefined);
    setIsModalOpen(true);
  };

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <FolderOpen className="h-8 w-8 text-primary" />
                My Collections
              </h1>
              <p className="mt-2 text-muted-foreground">
                Organize and manage your story collections
              </p>
            </div>
            <Button onClick={handleCreate} className="inline-flex items-center gap-2">
              <Plus size={16} />
              Create Collection
            </Button>
          </div>
        </div>

      {data?.data.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No collections yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first collection to organize your favorite stories</p>
          <Button onClick={handleCreate} className="inline-flex items-center gap-2">
            <Plus size={16} />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((collection) => (
            <div key={collection.id} className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow group">
              <Link to={`/collection/${collection.id}`} className="block p-6">
                <div className="flex items-start gap-3 mb-3">
                  <FolderOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{collection.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {collection.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Book size={14} />
                  <span>{collection.storyCount || 0} {collection.storyCount === 1 ? 'story' : 'stories'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
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
              </Link>
              <div className="px-6 pb-4 pt-2 border-t border-border flex justify-end gap-2">
                <button 
                  onClick={(e) => { e.preventDefault(); handleEdit(collection); }} 
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); handleDelete(collection.id); }} 
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
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

      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collection={editingCollection}
      />
      </div>
    </div>
  );
};

export default CollectionList;
