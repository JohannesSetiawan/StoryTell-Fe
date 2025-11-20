import React, { useState, useEffect } from 'react';
import { useCreateCollectionMutation, useUpdateCollectionMutation } from '../../redux/api/collectionApi';
import { Collection } from '../../redux/types/collection';
import { Button } from '../../components/common/Button';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection?: Collection; // If provided, it's edit mode
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ isOpen, onClose, collection }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setIsPublic(collection.isPublic);
      setIsCollaborative(collection.isCollaborative);
    } else {
      setName('');
      setDescription('');
      setIsPublic(false);
      setIsCollaborative(false);
    }
    setErrorMessage(null);
  }, [collection, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (collection) {
        await updateCollection({
          id: collection.id,
          data: { name, description, isPublic, isCollaborative },
        }).unwrap();
      } else {
        await createCollection({ name, description, isPublic, isCollaborative }).unwrap();
      }
      onClose();
    } catch (error: any) {
      console.error('Failed to save collection:', error);
      const message = error?.data?.message || 'Failed to save collection. Please try again.';
      setErrorMessage(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {collection ? 'Edit Collection' : 'Create New Collection'}
        </h2>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Public (Visible to everyone)
            </label>
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="isCollaborative"
              checked={isCollaborative}
              onChange={(e) => setIsCollaborative(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isCollaborative" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Collaborative (Allow others to add stories)
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
