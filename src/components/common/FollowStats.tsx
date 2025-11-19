import { useGetFollowStatsQuery } from '../../redux/api/followApi';

interface FollowStatsProps {
  userId: string;
  className?: string;
}

export function FollowStats({ userId, className }: Readonly<FollowStatsProps>) {
  const { data: stats, isLoading } = useGetFollowStatsQuery(userId);

  if (isLoading) {
    return (
      <div className={`flex gap-4 ${className}`}>
        <div className="animate-pulse">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-6 ${className}`}>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {stats?.followersCount || 0}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {stats?.followingCount || 0}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
      </div>
    </div>
  );
}
