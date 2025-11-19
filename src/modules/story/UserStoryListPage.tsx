"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useGetSpecificUserStoryQuery, useLazyGetSpecificStoryQuery } from "../../redux/api/storyApi"
import { useGetAllTagsQuery } from "../../redux/api/tagApi"
import { type RootState, useAppSelector } from "../../redux/store"
import { useState, useEffect } from "react"
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
  Tag,
  X,
  Download,
  Loader2,
} from "lucide-react"
import { StoryStatusBadge } from "../../components/common"
import type { Chapter } from "../../redux/types/story"
import toast from "react-hot-toast"
import { extractFilenameFromHeader, triggerBrowserDownload } from "../../utils/download"
import { getDefaultExportFormat, setDefaultExportFormat, type ExportFormat } from "../../utils/exportPreferences"

// Define the available sorting options
type SortOption = "newest" | "oldest" | "title-asc" | "title-desc"
const EXPORT_API_BASE = `${import.meta.env.VITE_API_URL}export`

const EXPORT_FORMAT_OPTIONS: { value: ExportFormat; label: string; helper: string }[] = [
  { value: "pdf", label: "PDF", helper: "Printer friendly" },
  { value: "epub", label: "EPUB", helper: "E-reader ready" },
  { value: "html", label: "HTML", helper: "Share as webpage" },
  { value: "txt", label: "Plain Text", helper: "Lightweight" },
]

