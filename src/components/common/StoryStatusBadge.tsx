import type { StoryStatus } from "../../redux/types/story"

interface StoryStatusBadgeProps {
  status: StoryStatus
  className?: string
}

export function StoryStatusBadge({ status, className = "" }: StoryStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Ongoing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "Completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "Cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      case "Dropped":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} ${className}`}
    >
      {status}
    </span>
  )
}
