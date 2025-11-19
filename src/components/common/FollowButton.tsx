import { useFollowUserMutation, useUnfollowUserMutation, useCheckIfFollowingQuery } from '../../redux/api/followApi';
import { Button } from './Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface FollowButtonProps {
  userId: string;
  className?: string;
}

export function FollowButton({ userId, className }: Readonly<FollowButtonProps>) {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();
  const { data: followStatus, isLoading: isChecking } = useCheckIfFollowingQuery(userId, {
    skip: !currentUser || currentUser.userId === userId,
  });

  // Don't show button if viewing own profile
  if (!currentUser || currentUser.userId === userId) {
    return null;
  }

  const handleFollowToggle = async () => {
    try {
      if (followStatus?.isFollowing) {
        await unfollowUser(userId).unwrap();
      } else {
        await followUser(userId).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const isLoading = isFollowing || isUnfollowing || isChecking;

  return (
    <Button
      onClick={handleFollowToggle}
      loading={isLoading}
      disabled={isLoading}
      className={className}
    >
      {followStatus?.isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
