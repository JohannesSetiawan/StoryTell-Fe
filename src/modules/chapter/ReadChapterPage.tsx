"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useGetSpecificStoryQuery } from "../../redux/api/storyApi"
import { useGetSpecificChapterQuery, useDeleteChapterMutation } from "../../redux/api/chapterApi"
import { type RootState, useAppSelector } from "../../redux/store"
import toast from "react-hot-toast"
import type { Chapter } from "../../redux/types/story"
import { MarkdownRenderer } from "../../components/common"
import { ChapterCommentsList } from "../comment/Comment"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Book, BookOpen, ChevronLeft, Edit, Loader, MessageSquare, Trash2 } from "lucide-react"

export function ReadChapterPage() {
  const { chapterId } = useParams()
  const userId = useAppSelector((state: RootState) => state.user).user?.userId
  const {
    data: chapter,
    isLoading: isLoadingChapter,
    error: chapterError,
  } = useGetSpecificChapterQuery(chapterId || '', { skip: !chapterId })
  const { data: story, isLoading: isLoadingStory } = useGetSpecificStoryQuery(
    chapter?.storyId || '',
    { skip: !chapter?.storyId },
  )
  const [deleteChapter, { isLoading: isDeleting }] = useDeleteChapterMutation()
  const [openComments, setOpenComments] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const navigate = useNavigate()

  const handleShowComment = () => {
    setOpenComments(!openComments)
  }

  const handleBack = () => {
    navigate(`/read-story/${chapter?.storyId}`, { replace: true })
  }

  const handleUpdateChapter = () => {
    navigate(`/update-chapter/${chapterId}`)
  }

  const handleNextChapter = (nextChapter: Chapter) => {
    if (nextChapter) {
      navigate(`/read-chapter/${nextChapter.id}`, { replace: true })
    } else {
      navigate(`/read-story/${chapter?.storyId}`, { replace: true })
    }
  }

  const handlePrevChapter = (prevChapter: Chapter) => {
    if (prevChapter) {
      navigate(`/read-chapter/${prevChapter.id}`)
    } else {
      navigate(`/read-story/${chapter?.storyId}`)
    }
  }

  const handleDeleteChapter = async () => {
    if (!chapterId) {
      toast.error("Chapter ID is missing")
      return
    }
    try {
      await deleteChapter(chapterId).unwrap()
      toast.success("Chapter deleted successfully")
      navigate(`/read-story/${chapter?.storyId}`)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete chapter")
    }
  }

  // Loading state
  if (isLoadingChapter || isLoadingStory) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading chapter...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (chapterError || !chapter || !story) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Chapter Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find the chapter you're looking for. It may have been deleted or you don't have permission to
              view it.
            </p>
            <button
              onClick={() => navigate("/read")}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Book size={16} />
              Browse Stories
            </button>
          </div>
        </div>
      </div>
    )
  }

  const chapterList = story.chapters || []
  const currChapIdx = chapterList.findIndex((chap) => chap.id === chapterId)
  const nextChap = chapterList[currChapIdx + 1]
  const prevChap = chapterList[currChapIdx - 1]
  const isAuthor = story.authorId === userId

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Story Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Story
          </button>

          <div className="text-sm text-muted-foreground">
            Chapter {chapter.order} of {chapterList.length}
          </div>
        </div>

        {/* Chapter Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Chapter {chapter.order}: {chapter.title}
            </h1>

            <div className="text-sm text-muted-foreground mb-6">
              {chapter.dateCreated && <span>Published on {new Date(chapter.dateCreated).toLocaleDateString()}</span>}
            </div>

            <div 
              className="select-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onContextMenu={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <MarkdownRenderer content={chapter.content} />
            </div>
          </div>
        </div>

        {/* Author Actions */}
        {isAuthor && (
          <div className="mb-8">
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
                <Edit size={16} className="text-primary" />
                Author Actions
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleUpdateChapter}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors inline-flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit Chapter
                </button>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete Chapter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex-1">
            {prevChap ? (
              <button
                onClick={() => handlePrevChapter(prevChap)}
                className="w-full px-4 py-3 rounded-md border border-input bg-card hover:bg-muted transition-colors inline-flex items-center gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-muted-foreground">Previous</span>
                  <span className="font-medium truncate">
                    Chapter {prevChap.order}: {prevChap.title}
                  </span>
                </div>
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-3 rounded-md border border-input bg-card opacity-50 cursor-not-allowed inline-flex items-center gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-muted-foreground">Previous</span>
                  <span className="font-medium">No previous chapter</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex-1">
            {nextChap ? (
              <button
                onClick={() => handleNextChapter(nextChap)}
                className="w-full px-4 py-3 rounded-md border border-input bg-card hover:bg-muted transition-colors inline-flex items-center justify-end gap-2 text-sm"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs text-muted-foreground">Next</span>
                  <span className="font-medium truncate">
                    Chapter {nextChap.order}: {nextChap.title}
                  </span>
                </div>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-3 rounded-md border border-input bg-card opacity-50 cursor-not-allowed inline-flex items-center justify-end gap-2 text-sm"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs text-muted-foreground">Next</span>
                  <span className="font-medium">No next chapter</span>
                </div>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          {story.isprivate ? (
            <div className="mb-4">
              <button
                onClick={handleShowComment}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare size={18} />
                {openComments ? "Hide Comments" : "Show Comments"}
              </button>

              {openComments && (
                <div className="mt-6">
                  <ChapterCommentsList chapter={chapter} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                Comments
              </h2>
              <ChapterCommentsList chapter={chapter} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsDeleteModalOpen(false)}></div>

          <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trash2 size={20} className="text-destructive" />
              Delete Chapter
            </h3>

            <p className="mb-6 text-muted-foreground">
              Are you sure you want to delete "Chapter {chapter.order}: {chapter.title}"? This action cannot be undone
              and will remove all comments.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteChapter}
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
                    Delete Chapter
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

