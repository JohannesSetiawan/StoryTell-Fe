"use client"

import type React from "react"

import {
  useCreateChapterCommentMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "../../redux/api/commentApi"
import type { AllCommentResponse, CommentWithAuthorName } from "../../redux/types/comment"
import type { Chapter, specificStoryResponse } from "../../redux/types/story"
import { useState } from "react"
import toast from "react-hot-toast"
import { type RootState, useAppSelector } from "../../redux/store"
import { commentDateToString } from "../../utils/utils"
import { MessageSquare, Reply, Edit2, Trash2, Send, X, User } from "lucide-react"

interface Story {
  story: specificStoryResponse
}

interface ChapterComment {
  chapter: Chapter
}

interface Comments {
  comment: CommentWithAuthorName
  allComments: AllCommentResponse
}

interface AddComment {
  parentId?: string
  storyId: string
}

interface AddChapterComment {
  parentId?: string
  storyId: string
  chapterId: string
}

interface UpdateComment {
  content: string
  commentId: string
  storyId: string
  parentId: string
}

const Comment: React.FC<Comments> = ({ comment, allComments }) => {
  const replies = allComments.filter((reply) => reply.parentId === comment.id)
  const [openCommentAdder, setOpenCommentAdder] = useState(false)
  const [openCommentUpdater, setOpenCommentUpdater] = useState(false)
  const userId = useAppSelector((state: RootState) => state.user).user?.userId
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation()
  const storyId = comment.storyId

  const handleAddComment = () => {
    setOpenCommentAdder(!openCommentAdder)
    setOpenCommentUpdater(false)
  }

  const handleUpdateComment = () => {
    setOpenCommentUpdater(!openCommentUpdater)
    setOpenCommentAdder(false)
  }

  const handleDeleteComment = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment({ storyId, commentId: comment.id }).then((res) => {
        if (res) {
          if ("data" in res) {
            toast.success("Comment deleted successfully")
          } else if ("data" in res.error) {
            const errorData = res.error.data as { message: string }
            toast.error(errorData.message)
          } else {
            toast.error("Unknown error!")
          }
        }
      })
    }
  }

  // Generate a color based on the username for the avatar
  const getUserColor = (username: string) => {
    const hue = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 45%)`
  }

  return (
    <div className="w-full bg-card border border-border rounded-lg p-4 mb-4 transition-all hover:border-primary/20">
      <div className="flex items-start gap-3">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
          style={{ backgroundColor: getUserColor(comment.author.username) }}
        >
          <User size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <h4 className="font-medium text-foreground">{comment.author.username}</h4>
            <span className="text-xs text-muted-foreground">{commentDateToString(comment.dateCreated)}</span>
          </div>

          <div className="text-sm text-foreground mb-3 break-words">{comment.content}</div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              onClick={handleAddComment}
              aria-label="Reply to comment"
            >
              <Reply size={14} />
              Reply
            </button>

            {comment.authorId === userId && (
              <>
                <button
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleUpdateComment}
                  aria-label="Edit comment"
                >
                  <Edit2 size={14} />
                  Edit
                </button>

                <button
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                  aria-label="Delete comment"
                >
                  <Trash2 size={14} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {openCommentAdder && (
        <div className="mt-3 ml-11 border-l-2 border-border pl-4">
          <AddComment parentId={comment.id} storyId={comment.storyId} />
        </div>
      )}

      {openCommentUpdater && (
        <div className="mt-3">
          <UpdateComment
            commentId={comment.id}
            storyId={comment.storyId}
            content={comment.content}
            parentId={comment.parentId}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-3 ml-8 border-l-2 border-border pl-4 space-y-3">
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} allComments={allComments} />
          ))}
        </div>
      )}
    </div>
  )
}

export const CommentsList: React.FC<Story> = ({ story }) => {
  const allComments = story.storyComments || []
  const storyId = story.id
  const topLevelComments = allComments.filter((comment) => !comment.parentId)

  return (
    <div className="bg-background rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-primary" />
          Comments ({allComments.length})
        </h3>

        <div className="mb-4">
          <AddComment parentId={undefined} storyId={storyId} />
        </div>
      </div>

      <div className="p-4">
        {topLevelComments.length > 0 ? (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <Comment key={comment.id} comment={comment} allComments={allComments} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const ChapterCommentsList: React.FC<ChapterComment> = ({ chapter }) => {
  const allComments = chapter.chapterComments || []
  const storyId = chapter.storyId
  const chapterId = chapter.id
  const topLevelComments = allComments.filter((comment) => !comment.parentId)

  return (
    <div className="bg-background rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-primary" />
          Chapter Comments ({allComments.length})
        </h3>

        <div className="mb-4">
          <AddChapterComment parentId={undefined} storyId={storyId} chapterId={chapterId} />
        </div>
      </div>

      <div className="p-4">
        {topLevelComments.length > 0 ? (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <Comment key={comment.id} comment={comment} allComments={allComments} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts on this chapter!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const AddComment: React.FC<AddComment> = ({ parentId, storyId }) => {
  const [createComment, { isLoading }] = useCreateCommentMutation()
  const [newComment, setNewComment] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const data = { content: newComment, parentId }
      await createComment({ data, storyId }).unwrap()
      toast.success("Comment added successfully")
      setNewComment("")
      // Instead of reloading the page, you could update the UI optimistically
      // or refetch the comments
      window.location.reload()
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add comment")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
          value={newComment}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setNewComment("")}
          className="px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors"
          disabled={!newComment.trim() || isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          disabled={!newComment.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
              Posting...
            </>
          ) : (
            <>
              <Send size={14} />
              {parentId ? "Reply" : "Comment"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const AddChapterComment: React.FC<AddChapterComment> = ({ parentId, storyId, chapterId }) => {
  const [createComment, { isLoading }] = useCreateChapterCommentMutation()
  const [newComment, setNewComment] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const data = { content: newComment, parentId }
      await createComment({ data, storyId, chapterId }).unwrap()
      toast.success("Comment added successfully")
      setNewComment("")
      // Instead of reloading the page, you could update the UI optimistically
      // or refetch the comments
      window.location.reload()
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add comment")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder={parentId ? "Write a reply..." : "Share your thoughts on this chapter..."}
          value={newComment}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setNewComment("")}
          className="px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors"
          disabled={!newComment.trim() || isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          disabled={!newComment.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
              Posting...
            </>
          ) : (
            <>
              <Send size={14} />
              {parentId ? "Reply" : "Comment"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const UpdateComment: React.FC<UpdateComment> = ({ content, commentId, storyId, parentId }) => {
  const [updateComment, { isLoading }] = useUpdateCommentMutation()
  const [newComment, setNewComment] = useState(content)

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const data = { content: newComment, parentId }
      await updateComment({ data, storyId, commentId }).unwrap()
      toast.success("Comment updated successfully")
      // Instead of reloading the page, you could update the UI optimistically
      // or refetch the comments
      window.location.reload()
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update comment")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-l-2 border-primary pl-4">
      <div className="relative">
        <textarea
          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          value={newComment}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-muted transition-colors inline-flex items-center gap-1"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
          disabled={!newComment.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Edit2 size={14} />
              Update
            </>
          )}
        </button>
      </div>
    </form>
  )
}

