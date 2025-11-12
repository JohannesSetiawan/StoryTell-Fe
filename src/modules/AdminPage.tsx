import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type RootState, useAppSelector } from '../redux/store';
import {
  useGetAllUsersQuery,
  useGetAllStoriesAdminQuery,
  useGetAllChaptersAdminQuery,
  useGetAllCommentsAdminQuery,
  type UserFilterParams,
  type StoryFilterParams,
  type ChapterFilterParams,
  type CommentFilterParams,
} from '../redux/api/adminApi';
import { useDeleteStoryMutation } from '../redux/api/storyApi';
import { useDeleteChapterMutation } from '../redux/api/chapterApi';
import { useDeleteCommentMutation } from '../redux/api/commentApi';
import {
  useGetAllTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetTagCategoriesQuery,
} from '../redux/api/tagApi';
import { Tag, CreateTagDto, UpdateTagDto } from '../redux/types/tag';
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  Eye,
  Loader,
  Shield,
  Lock,
  Unlock,
  Filter,
  X,
  Tag as TagIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TagBadge } from '../components/common/TagBadge';

type TabType = 'users' | 'stories' | 'chapters' | 'comments' | 'tags';

export function AdminPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.user.user);
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Tag management states
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagFormData, setTagFormData] = useState<CreateTagDto>({ name: '', category: '' });
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [tagCategoryFilter, setTagCategoryFilter] = useState('');

  // Filter states
  const [userFilters, setUserFilters] = useState<Omit<UserFilterParams, 'page' | 'limit'>>({});
  const [storyFilters, setStoryFilters] = useState<Omit<StoryFilterParams, 'page' | 'limit'>>({});
  const [chapterFilters, setChapterFilters] = useState<Omit<ChapterFilterParams, 'page' | 'limit'>>({});
  const [commentFilters, setCommentFilters] = useState<Omit<CommentFilterParams, 'page' | 'limit'>>({});

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Fetch data based on active tab with filters
  const {
    data: usersData,
    isLoading: usersLoading,
  } = useGetAllUsersQuery({ page: currentPage, limit: pageLimit, ...userFilters }, { skip: activeTab !== 'users' });

  const {
    data: storiesData,
    isLoading: storiesLoading,
    refetch: refetchStories,
  } = useGetAllStoriesAdminQuery({ page: currentPage, limit: pageLimit, ...storyFilters }, { skip: activeTab !== 'stories' });

  const {
    data: chaptersData,
    isLoading: chaptersLoading,
    refetch: refetchChapters,
  } = useGetAllChaptersAdminQuery({ page: currentPage, limit: pageLimit, ...chapterFilters }, { skip: activeTab !== 'chapters' });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useGetAllCommentsAdminQuery({ page: currentPage, limit: pageLimit, ...commentFilters }, { skip: activeTab !== 'comments' });

  const [deleteStory] = useDeleteStoryMutation();
  const [deleteChapter] = useDeleteChapterMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // Tag API hooks
  const { data: tagsData, isLoading: tagsLoading } = useGetAllTagsQuery(
    {
      page: currentPage,
      limit: pageLimit,
      name: tagSearchTerm || undefined,
      category: tagCategoryFilter || undefined,
    },
    { skip: activeTab !== 'tags' }
  );
  const { data: categoriesData } = useGetTagCategoriesQuery(undefined, { skip: activeTab !== 'tags' });
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdatingTag }] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    switch (activeTab) {
      case 'users':
        setUserFilters({});
        break;
      case 'stories':
        setStoryFilters({});
        break;
      case 'chapters':
        setChapterFilters({});
        break;
      case 'comments':
        setCommentFilters({});
        break;
    }
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    switch (activeTab) {
      case 'users':
        return Object.keys(userFilters).length > 0;
      case 'stories':
        return Object.keys(storyFilters).length > 0;
      case 'chapters':
        return Object.keys(chapterFilters).length > 0;
      case 'comments':
        return Object.keys(commentFilters).length > 0;
      default:
        return false;
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        await deleteStory(storyId).unwrap();
        toast.success('Story deleted successfully');
        refetchStories();
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete story');
      }
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      try {
        await deleteChapter(chapterId).unwrap();
        toast.success('Chapter deleted successfully');
        refetchChapters();
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete chapter');
      }
    }
  };

  const handleDeleteComment = async (storyId: string, commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        await deleteComment({ storyId, commentId }).unwrap();
        toast.success('Comment deleted successfully');
        refetchComments();
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to delete comment');
      }
    }
  };

  // Tag management handlers
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag(tagFormData).unwrap();
      setTagFormData({ name: '', category: '' });
      setIsCreateTagModalOpen(false);
      toast.success('Tag created successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create tag');
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      await updateTag({
        id: editingTag.id,
        data: tagFormData as UpdateTagDto,
      }).unwrap();
      setEditingTag(null);
      setTagFormData({ name: '', category: '' });
      toast.success('Tag updated successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update tag');
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!window.confirm(`Are you sure you want to delete "${tag.name}"? This will remove it from all stories.`)) {
      return;
    }

    try {
      await deleteTag(tag.id).unwrap();
      toast.success('Tag deleted successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete tag');
    }
  };

  const openEditTagModal = (tag: Tag) => {
    setEditingTag(tag);
    setTagFormData({ name: tag.name, category: tag.category });
  };

  const closeTagModal = () => {
    setIsCreateTagModalOpen(false);
    setEditingTag(null);
    setTagFormData({ name: '', category: '' });
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'users':
        return usersData;
      case 'stories':
        return storiesData;
      case 'chapters':
        return chaptersData;
      case 'comments':
        return commentsData;
      case 'tags':
        return tagsData;
    }
  };

  const isLoading = usersLoading || storiesLoading || chaptersLoading || commentsLoading || tagsLoading;
  const currentData = getCurrentData();

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage users, stories, chapters, and comments</p>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <div className="flex flex-wrap border-b border-border">
            <button
              onClick={() => handleTabChange('users')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Users size={18} />
              Users
              {usersData && <span className="text-xs">({usersData.total})</span>}
            </button>
            <button
              onClick={() => handleTabChange('stories')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'stories'
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <BookOpen size={18} />
              Stories
              {storiesData && <span className="text-xs">({storiesData.total})</span>}
            </button>
            <button
              onClick={() => handleTabChange('chapters')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <FileText size={18} />
              Chapters
              {chaptersData && <span className="text-xs">({chaptersData.total})</span>}
            </button>
            <button
              onClick={() => handleTabChange('comments')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <MessageSquare size={18} />
              Comments
              {commentsData && <span className="text-xs">({commentsData.total})</span>}
            </button>
            <button
              onClick={() => handleTabChange('tags')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'tags'
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <TagIcon size={18} />
              Tags
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  hasActiveFilters()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-input hover:bg-muted'
                }`}
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters() && <span className="text-xs">({Object.keys(
                  activeTab === 'users' ? userFilters :
                  activeTab === 'stories' ? storyFilters :
                  activeTab === 'chapters' ? chapterFilters :
                  commentFilters
                ).length})</span>}
              </button>
              {hasActiveFilters() && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Filter Inputs */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* User Filters */}
                {activeTab === 'users' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Username</label>
                      <input
                        type="text"
                        placeholder="Search username..."
                        value={userFilters.username || ''}
                        onChange={(e) => setUserFilters({ ...userFilters, username: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        value={userFilters.isAdmin === undefined ? '' : userFilters.isAdmin.toString()}
                        onChange={(e) => setUserFilters({ ...userFilters, isAdmin: e.target.value === '' ? undefined : e.target.value === 'true' })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">All</option>
                        <option value="true">Admin</option>
                        <option value="false">User</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Story Filters */}
                {activeTab === 'stories' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="Search title..."
                        value={storyFilters.title || ''}
                        onChange={(e) => setStoryFilters({ ...storyFilters, title: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Author</label>
                      <input
                        type="text"
                        placeholder="Search author..."
                        value={storyFilters.author || ''}
                        onChange={(e) => setStoryFilters({ ...storyFilters, author: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Privacy</label>
                      <select
                        value={storyFilters.isPrivate === undefined ? '' : storyFilters.isPrivate.toString()}
                        onChange={(e) => setStoryFilters({ ...storyFilters, isPrivate: e.target.value === '' ? undefined : e.target.value === 'true' })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">All</option>
                        <option value="false">Public</option>
                        <option value="true">Private</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Chapter Filters */}
                {activeTab === 'chapters' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Story</label>
                      <input
                        type="text"
                        placeholder="Search story..."
                        value={chapterFilters.story || ''}
                        onChange={(e) => setChapterFilters({ ...chapterFilters, story: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Author</label>
                      <input
                        type="text"
                        placeholder="Search author..."
                        value={chapterFilters.author || ''}
                        onChange={(e) => setChapterFilters({ ...chapterFilters, author: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content</label>
                      <input
                        type="text"
                        placeholder="Search content..."
                        value={chapterFilters.content || ''}
                        onChange={(e) => setChapterFilters({ ...chapterFilters, content: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Comment Filters */}
                {activeTab === 'comments' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content</label>
                      <input
                        type="text"
                        placeholder="Search content..."
                        value={commentFilters.content || ''}
                        onChange={(e) => setCommentFilters({ ...commentFilters, content: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Author</label>
                      <input
                        type="text"
                        placeholder="Search author..."
                        value={commentFilters.author || ''}
                        onChange={(e) => setCommentFilters({ ...commentFilters, author: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Story</label>
                      <input
                        type="text"
                        placeholder="Search story..."
                        value={commentFilters.story || ''}
                        onChange={(e) => setCommentFilters({ ...commentFilters, story: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Chapter</label>
                      <input
                        type="text"
                        placeholder="Search chapter..."
                        value={commentFilters.chapter || ''}
                        onChange={(e) => setCommentFilters({ ...commentFilters, chapter: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Apply Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={36} className="animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Users Table */}
                {activeTab === 'users' && usersData && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Username</th>
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Date Joined</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData.data.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{user.username}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {user.description || 'No description'}
                            </td>
                            <td className="py-3 px-4">
                              {user.isAdmin ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  <Shield size={12} />
                                  Admin
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">User</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(user.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => navigate(`/profile/${user.id}`)}
                                className="p-2 rounded-md hover:bg-muted transition-colors"
                                title="View profile"
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Stories Table */}
                {activeTab === 'stories' && storiesData && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Title</th>
                          <th className="text-left py-3 px-4 font-semibold">Author</th>
                          <th className="text-left py-3 px-4 font-semibold">Tags</th>
                          <th className="text-left py-3 px-4 font-semibold">Chapters</th>
                          <th className="text-left py-3 px-4 font-semibold">Privacy</th>
                          <th className="text-left py-3 px-4 font-semibold">Created</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storiesData.data.map((story) => (
                          <tr key={story.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{story.title}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{story.author.username}</td>
                            <td className="py-3 px-4">
                              {story.tags && story.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {story.tags.slice(0, 3).map((tag) => (
                                    <TagBadge key={tag} name={tag} />
                                  ))}
                                  {story.tags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{story.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">No tags</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm">{story.chapters.length}</td>
                            <td className="py-3 px-4">
                              {story.isprivate ? (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <Lock size={12} />
                                  Private
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs">
                                  <Unlock size={12} />
                                  Public
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(story.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/read-story/${story.id}`)}
                                  className="p-2 rounded-md hover:bg-muted transition-colors"
                                  title="View story"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => navigate(`/update-story/${story.id}`)}
                                  className="p-2 rounded-md hover:bg-muted transition-colors"
                                  title="Edit story"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteStory(story.id)}
                                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                  title="Delete story"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chapters Table */}
                {activeTab === 'chapters' && chaptersData && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Chapter</th>
                          <th className="text-left py-3 px-4 font-semibold">Story</th>
                          <th className="text-left py-3 px-4 font-semibold">Author</th>
                          <th className="text-left py-3 px-4 font-semibold">Order</th>
                          <th className="text-left py-3 px-4 font-semibold">Created</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chaptersData.data.map((chapter) => (
                          <tr key={chapter.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{chapter.title}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{chapter.story.title}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {chapter.story.author.username}
                            </td>
                            <td className="py-3 px-4 text-sm">#{chapter.order}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(chapter.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/read-chapter/${chapter.id}`)}
                                  className="p-2 rounded-md hover:bg-muted transition-colors"
                                  title="View chapter"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => navigate(`/update-chapter/${chapter.id}`)}
                                  className="p-2 rounded-md hover:bg-muted transition-colors"
                                  title="Edit chapter"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteChapter(chapter.id)}
                                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                  title="Delete chapter"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Comments Table */}
                {activeTab === 'comments' && commentsData && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Content</th>
                          <th className="text-left py-3 px-4 font-semibold">Author</th>
                          <th className="text-left py-3 px-4 font-semibold">Story</th>
                          <th className="text-left py-3 px-4 font-semibold">Chapter</th>
                          <th className="text-left py-3 px-4 font-semibold">Created</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData.data.map((comment) => (
                          <tr key={comment.id} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 text-sm max-w-md">
                              <div className="line-clamp-2">{comment.content}</div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {comment.authorUsername || 'Unknown'}
                            </td>
                            <td className="py-3 px-4 text-sm max-w-xs">
                              <div className="truncate" title={comment.storyTitle}>
                                {comment.storyTitle || 'N/A'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs">
                              <div className="truncate" title={comment.chapterTitle || 'General comment'}>
                                {comment.chapterTitle || 'General'}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(comment.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const commentUrl = comment.chapterId 
                                      ? `/read-chapter/${comment.chapterId}#comment-${comment.id}`
                                      : `/story/${comment.storyId}#comment-${comment.id}`;
                                    navigate(commentUrl);
                                  }}
                                  className="p-2 rounded-md hover:bg-muted transition-colors"
                                  title="View comment in context"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.storyId, comment.id)}
                                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                  title="Delete comment"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tags Table */}
                {activeTab === 'tags' && tagsData && (
                  <>
                    <div className="mb-4 flex justify-between items-center">
                      <div className="flex gap-3 flex-1">
                        <input
                          type="text"
                          placeholder="Search tags..."
                          value={tagSearchTerm}
                          onChange={(e) => setTagSearchTerm(e.target.value)}
                          className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-sm"
                        />
                        <select
                          value={tagCategoryFilter}
                          onChange={(e) => setTagCategoryFilter(e.target.value)}
                          className="px-4 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="">All Categories</option>
                          {categoriesData?.categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => setIsCreateTagModalOpen(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
                      >
                        Create Tag
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Tag</th>
                            <th className="text-left py-3 px-4 font-semibold">Category</th>
                            <th className="text-left py-3 px-4 font-semibold">Created</th>
                            <th className="text-left py-3 px-4 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tagsData.data.map((tag) => (
                            <tr key={tag.id} className="border-b border-border hover:bg-muted/30">
                              <td className="py-3 px-4">
                                <TagBadge name={tag.name} />
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {tag.category.charAt(0).toUpperCase() + tag.category.slice(1)}
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {new Date(tag.dateCreated).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEditTagModal(tag)}
                                    className="p-2 rounded-md hover:bg-muted transition-colors"
                                    title="Edit tag"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTag(tag)}
                                    className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                    title="Delete tag"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Empty State */}
                {currentData && currentData.data.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No {activeTab} found</p>
                  </div>
                )}

                {/* Pagination */}
                {currentData && currentData.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * pageLimit + 1} to{' '}
                      {Math.min(currentPage * pageLimit, currentData.total)} of {currentData.total} {activeTab}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!currentData.hasPrevPage}
                        className="p-2 rounded-md border border-input hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: currentData.totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === currentData.totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md transition-colors ${
                                  currentPage === page
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted border border-input'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!currentData.hasNextPage}
                        className="p-2 rounded-md border border-input hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tag Create/Edit Modal */}
      {(isCreateTagModalOpen || editingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TagIcon size={20} className="text-primary" />
              {editingTag ? 'Edit Tag' : 'Create Tag'}
            </h2>
            <form onSubmit={editingTag ? handleUpdateTag : handleCreateTag}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tag Name</label>
                  <input
                    type="text"
                    required
                    value={tagFormData.name}
                    onChange={(e) => setTagFormData({ ...tagFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="e.g., Horror, Action, English"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={tagFormData.category}
                    onChange={(e) => setTagFormData({ ...tagFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="e.g., genre, language"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTagModal}
                  className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
                  disabled={isCreatingTag || isUpdatingTag}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  disabled={isCreatingTag || isUpdatingTag}
                >
                  {isCreatingTag || isUpdatingTag ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
