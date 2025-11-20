import React, { useState } from 'react';
import { useGetUserCollectionsQuery, useAddStoryToCollectionMutation, useCreateCollectionMutation } from '../../redux/api/collectionApi';
import { Button } from '../../components/common/Button';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ isOpen, onClose, storyId }) => {
  const { data: collections, isLoading } = useGetUserCollectionsQuery({ page: 1, perPage: 100 }); // Fetch all for simplicity
  const [addStory] = useAddStoryToCollectionMutation();
  const [createCollection] = useCreateCollectionMutation();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addStory({ collectionId, storyId }).unwrap();
      onClose();
      alert('Story added to collection!');
    } catch (error) {
      console.error('Failed to add story:', error);
      alert('Failed to add story to collection.');
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCollection = await createCollection({ name: newCollectionName, isPublic: false }).unwrap();
      await addStory({ collectionId: newCollection.id, storyId }).unwrap();
      onClose();
      alert('Collection created and story added!');
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add to Collection</h2>
        
        {isLoading ? (
          <p>Loading collections...</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
            {collections?.data.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleAddToCollection(collection.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-900 dark:text-white flex justify-between items-center"
              >
                <span>{collection.name}</span>
                <span className="text-xs text-gray-500">{collection.storyCount} stories</span>
              </button>
            ))}
            {collections?.data.length === 0 && !isCreating && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-2">No collections found.</p>
            )}
          </div>
        )}

        {isCreating ? (
          <form onSubmit={handleCreateAndAdd} className="mt-4 border-t pt-4 dark:border-gray-700">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm mb-2 dark:bg-gray-700 dark:text-white"
              required
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1 text-sm rounded">Cancel</button>
              <Button type="submit">Create & Add</Button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsCreating(true)} 
            className="w-full mt-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
          >
            + Create New Collection
          </button>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
