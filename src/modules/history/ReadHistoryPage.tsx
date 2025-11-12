"use client"

import { useNavigate } from "react-router-dom"
import { useGetAllHistoriesQuery } from "../../redux/api/historyApi"
import { Book, ChevronLeft, Clock, BookOpen, Calendar, ArrowRight } from "lucide-react"

export function ReadHistoryPage() {
  const navigate = useNavigate()
  const { data: histories, isLoading, isError } = useGetAllHistoriesQuery()

  const handleBack = () => navigate("/")

  // Helper function to format date strings
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to format time strings
  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Generate a random pastel color for each story card based on its title
  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  // Helper function to group histories by date
  const groupHistoriesByDate = () => {
    if (!histories) return {}
    
    const grouped: { [key: string]: typeof histories } = {}
    
    histories.forEach(history => {
      const dateKey = formatDate(history.date)
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(history)
    })
    
    return grouped
  }

  const groupedHistories = groupHistoriesByDate()

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading your reading history...</p>
        </div>
      </div>
    )
  }

  // Error State
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
              <Book size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't load your reading history right now. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            Reading History
          </h1>
          <p className="mt-2 text-muted-foreground">
            Keep track of the stories and chapters you've been reading
          </p>
        </div>

        {/* History List */}
        {histories && histories.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedHistories).map(([date, dateHistories]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar size={16} />
                  <span>{date}</span>
                  <div className="flex-grow h-px bg-border"></div>
                </div>

                {/* History Items for this date */}
                <div className="space-y-3">
                  {dateHistories.map((history) => {
                    const accentColor = getStoryColor(history.story.title)
                    return (
                      <div
                        key={history.id}
                        className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ borderLeftColor: accentColor, borderLeftWidth: "4px" }}
                      >
                        <div className="p-4 flex items-start gap-4">
                          <div
                            className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground mt-1"
                            style={{ backgroundColor: accentColor }}
                          >
                            <Book size={20} />
                          </div>
                          
                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-semibold mb-1 truncate">
                              {history.story.title}
                            </h3>
                            
                            {history.chapter ? (
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <BookOpen size={14} className="mr-1.5 flex-shrink-0" />
                                <span className="truncate">
                                  Chapter {history.chapter.order}: {history.chapter.title}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <BookOpen size={14} className="mr-1.5 flex-shrink-0" />
                                <span>Story overview</span>
                              </div>
                            )}

                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock size={12} className="mr-1.5" />
                              <span>Read at {formatTime(history.date)}</span>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <a
                              href={history.chapter ? `/read-chapter/${history.chapterId}` : `/read-story/${history.storyId}`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              Continue
                              <ArrowRight size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Clock size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No reading history yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring stories to build your reading history. Every story and chapter you read will appear here.
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
