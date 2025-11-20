import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGetUserListQuery } from "../../redux/api/authAPi"
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react"

export function UserListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const perPage = 20

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error } = useGetUserListQuery({
    page,
    perPage,
    username: debouncedSearch,
  })

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Directory</h1>
          <p className="text-muted-foreground">
            Browse all registered users on Storytell
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search users by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">Failed to load users</p>
          </div>
        )}

        {/* User List */}
        {!isLoading && !error && data && (
          <>
            {/* Results Info */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {data.data.length > 0 ? (page - 1) * perPage + 1 : 0} -{" "}
              {Math.min(page * perPage, data.total)} of {data.total} users
            </div>

            {/* User Grid */}
            {data.data.length === 0 ? (
              <div className="text-center py-20">
                <User size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-xl font-medium text-muted-foreground">No users found</p>
                {debouncedSearch && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try a different search term
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {data.data.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.username)}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <User size={24} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {user.username}
                        </h3>
                        {user.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {user.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Joined {formatDate(user.dateCreated)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {data.totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
