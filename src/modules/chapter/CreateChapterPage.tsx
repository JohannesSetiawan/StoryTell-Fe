"use client"

import type React from "react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/common"
import { useCreateChapterMutation } from "../../redux/api/chapterApi"
import { useGetSpecificStoryQuery } from "../../redux/api/storyApi"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { QuillToolbar, modules, formats } from "../../utils/quill"
import { BookOpen, ChevronLeft, FileText, Info, Loader, Plus } from "lucide-react"

export function CreateChapterPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [order, setOrder] = useState(1)
  const { storyId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [createChapter] = useCreateChapterMutation()
  const {
    data: story,
    isLoading: isLoadingStory,
    error: storyError,
  } = useGetSpecificStoryQuery(storyId ? storyId : "undefined")
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a chapter title")
      return
    }

    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Please enter chapter content")
      return
    }

    setIsLoading(true)

    const data = {
      title: title.trim(),
      content: content,
      storyId: storyId ? storyId : "undefined",
      order: order,
    }

    try {
      await createChapter({ ...data }).unwrap()
      toast.success("Chapter created successfully!")
      navigate(`/read-story/${storyId}`)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chapter")
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
    navigate(`/read-story/${storyId}`)
  }

  useEffect(() => {
    if (story) {
      // Set the order to be the next chapter number
      setOrder(story.chapters.length > 0 ? story.chapters[story.chapters.length - 1].order + 1 : 1)
    }
  }, [story])

  if (isLoadingStory) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading story details...</p>
        </div>
      </div>
    )
  }

  if (storyError || !story) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Story Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find the story you're trying to add a chapter to. It may have been deleted or you don't have
              permission to edit it.
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
          Back to Story
        </button>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Add New Chapter
            </h1>
            <p className="text-muted-foreground mt-1">Adding a chapter to "{story.title}"</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Chapter Order Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="order" className="block text-sm font-medium">
                    Chapter Number
                  </label>

                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info size={12} />
                    {story.chapters.length > 0
                      ? `Latest chapter is #${story.chapters[story.chapters.length - 1].order}`
                      : "No chapters yet"}
                  </div>
                </div>

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
                <label htmlFor="content" className="block text-sm font-medium">
                  Chapter Content
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Write your chapter content using the rich text editor below.
                </p>

                <div className="border border-input rounded-md overflow-hidden bg-background">
                  <QuillToolbar />
                  <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Write your chapter content here..."
                    modules={modules}
                    formats={formats}
                    className="bg-background text-foreground"
                    style={{
                      height: "400px",
                      borderRadius: "0",
                      border: "none",
                      borderTop: "1px solid var(--border)",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: You can resize the editor by dragging the bottom-right corner.
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
                    "Creating Chapter..."
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Create Chapter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

