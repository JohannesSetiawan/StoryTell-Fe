"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useGetAllStoriesQuery } from "../../redux/api/storyApi"
import { useState } from "react"
import { Book, ChevronLeft, ChevronRight, Search, SortAsc, SortDesc, Filter, BookOpen, Clock, User } from "lucide-react"

// Define the available sorting options
type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

export function StoryListPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Fetch paginated data, now passing search and sort parameters to the API hook.
  // RTK Query will handle re-fetching automatically when these parameters change.
  const { data: paginatedResult, isLoading, isError } = useGetAllStoriesQuery({
    page: currentPage,
    perPage: 10,
    search: searchQuery,
    sort: sortOption,
  })

  // The stories to display are now directly from the API response.
  // No more client-side filtering or sorting is needed.
  const displayedStories = paginatedResult?.data || []

  // Handlers for search, sort, and navigation
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
    setCurrentPage(1) // Reset to first page on sort change
  }
  
  const handleBack = () => navigate("/")

  const handleNextPage = () => {
    if (paginatedResult?.meta.next) {
      setCurrentPage(paginatedResult.meta.next);
    }
  };

  const handlePrevPage = () => {
    if (paginatedResult?.meta.prev) {
      setCurrentPage(paginatedResult.meta.prev);
    }
  };

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

  // Generate a random pastel color for each story card based on its title
  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading stories...</p>
        </div>
      </div>
    );
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
               We couldn't load stories right now. Please try again later.
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
            <BookOpen className="h-8 w-8 text-primary" />
            Discover Stories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our collection of stories from talented writers around the world
          </p>
        </div>

        {/* Search and Filter Controls */}
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
              placeholder="Search by title or author..."
              className="w-full pl-10 h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              aria-label="Search stories"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <div className="text-sm font-medium text-muted-foreground flex items-center mr-2">
              <Filter size={16} className="mr-1" />
              Sort by:
            </div>
            {/* Sort Buttons */}
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

        {/* Story List or Empty State */}
        {displayedStories.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {displayedStories.map((story) => {
                const accentColor = getStoryColor(story.title)
                return (
                  <a href={`/read-story/${story.id}`} key={story.id} className="group">
                    <div
                      className="flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-x-1"
                      style={{ borderLeftColor: accentColor, borderLeftWidth: "4px" }}
                    >
                      <div className="p-4 flex-grow flex items-center gap-4">
                        <div
                          className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-primary-foreground"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Book size={20} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                            {story.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User size={14} className="mr-1.5" />
                            <span>By {story.author.username}</span>
                            <span className="mx-2">·</span>
                            <Clock size={14} className="mr-1.5" />
                            <span>{formatDate(story.dateCreated)}</span>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center text-sm font-medium text-primary ml-4">
                          <BookOpen size={16} className="mr-2" />
                          Read Story
                          <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
            
            {/* Pagination Controls */}
            {paginatedResult && paginatedResult.meta.lastPage > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                        onClick={handlePrevPage}
                        disabled={!paginatedResult.meta.prev}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </button>
    
                    <span className="text-sm font-medium text-muted-foreground">
                        Page {paginatedResult.meta.currentPage} of {paginatedResult.meta.lastPage}
                    </span>
    
                    <button 
                        onClick={handleNextPage}
                        disabled={!paginatedResult.meta.next}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                </div>
            )}
          </>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No stories found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any stories matching your search. Try adjusting your filters or check back later.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
