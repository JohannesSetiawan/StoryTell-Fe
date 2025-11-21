"use client"

import { useNavigate } from "react-router-dom"
import { useGetAllHistoriesQuery } from "../../redux/api/historyApi"
import { Book, ChevronLeft, Clock, BookOpen, Calendar, ArrowRight } from "lucide-react"

export function ReadHistoryPage() {
  const navigate = useNavigate()
  const { data: histories, isLoading, isError } = useGetAllHistoriesQuery()

  const handleBack = () => navigate("/")

  // Helper function to format date strings with relative time
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    
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
      <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleBack}
              className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </button>
            <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-muted/30 rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-5 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted/70 rounded"></div>
                    <div className="h-3 w-1/4 bg-muted/50 rounded"></div>
                  </div>
                  <div className="h-9 w-24 bg-muted rounded hidden sm:block"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted mb-4">
              <Book size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Something went wrong</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't load your reading history right now. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="mb-3 sm:mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors active:scale-95"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="flex items-start gap-3 sm:gap-4 mb-2">
            <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-grow">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Reading History
              </h1>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">
                Keep track of the stories and chapters you've been reading
              </p>
            </div>
          </div>
          {histories && histories.length > 0 && (
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 w-fit">
              <BookOpen size={14} className="flex-shrink-0" />
              <span>{histories.length} {histories.length === 1 ? 'item' : 'items'} in history</span>
            </div>
          )}
        </div>

        {/* History List */}
        {histories && histories.length > 0 ? (
          <div className="space-y-5 sm:space-y-6">
            {Object.entries(groupedHistories).map(([date, dateHistories]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground/70 sticky top-16 sm:top-20 z-10 bg-muted/20 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
                  <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
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
                        className="group bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
                        style={{ borderLeftColor: accentColor, borderLeftWidth: "4px" }}
                      >
                        <div className="p-3 sm:p-4">
                          {/* Mobile Layout - Stacked */}
                          <div className="flex sm:hidden flex-col gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground shadow-sm"
                                style={{ backgroundColor: accentColor }}
                              >
                                <Book size={18} />
                              </div>
                              
                              <div className="flex-grow min-w-0">
                                <h3 className="text-base font-semibold mb-1 line-clamp-2 leading-tight">
                                  {history.story.title}
                                </h3>
                                
                                {history.chapter ? (
                                  <div className="flex items-start text-xs text-muted-foreground mb-1.5">
                                    <BookOpen size={13} className="mr-1.5 flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">
                                      Ch. {history.chapter.order}: {history.chapter.title}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-xs text-muted-foreground mb-1.5">
                                    <BookOpen size={13} className="mr-1.5 flex-shrink-0" />
                                    <span>Story overview</span>
                                  </div>
                                )}

                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock size={11} className="mr-1.5 flex-shrink-0" />
                                  <span>{formatTime(history.date)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <a
                              href={history.chapter ? `/read-chapter/${history.chapterId}` : `/read-story/${history.storyId}`}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
                            >
                              Continue Reading
                              <ArrowRight size={16} />
                            </a>
                          </div>

                          {/* Desktop Layout - Horizontal */}
                          <div className="hidden sm:flex items-start gap-4">
                            <div
                              className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground mt-1 shadow-sm"
                              style={{ backgroundColor: accentColor }}
                            >
                              <Book size={20} />
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold mb-1 line-clamp-1">
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
                                <Clock size={12} className="mr-1.5 flex-shrink-0" />
                                <span>Read at {formatTime(history.date)}</span>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <a
                                href={history.chapter ? `/read-chapter/${history.chapterId}` : `/read-story/${history.storyId}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap"
                              >
                                Continue
                                <ArrowRight size={16} />
                              </a>
                            </div>
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
          <div className="bg-card border border-border rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted mb-4">
              <Clock size={20} className="sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">No reading history yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring stories to build your reading history. Every story and chapter you read will appear here.
            </p>
            <a
              href="/read"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:scale-95 transition-all text-sm sm:text-base"
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
