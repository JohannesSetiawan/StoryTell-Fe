"use client"

import type React from "react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button, MarkdownEditor, MarkdownInfoModal } from "../../components/common"
import { useCreateStoryMutation } from "../../redux/api/storyApi"
import { BookOpen, ChevronLeft, Eye, EyeOff, Info, HelpCircle } from "lucide-react"

export function CreateStoryPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showMarkdownModal, setShowMarkdownModal] = useState(false)

  const [CreateStory] = useCreateStoryMutation()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a title for your story")
      setIsLoading(false)
      return
    }

    if (!description.trim()) {
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
      await CreateStory({ ...data }).unwrap()
      toast.success("Story created successfully!")
      navigate("/your-story", { replace: true })
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create story")
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
              Create New Story
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your creativity with the world. Start by filling out the details below.
            </p>
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
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="block text-sm font-medium">
                    Story Description
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
                  Provide a brief overview of your story to attract readers using Markdown formatting.
                </p>

                <MarkdownEditor
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter your story description using Markdown..."
                  minHeight="200px"
                />
                
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Use Markdown syntax for formatting. Click "Markdown Help" above for a complete guide.
                </p>
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
                  {isPrivate ? (
                    <>
                      <EyeOff size={16} className="mr-2" />
                      Create Private Story
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="mr-2" />
                      Publish Story
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

