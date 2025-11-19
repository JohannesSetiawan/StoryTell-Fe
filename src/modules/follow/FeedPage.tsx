"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetActivityFeedQuery } from "../../redux/api/followApi"
import { ActivityFeedItem } from "../../components/common"
import { ChevronLeft, Rss, BookOpen } from "lucide-react"

export function FeedPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 20

  const { data: feed, isLoading, isError } = useGetActivityFeedQuery({
    page: currentPage,
    perPage: perPage
  })

  const handleBack = () => navigate("/")

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading your feed...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Rss size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't load your feed right now. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Rss className="h-8 w-8 text-primary" />
            Activity Feed
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated with new stories and chapters from authors you follow
          </p>
        </div>

        {feed && feed.data.length > 0 ? (
          <>
            <div className="space-y-3">
              {feed.data.map((activity) => (
                <ActivityFeedItem key={activity.id} activity={activity} />
              ))}
            </div>

            {feed.meta.lastPage > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {feed.meta.lastPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(feed.meta.lastPage, prev + 1))}
                  disabled={currentPage === feed.meta.lastPage}
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
              <Rss size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No activities yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start following authors to see their latest stories, chapters, and updates here. Your feed will show activities from all the authors you follow.
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
