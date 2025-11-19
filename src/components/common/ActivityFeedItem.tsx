import { ActivityFeed, ActivityType } from '../../redux/types/follow';
import { Link } from 'react-router-dom';

interface ActivityFeedItemProps {
  activity: ActivityFeed;
}

export function ActivityFeedItem({ activity }: Readonly<ActivityFeedItemProps>) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderActivityContent = () => {
    switch (activity.activityType) {
      case ActivityType.NEW_STORY:
        return (
          <>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {activity.user?.username}
            </span>
            <span className="text-gray-700 dark:text-gray-300"> published a new story: </span>
            <Link
              to={`/read-story/${activity.storyId}`}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {activity.story?.title || activity.metadata?.title}
            </Link>
          </>
        );
      case ActivityType.NEW_CHAPTER:
        return (
          <>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {activity.user?.username}
            </span>
            <span className="text-gray-700 dark:text-gray-300"> added a new chapter to </span>
            <Link
              to={`/read-story/${activity.storyId}`}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {activity.story?.title}
            </Link>
            {activity.chapter && (
              <span className="text-gray-600 dark:text-gray-400">
                {' '}
                - Chapter {activity.chapter.order}: {activity.chapter.title}
              </span>
            )}
          </>
        );
      case ActivityType.STATUS_CHANGE:
        return (
          <>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {activity.user?.username}
            </span>
            <span className="text-gray-700 dark:text-gray-300"> updated the status of </span>
            <Link
              to={`/read-story/${activity.storyId}`}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {activity.story?.title || activity.metadata?.title}
            </Link>
            {activity.metadata && (
              <span className="text-gray-600 dark:text-gray-400">
                {' '}
                from <span className="font-semibold">{activity.metadata.oldStatus}</span> to{' '}
                <span className="font-semibold">{activity.metadata.newStatus}</span>
              </span>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {activity.user?.username?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white break-words">
            {renderActivityContent()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(activity.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
