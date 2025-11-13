"use client"

import type React from "react"

import { useNavigate, useParams } from "react-router-dom"
import { type SetStateAction, useState, useEffect } from "react"
import { useGetSpecificStoryQuery, useDeleteStoryMutation } from "../../redux/api/storyApi"
import { type RootState, useAppSelector } from "../../redux/store"
import toast from "react-hot-toast"
import { CommentsList } from "../comment/Comment"
import { MarkdownRenderer, TagBadge, TagSelector, StoryStatusBadge } from "../../components/common"
import { useGetRatingsForSpecificStoryQuery, useGetSpecificUserRatingForStoryQuery } from "../../redux/api/ratingApi"
import { useAssignTagsToStoryMutation, useGetStoryTagsQuery } from "../../redux/api/tagApi"
import RatingModal from "../rating/RatingModal"
import useToggle from "../../components/hooks/useToggle"
import { useGetHistoryForSpecificStoryQuery } from "../../redux/api/historyApi"
import { dateToString } from "../../utils/utils"
import {
  Book,
  BookOpen,
  ChevronLeft,
  Edit,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Star,
  Trash2,
  History,
  Filter,
  Tag as TagIcon,
} from "lucide-react"

export function ReadStoryPage() {
  const { on, toggler } = useToggle()
  const { storyId } = useParams()
  const userId = useAppSelector((state: RootState) => state.user).user?.userId
  const { data: story, error, isLoading } = useGetSpecificStoryQuery(storyId ? storyId : "undefined")
  const { data: rating } = useGetRatingsForSpecificStoryQuery(storyId ? storyId : "undefined")
  const { data: userRating } = useGetSpecificUserRatingForStoryQuery(storyId ? storyId : "undefined")
  const { data: history } = useGetHistoryForSpecificStoryQuery(storyId ? storyId : "undefined")
  const [deleteStory, { isLoading: isDeleting }] = useDeleteStoryMutation()
  const [openComments, setOpenComments] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOption, setSelectedOption] = useState("title")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const { data: storyTags } = useGetStoryTagsQuery(storyId || '', { skip: !storyId })
  const [assignTags, { isLoading: isAssigningTags }] = useAssignTagsToStoryMutation()

  const navigate = useNavigate()

  // Initialize selected tags when modal opens
  useEffect(() => {
    if (isManageTagsOpen && storyTags) {
      setSelectedTagIds(storyTags.map(tag => tag.id))
    }
  }, [isManageTagsOpen, storyTags])

  const filteredChapter = story?.chapters
    ?.filter((chapter) => {
      if (selectedOption === "title") {
        return chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      } else if (selectedOption === "number") {
        return chapter.order >= Number(searchQuery.toLowerCase())
      } else if (selectedOption === "content") {
        return chapter.content.toLowerCase().includes(searchQuery.toLowerCase())
      } else {
        return chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      }
    })
    .sort((a, b) => a.order - b.order) // Sort by chapter order ascending

  const handleBack = () => {
    navigate(-1)
  }

  const handleCreateChapter = () => {
    navigate(`/create-chapter/${storyId}`)
  }

  const handleUpdateStory = () => {
    navigate(`/update-story/${storyId}`)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectedOption(event.target.value)
  }

  const handleShowComment = () => {
    setOpenComments(!openComments)
  }

  const handleDeleteStory = async () => {
    try {
      await deleteStory(storyId ? storyId : "undefined").unwrap()
      toast.success("Story deleted successfully")
      navigate("/your-story")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete story")
    }
  }

  const handleSaveTags = async () => {
    if (!storyId) return
    
    try {
      await assignTags({
        storyId,
        data: { tagIds: selectedTagIds },
      }).unwrap()
      toast.success("Tags updated successfully")
      setIsManageTagsOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update tags")
    }
  }

  // Format rating as a number with one decimal place
  const formatRating = (rating: any) => {
    if (!rating || !rating._avg || !rating._avg.rate) return "0.0"
    return (Math.round(rating._avg.rate * 10) / 10).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading story...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Book size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-6">You don't have permission to access this story.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Stories
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!story || !storyId || !rating || !userRating || !history) {
    return null // This shouldn't happen, but just in case
  }

  const isAuthor = story.authorId === userId

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Stories
        </button>

        {/* Story Header */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <FileText size={16} />
              <span>Story by {story.author?.username || "Unknown Author"}</span>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-3xl font-bold flex-1">{story.title}</h1>
              <StoryStatusBadge status={story.storyStatus} />
            </div>

            <MarkdownRenderer content={story.description} />

            {/* Tags Section */}
            {story.tags && story.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <TagBadge key={tag} name={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Story Info and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rating Section */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="text-yellow-400" size={18} />
              Rating
            </h3>

            {!story.isprivate && (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatRating(rating)}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {rating._count.rate} {rating._count.rate === 1 ? "rating" : "ratings"}
                </p>

                {userRating.rate ? (
                  <div className="mt-3 p-2 bg-muted/50 rounded-md">
                    <p className="text-sm">
                      Your rating: <span className="font-semibold">{userRating.rate}/10</span>
                    </p>
                  </div>
                ) : null}

                <button
                  className="mt-3 w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1"
                  onClick={toggler}
                >
                  <Star size={16} />
                  {userRating.rate ? "Update Rating" : "Rate Story"}
                </button>
              </div>
            )}

            {story.isprivate && (
              <p className="text-muted-foreground text-sm">Ratings are disabled for private stories.</p>
            )}
          </div>

          {/* Reading History */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Reading History
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Last read:</p>
                <p className="font-medium">{dateToString(history.date)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last chapter:</p>
                {history.chapterId ? (
                  <a
                    href={`/read-chapter/${history.chapterId}`}
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <BookOpen size={14} />
                    Chapter {history.chapter?.order}: {history.chapter?.title}
                  </a>
                ) : (
                  <p className="text-muted-foreground italic">None</p>
                )}
              </div>
            </div>
          </div>

          {/* Author Actions */}
          {isAuthor && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Edit size={18} className="text-primary" />
                Author Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleUpdateStory}
                  className="w-full px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Edit Story
                </button>

                <button
                  onClick={() => setIsManageTagsOpen(true)}
                  className="w-full px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <TagIcon size={16} />
                  Manage Tags
                </button>

                <button
                  onClick={handleCreateChapter}
                  className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Plus size={16} />
                  Add Chapter
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full px-3 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete Story
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chapters Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Chapters
            </h2>
          </div>

          {/* Search and Filter */}
          <div className="p-5 border-b border-border bg-muted/30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={`Search by ${selectedOption}...`}
                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Filter size={14} />
                  <span>Filter by:</span>
                </div>
                <select
                  id="dropdown"
                  value={selectedOption}
                  onChange={handleChange}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <option value="title">Title</option>
                  <option value="number">Chapter Number</option>
                  <option value="content">Content</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="p-5">
            {filteredChapter && filteredChapter.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredChapter.map((chapter) => (
                  <a href={`/read-chapter/${chapter.id}`} key={chapter.id} className="block group">
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {chapter.order}
                      </div>
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{chapter.title.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') != "" ? chapter.title : "No Title"}</h3>
                        {chapter.dateCreated && (
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(chapter.dateCreated).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? (
                  <>
                    <Search size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No chapters found matching your search.</p>
                    <button onClick={() => setSearchQuery("")} className="mt-2 text-primary hover:underline text-sm">
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No chapters available for this story yet.</p>
                    {isAuthor && (
                      <button
                        onClick={handleCreateChapter}
                        className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add First Chapter
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {story.isprivate ? (
          <div className="mb-8">
            <button
              onClick={handleShowComment}
              className="mb-4 px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
            >
              <MessageSquare size={18} />
              {openComments ? "Hide Comments" : "Show Comments"}
            </button>

            {openComments && <CommentsList story={story} />}
          </div>
        ) : (
          <div className="mb-8">
            <CommentsList story={story} />
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {on && (
        <RatingModal toggler={toggler} storyId={storyId} prevRating={userRating.id ? userRating.id : "undefined"} />
      )}

      {/* Manage Tags Modal */}
      {isManageTagsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsManageTagsOpen(false)}></div>

          <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TagIcon size={20} className="text-primary" />
              Manage Story Tags
            </h3>

            <TagSelector
              selectedTagIds={selectedTagIds}
              onTagsChange={setSelectedTagIds}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsManageTagsOpen(false)}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors"
                disabled={isAssigningTags}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveTags}
                disabled={isAssigningTags}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {isAssigningTags ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <TagIcon size={16} />
                    Save Tags
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsDeleteModalOpen(false)}></div>

          <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trash2 size={20} className="text-destructive" />
              Delete Story
            </h3>

            <p className="mb-6 text-muted-foreground">
              Are you sure you want to delete "{story.title}"? This action cannot be undone and will remove all chapters
              and comments.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteStory}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-destructive-foreground border-t-transparent animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Story
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

