"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetAllBookmarksQuery, useDeleteBookmarkMutation } from "../../redux/api/bookmarkApi"
import { Bookmark, ChevronLeft, BookOpen, Calendar, Trash2, ArrowRight } from "lucide-react"

export function BookmarkPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const { data: bookmarks, isLoading, isError } = useGetAllBookmarksQuery({
    page: currentPage,
    perPage: perPage
  })

  const [deleteBookmark, { isLoading: isDeleting }] = useDeleteBookmarkMutation()

  const handleBack = () => navigate("/")

  const handleDeleteBookmark = async (storyId: string) => {
    if (window.confirm("Are you sure you want to remove this bookmark?")) {
      try {
        await deleteBookmark({ storyId }).unwrap()
      } catch (error) {
        console.error("Failed to delete bookmark:", error)
      }
    }
  }

  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'Cancelled':
      case 'Dropped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading your bookmarks...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Bookmark size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't load your bookmarks right now. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            My Bookmarks
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your saved stories for easy access later
          </p>
        </div>

        {bookmarks && bookmarks.data.length > 0 ? (
          <>
            <div className="space-y-3">
              {bookmarks.data.map((bookmark) => {
                const accentColor = getStoryColor(bookmark.title)
                return (
                  <div
                    key={bookmark.storyId}
                    className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ borderLeftColor: accentColor, borderLeftWidth: "4px" }}
                  >
                    <div className="p-4 flex items-start gap-4">
                      <div
                        className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground mt-1"
                        style={{ backgroundColor: accentColor }}
                      >
                        <BookOpen size={20} />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold mb-1 truncate">
                          {bookmark.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap">
                          <span>By {bookmark.authorName}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bookmark.storyStatus)}`}>
                            {bookmark.storyStatus}
                          </span>
                        </div>

                        {bookmark.latestChapter && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar size={14} className="mr-1.5 flex-shrink-0" />
                            <span className="truncate">Latest: {bookmark.latestChapter}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleDeleteBookmark(bookmark.storyId)}
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center p-2 rounded-md text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                          title="Remove bookmark"
                        >
                          <Trash2 size={18} />
                        </button>
                        <a
                          href={`/read-story/${bookmark.storyId}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Read
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {bookmarks.meta.lastPage > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {bookmarks.meta.lastPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(bookmarks.meta.lastPage, prev + 1))}
                  disabled={currentPage === bookmarks.meta.lastPage}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Bookmark size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start bookmarking your favorite stories to easily find them later. Bookmark a story by clicking the bookmark icon on any story page.
            </p>
            <a
              href="/read"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <BookOpen size={18} />
              Browse Stories
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
