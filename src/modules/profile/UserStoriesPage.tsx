"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPublicStoriesByUsernameQuery } from "../../redux/api/storyApi"
import { useGetUserByUsernameQuery } from "../../redux/api/authAPi"
import { Book, ChevronLeft, ChevronRight, Search, SortAsc, SortDesc, Filter, BookOpen, Clock, User, Tag, X } from "lucide-react"
import { useGetAllTagsQuery } from "../../redux/api/tagApi"

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"

export function UserStoriesPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)

  const { data: userInfo } = useGetUserByUsernameQuery(username!, { skip: !username })
  const { data: tagsData } = useGetAllTagsQuery({ page: 1, limit: 100 })
  
  const { data: paginatedResult, isLoading, isError } = useGetPublicStoriesByUsernameQuery({
    username: username!,
    page: currentPage,
    perPage: 10,
    search: searchQuery,
    sort: sortOption,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
  }, {
    skip: !username,
  })

  const displayedStories = paginatedResult?.data || []

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
    setCurrentPage(1)
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
    setCurrentPage(1)
  }

  const handleClearTags = () => {
    setSelectedTagIds([])
    setCurrentPage(1)
  }

  const handleBack = () => navigate(`/profile/${username}`)

  const handleNextPage = () => {
    if (paginatedResult?.meta.next) {
      setCurrentPage(paginatedResult.meta.next)
    }
  }

  const handlePrevPage = () => {
    if (paginatedResult?.meta.prev) {
      setCurrentPage(paginatedResult.meta.prev)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStoryColor = (title: string) => {
    const hue = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading stories...</p>
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
            Back to Profile
          </button>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Book size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't load the stories right now. Please try again later.
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
            Back to Profile
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            {userInfo?.username}'s Stories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore public stories by {userInfo?.username}
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
              placeholder="Search stories by title..."
              className="w-full pl-10 h-12 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              aria-label="Search stories"
            />
          </div>
          
          {/* Sort Options */}
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

          {/* Tag Filter Section */}
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <Tag size={16} />
              Filter by Tags
              <span className="text-xs">
                {selectedTagIds.length > 0 && `(${selectedTagIds.length} selected)`}
              </span>
            </button>
            
            {selectedTagIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTagIds.map(tagId => {
                  const tag = tagsData?.data.find(t => t.id === tagId)
                  return tag ? (
                    <div
                      key={tagId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag.name}
                      <button
                        onClick={() => handleTagToggle(tagId)}
                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${tag.name} filter`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null
                })}
                <button
                  onClick={handleClearTags}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {showTagFilter && tagsData?.data && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                {tagsData.data.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-2 text-xs rounded-md border transition-all ${
                      selectedTagIds.includes(tag.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:border-primary/50"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
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
              {searchQuery 
                ? "We couldn't find any stories matching your search."
                : `${userInfo?.username} hasn't published any public stories yet.`
              }
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
