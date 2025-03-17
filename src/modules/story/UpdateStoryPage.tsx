"use client"

import type React from "react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/common"
import { useUpdateStoryMutation, useGetSpecificStoryQuery } from "../../redux/api/storyApi"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css" // Import Quill styles
import { QuillToolbar, modules, formats } from "../../utils/quill"
import { BookOpen, ChevronLeft, Info, Save, Loader } from "lucide-react"

export function UpdateStoryPage() {
  const { storyId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [updateStory] = useUpdateStoryMutation()
  const {
    data: story,
    isLoading: isLoadingStory,
    error: storyError,
  } = useGetSpecificStoryQuery(storyId ? storyId : "undefined")

  const navigate = useNavigate()

  useEffect(() => {
    if (story) {
      setDescription(story.description || "")
      setTitle(story.title || "")
      setIsPrivate(story.isprivate || false)
    }
  }, [story])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a title for your story")
      setIsLoading(false)
      return
    }

    if (!description.trim() || description === "<p><br></p>") {
      toast.error("Please enter a description for your story")
      setIsLoading(false)
      return
    }

    const data = {
      title: title,
      description: description,
      isprivate: isPrivate,
    }

    try {
      await updateStory({ updateData: data, storyId: storyId || "undefined" }).unwrap()
      toast.success("Story updated successfully!")
      navigate(`/read-story/${storyId}`)
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update story")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const handleIsPrivateChange = () => {
    setIsPrivate(!isPrivate)
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoadingStory) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading story...</p>
        </div>
      </div>
    )
  }

  if (storyError) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Story Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find the story you're looking for. It may have been deleted or you don't have permission to
              edit it.
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
          Back
        </button>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Edit Story
            </h1>
            <p className="text-muted-foreground mt-1">Update your story details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Story Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  placeholder="Enter a captivating title for your story"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Story Description
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Provide a brief overview of your story to attract readers.
                </p>

                <div className="border border-input rounded-md overflow-hidden bg-background">
                  <QuillToolbar />
                  <ReactQuill
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter your story description..."
                    modules={modules}
                    formats={formats}
                    className="bg-background text-foreground"
                    style={{
                      height: "200px",
                      borderRadius: "0",
                      border: "none",
                      borderTop: "1px solid var(--border)",
                    }}
                  />
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Private Story</span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowTooltip(!showTooltip)}
                          aria-label="More information about private stories"
                        >
                          <Info size={16} />
                        </button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {isPrivate ? "Only you can see this story" : "Anyone can read this story"}
                      </span>

                      {showTooltip && (
                        <div className="mt-2 p-3 bg-popover text-popover-foreground rounded-md text-sm shadow-md">
                          <p>
                            <strong>Private stories</strong> are only visible to you. They won't appear in search
                            results or be accessible to other users.
                          </p>
                          <p className="mt-1">
                            <strong>Public stories</strong> can be read by anyone and will appear in search results.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleIsPrivateChange}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isPrivate ? "bg-primary" : "bg-muted"
                    }`}
                    role="switch"
                    aria-checked={isPrivate}
                  >
                    <span
                      className={`${
                        isPrivate ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
                    />
                    <span className="sr-only">{isPrivate ? "Make story public" : "Make story private"}</span>
                  </button>
                </div>
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
                    <>Saving Changes...</>
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
    </div>
  )
}