export function UserStoryListPage() {
  const navigate = useNavigate()
  const userId = useAppSelector((state: RootState) => state.user).user?.userId
  const token = useAppSelector((state: RootState) => state.user).token

  // State for pagination, search, sorting, and tag filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [exportDialog, setExportDialog] = useState<{ storyId: string; title: string } | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | "">(() => getDefaultExportFormat() || "")
  const [rememberFormat, setRememberFormat] = useState(false)
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [fetchStoryForExport, { data: storyForExport, isFetching: isLoadingStory }] = useLazyGetSpecificStoryQuery()

  useEffect(() => {
    if (exportDialog) {
      fetchStoryForExport(exportDialog.storyId)
    } else {
      setSelectedChapterIds([])
      setSelectedFormat(getDefaultExportFormat() || "")
      setRememberFormat(false)
    }
  }, [exportDialog, fetchStoryForExport])

  useEffect(() => {
    if (storyForExport?.chapters) {
      setSelectedChapterIds(storyForExport.chapters.map((chapter: Chapter) => chapter.id))
    }
  }, [storyForExport])

  // Fetch tags for filtering
  const { data: tagsData } = useGetAllTagsQuery({ page: 1, limit: 100 })

  // Fetch paginated data for the specific user.
  // We now pass `searchQuery`, `sortOption`, and `tagIds` to the hook.
  // RTK Query will automatically re-fetch when these values change.
  const { data: paginatedResult, isLoading, isError } = useGetSpecificUserStoryQuery({
    userId: userId!,
    page: currentPage,
    perPage: 10,
    search: searchQuery,
    sort: sortOption,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,    
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

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
    setCurrentPage(1) // Reset to first page on tag filter change
  }

  const handleClearTags = () => {
    setSelectedTagIds([])
    setCurrentPage(1)
  }

  const handleOpenExportDialog = (storyId: string, title: string) => {
    setExportDialog({ storyId, title })
  }

  const handleCloseExportDialog = () => {
    if (isExporting) return
    setExportDialog(null)
  }

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    )
  }

  const handleToggleAllChapters = () => {
    if (!storyForExport?.chapters) return
    if (selectedChapterIds.length === storyForExport.chapters.length) {
      setSelectedChapterIds([])
      return
    }
    setSelectedChapterIds(storyForExport.chapters.map((chapter: Chapter) => chapter.id))
  }

  const handleConfirmExport = async () => {
    if (!exportDialog) return
    if (!selectedFormat) {
      toast.error("Please choose an export format")
      return
    }
    if (!token) {
      toast.error("Please login again to export your story")
      return
    }
    if (selectedChapterIds.length === 0) {
      toast.error("Select at least one chapter to export")
      return
    }

    try {
      setIsExporting(true)
      const url = new URL(`${EXPORT_API_BASE}/story/${exportDialog.storyId}/${selectedFormat}`)
      if (
        storyForExport?.chapters &&
        selectedChapterIds.length > 0 &&
        selectedChapterIds.length !== storyForExport.chapters.length
      ) {
        url.searchParams.set("chapterIds", selectedChapterIds.join(","))
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(errorMessage || "Failed to export story")
      }

      const blob = await response.blob()
      const fallbackName = `${exportDialog.title}.${selectedFormat}`
      const filename = extractFilenameFromHeader(response.headers.get("Content-Disposition"), fallbackName)
      triggerBrowserDownload(blob, filename)

      if (rememberFormat && selectedFormat) {
        setDefaultExportFormat(selectedFormat)
      }

      toast.success("Story export is ready!")
      setExportDialog(null)
    } catch (error: any) {
      toast.error(error?.message || "Failed to export story")
    } finally {
      setIsExporting(false)
    }
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
    <>
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
            
            {/* Selected Tags Display */}
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

            {/* Tag Selection Grid */}
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
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {story.title}
                          </h3>
                          <StoryStatusBadge status={story.storyStatus} />
                        </div>
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
                         <button
                           onClick={() => handleOpenExportDialog(story.id, story.title)}
                           className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-dashed border-primary/40 text-primary hover:bg-primary/10 h-9 px-3"
                         >
                           <Download size={16} className="mr-2" />
                           Export
                         </button>
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
    {exportDialog && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm px-4 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">Story Export</p>
              <h2 className="text-2xl font-semibold mt-1">{exportDialog.title}</h2>
              <p className="text-sm text-muted-foreground">Choose a format and chapter selection for this export</p>
            </div>
            <button
              onClick={handleCloseExportDialog}
              className="h-8 w-8 rounded-full inline-flex items-center justify-center border border-border hover:bg-muted"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Format</h3>
                {!selectedFormat && <span className="text-xs text-destructive">Required</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXPORT_FORMAT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selectedFormat === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold flex items-center justify-between">
                      {option.label}
                      {selectedFormat === option.value && <span className="text-xs text-primary">Selected</span>}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{option.helper}</p>
                  </button>
                ))}
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={rememberFormat}
                  onChange={(event) => setRememberFormat(event.target.checked)}
                />
                Remember this format for future exports
              </label>
            </section>
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Chapters</h3>
                <button
                  type="button"
                  onClick={handleToggleAllChapters}
                  className="text-xs font-medium text-primary hover:text-primary/80"
                  disabled={!storyForExport?.chapters || storyForExport.chapters.length === 0}
                >
                  {storyForExport?.chapters && selectedChapterIds.length === storyForExport.chapters.length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>
              {isLoadingStory ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  Fetching chapters...
                </div>
              ) : storyForExport?.chapters && storyForExport.chapters.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {storyForExport.chapters.map((chapter: Chapter, index: number) => (
                    <label
                      key={chapter.id}
                      className="flex items-start gap-3 p-3 border border-border rounded-xl hover:border-primary/50"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={selectedChapterIds.includes(chapter.id)}
                        onChange={() => handleChapterToggle(chapter.id)}
                      />
                      <div>
                        <p className="font-semibold">{chapter.title}</p>
                        <p className="text-xs text-muted-foreground">Chapter {chapter.order ?? index + 1}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No chapters available for this story.</p>
              )}
              {selectedChapterIds.length === 0 && !isLoadingStory && (
                <p className="text-xs text-destructive mt-2">Select at least one chapter to continue.</p>
              )}
            </section>
          </div>
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
            <button
              onClick={handleCloseExportDialog}
              className="h-10 px-4 rounded-md border border-input bg-background hover:bg-muted"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmExport}
              disabled={!selectedFormat || selectedChapterIds.length === 0 || isExporting}
              className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isExporting && <Loader2 size={18} className="mr-2 animate-spin" />}
              Export Story
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}