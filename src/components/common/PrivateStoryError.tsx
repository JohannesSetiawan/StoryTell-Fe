import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, User } from 'lucide-react';

interface PrivateStoryErrorProps {
  authorUsername?: string;
}

export const PrivateStoryError: React.FC<PrivateStoryErrorProps> = ({ authorUsername }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToAuthorProfile = () => {
    if (authorUsername) {
      navigate(`/profile/${authorUsername}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Lock className="w-16 h-16 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Story is Private
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The story is currently private. Try contacting the author for access.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          {authorUsername && (
            <button
              onClick={handleGoToAuthorProfile}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              View Author Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
