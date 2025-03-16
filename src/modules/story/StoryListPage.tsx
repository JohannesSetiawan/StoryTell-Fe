"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import { useGetAllStoriesQuery } from "../../redux/api/storyApi"
import { useState, useEffect } from "react"
import { Book, ChevronLeft, Search, SortAsc, SortDesc, Filter, BookOpen, Clock, User } from "lucide-react"

type Story = {
  id: string
  title: string
  author: {
    username: string
  }
  dateCreated?: string // Adding this assuming it exists in your API response
}

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

export function StoryListPage() {
  const navigate = useNavigate()
  const { data: stories, isLoading } = useGetAllStoriesQuery()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [displayedStories, setDisplayedStories] = useState<Story[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Process stories when data changes or search/sort changes
  useEffect(() => {
    if (!stories) return

    // Filter stories based on search query
    const filtered = stories.filter(
      (story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Sort stories based on selected option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.dateCreated || "").getTime() - new Date(a.dateCreated || "").getTime()
        case "oldest":
          return new Date(a.dateCreated || "").getTime() - new Date(b.dateCreated || "").getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    setDisplayedStories(sorted)
  }, [stories, searchQuery, sortOption])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
  }

  const handleBack = () => {
    navigate("/")
  }

  // Generate a random pastel color based on the story title for the card accent
  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
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

          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Discover Stories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our collection of stories from talented writers around the world
          </p>
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
              placeholder="Search by title or author..."
              className="w-full pl-10 h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              aria-label="Search stories"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center mr-2">
              <Filter size={16} className="mr-1" />
              Sort by:
            </div>
            <button
              onClick={() => handleSortChange("newest")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "newest"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              } transition-colors`}
            >
              <Clock size={14} className="inline mr-1" />
              Newest
            </button>
            <button
              onClick={() => handleSortChange("oldest")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "oldest"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              } transition-colors`}
            >
              <Clock size={14} className="inline mr-1" />
              Oldest
            </button>
            <button
              onClick={() => handleSortChange("title-asc")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "title-asc"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              } transition-colors`}
            >
              <SortAsc size={14} className="inline mr-1" />
              Title A-Z
            </button>
            <button
              onClick={() => handleSortChange("title-desc")}
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "title-desc"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              } transition-colors`}
            >
              <SortDesc size={14} className="inline mr-1" />
              Title Z-A
            </button>
          </div>
        </div>

        {/* Story List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading stories...</p>
          </div>
        ) : displayedStories && displayedStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedStories.map((story) => {
              const accentColor = getStoryColor(story.title)

              return (
                <a href={`/read-story/${story.id}`} key={story.id} className="group h-full">
                  <div
                    className="h-full flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-y-[-4px]"
                    style={{ borderTopColor: accentColor, borderTopWidth: "4px" }}
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Book size={20} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(story.dateCreated)}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {story.title}
                      </h3>

                      <div className="flex items-center mt-4 text-sm text-muted-foreground">
                        <User size={14} className="mr-1" />
                        <span>By {story.author.username}</span>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-muted/30 border-t border-border">
                      <div className="text-sm font-medium text-primary flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        Read Story
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No stories found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any stories matching your search criteria. Try adjusting your search or check back later
              for new stories.
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

