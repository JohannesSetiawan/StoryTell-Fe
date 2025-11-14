"use client"

import type React from "react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Button, MarkdownEditor, MarkdownInfoModal } from "../../components/common"
import { useUpdateChapterMutation, useGetSpecificChapterQuery } from "../../redux/api/chapterApi"
import { useGetSpecificStoryQuery } from "../../redux/api/storyApi"
import { BookOpen, ChevronLeft, Edit, Loader, Save, HelpCircle } from "lucide-react"

export function UpdateChapterPage() {
  const { chapterId } = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [order, setOrder] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showMarkdownModal, setShowMarkdownModal] = useState(false)
  const [updateChapter] = useUpdateChapterMutation()
  const {
    data: chapter,
    isLoading: isLoadingChapter,
    error: chapterError,
  } = useGetSpecificChapterQuery(chapterId || '', { skip: !chapterId })

  const { data: story, isLoading: isLoadingStory } = useGetSpecificStoryQuery(
    chapter?.storyId || '',
    { skip: !chapter?.storyId },
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (chapter) {
      setContent(chapter.content || "")
      setTitle(chapter.title || "")
      setOrder(chapter.order || 1)
    }
  }, [chapter])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a chapter title")
      return
    }

    if (!content.trim()) {
      toast.error("Please enter chapter content")
      return
    }

    setIsLoading(true)

    if (!chapter?.storyId) {
      toast.error("Story ID is missing")
      setIsLoading(false)
      return
    }

    const data = {
      title: title.trim(),
      content: content,
      order: order,
      storyId: chapter.storyId,
    }

    if (!chapterId) {
      toast.error("Chapter ID is missing")
      setIsLoading(false)
      return
    }

    try {
      await updateChapter({
        updateData: data,
        chapterId: chapterId,
      }).unwrap()
      toast.success("Chapter updated successfully!")
      navigate(`/read-chapter/${chapterId}`, { replace: true })
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update chapter")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(Number(event.target.value))
  }

  const handleContentChange = (value: string) => {
    setContent(value)
  }

  const handleBack = () => {
    navigate(`/read-chapter/${chapterId}`)
  }

  if (isLoadingChapter || (chapter?.storyId && isLoadingStory)) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading chapter details...</p>
        </div>
      </div>
    )
  }

  if (chapterError || !chapter) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Chapter Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find the chapter you're trying to edit. It may have been deleted or you don't have permission
              to edit it.
            </p>
            <button
              onClick={() => navigate("/your-story")}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Your Stories
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Chapter
        </button>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" />
              Edit Chapter
            </h1>
            <p className="text-muted-foreground mt-1">
              Editing Chapter {chapter.order}: {chapter.title}
              {story && <span> from "{story.title}"</span>}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Chapter Order Field */}
              <div className="space-y-2">
                <label htmlFor="order" className="block text-sm font-medium">
                  Chapter Number
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  min="1"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  value={order}
                  onChange={handleOrderChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Changing the chapter number may affect the reading order of your story.
                </p>
              </div>

              {/* Chapter Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Chapter Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  placeholder="Enter a title for this chapter"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              {/* Chapter Content Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="block text-sm font-medium">
                    Chapter Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMarkdownModal(true)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <HelpCircle size={14} />
                    Markdown Help
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Edit your chapter content using Markdown formatting.
                </p>

                <MarkdownEditor
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Write your chapter content here using Markdown..."
                  minHeight="400px"
                />
                
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Use Markdown syntax for formatting. Click "Markdown Help" above for a complete guide.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 border border-input bg-background hover:bg-muted text-foreground transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1"
                >
                  {isLoading ? (
                    "Saving Changes..."
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Markdown Info Modal */}
      <MarkdownInfoModal isOpen={showMarkdownModal} onClose={() => setShowMarkdownModal(false)} />
    </div>
  )
}

