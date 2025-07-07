"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useGetSpecificUserStoryQuery } from "../../redux/api/storyApi"
import { type RootState, useAppSelector } from "../../redux/store"
import { useState } from "react"
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Search,
  PenTool,
  Plus,
  Clock,
  SortAsc,
  SortDesc,
  Filter,
  BookOpen,
  Edit,
} from "lucide-react"

// Define the available sorting options
type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

export function UserStoryListPage() {
  const navigate = useNavigate()
  const userId = useAppSelector((state: RootState) => state.user).user?.userId

  // State for pagination, search, and sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Fetch paginated data for the specific user.
  // We now pass `searchQuery` and `sortOption` to the hook.
  // RTK Query will automatically re-fetch when these values change.
  const { data: paginatedResult, isLoading, isError } = useGetSpecificUserStoryQuery({
    userId: userId!,
    page: currentPage,
    perPage: 10,
    search: searchQuery,
    sort: sortOption,    
  }, {
    skip: !userId,
  })

  // The stories to display are now directly from the API response.
  // No more client-side filtering or sorting is needed.
  const displayedStories = paginatedResult?.data || []

  // Handlers for UI interactions
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to page 1 on new search to show relevant results
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
    setCurrentPage(1) // Reset to page 1 on sort change
  }
  
  const handleBack = () => navigate("/")
  const handleCreateStory = () => navigate("/create-story")

  const handleNextPage = () => {
    if (paginatedResult?.meta.next) {
      setCurrentPage(paginatedResult.meta.next)
    }
  };

  const handlePrevPage = () => {
    if (paginatedResult?.meta.prev) {
      setCurrentPage(paginatedResult.meta.prev)
    }
  };

  // Helper to generate a unique color for the list item accent
  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  // Helper to format date strings
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading your stories...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (isError || !userId || !paginatedResult) {
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
               We couldn't load your stories. Please ensure you are logged in and try again later.
             </p>
           </div>
         </div>
       </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <PenTool className="h-8 w-8 text-primary" />
                Your Stories
              </h1>
              <p className="mt-2 text-muted-foreground">Manage and view all the stories you've created</p>
            </div>
            <button
              onClick={handleCreateStory}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus size={18} />
              Create New Story
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity ${isSearchFocused ? "opacity-100" : "opacity-70"}`}
            >
              <Search size={18} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search your stories by title..."
              className="w-full pl-10 h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              aria-label="Search stories"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <div className="text-sm font-medium text-muted-foreground flex items-center mr-2">
              <Filter size={16} className="mr-1" />
              Sort by:
            </div>
            {(["newest", "oldest", "title-asc", "title-desc"] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleSortChange(option)}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                  sortOption === option
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                } transition-colors`}
              >
                {option.includes('newest') && <Clock size={14} />}
                {option.includes('oldest') && <Clock size={14} />}
                {option.includes('asc') && <SortAsc size={14} />}
                {option.includes('desc') && <SortDesc size={14} />}
                {option === 'newest' && 'Newest'}
                {option === 'oldest' && 'Oldest'}
                {option === 'title-asc' && 'Title A-Z'}
                {option === 'title-desc' && 'Title Z-A'}
              </button>
            ))}
          </div>
        </div>

        {/* Story List Section */}
        {paginatedResult.meta.total === 0 && !searchQuery ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
               <Book size={24} className="text-muted-foreground" />
             </div>
             <h3 className="text-xl font-medium mb-2">No stories yet</h3>
             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
               You haven't created any stories. Start your creative journey by writing your first one!
             </p>
             <button
               onClick={handleCreateStory}
               className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
             >
               <Plus size={18} />
               Create Your First Story
             </button>
           </div>
        ) : displayedStories.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                    <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No matching stories</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any stories matching your search query.
                </p>
                <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    Clear Search
                </button>
            </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {displayedStories.map((story) => {
                const accentColor = getStoryColor(story.title)
                return (
                  <div
                    key={story.id}
                    className="flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-300"
                    style={{ borderLeftColor: accentColor, borderLeftWidth: "4px" }}
                  >
                    <div className="p-4 flex-grow flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold mb-1">
                          {story.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock size={14} className="mr-1.5" />
                          <span>Created: {formatDate(story.dateCreated)}</span>
                          <span className="mx-2">·</span>
                          <span className={`font-medium ${story.isprivate ? 'text-yellow-600' : 'text-green-600'}`}>
                            {story.isprivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 sm:mt-0 flex-shrink-0">
                         <a
                           href={`/read-story/${story.id}`}
                           className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                         >
                           <BookOpen size={16} className="mr-2" />
                           Read
                         </a>
                         <a
                           href={`/update-story/${story.id}`}
                           className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                         >
                           <Edit size={16} className="mr-2" />
                           Edit
                         </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Pagination Controls */}
            {paginatedResult.meta.lastPage > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                        onClick={handlePrevPage}
                        disabled={!paginatedResult?.meta.prev}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </button>

                    <span className="text-sm font-medium text-muted-foreground">
                        Page {paginatedResult?.meta.currentPage} of {paginatedResult?.meta.lastPage}
                    </span>

                    <button 
                        onClick={handleNextPage}
                        disabled={!paginatedResult?.meta.next}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}