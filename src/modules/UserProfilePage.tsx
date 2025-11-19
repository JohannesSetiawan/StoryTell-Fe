"use client"

import { useNavigate, useParams, Link } from "react-router-dom"
import { useGetUserByUsernameQuery, useUpdateProfileMutation } from "../redux/api/authAPi"
import { type RootState, useAppSelector } from "../redux/store"
import { User, Calendar, Shield, ChevronLeft, Book, Edit2, Users, Lock, Save, X, Eye, EyeOff, Download } from "lucide-react"
import { FollowButton, FollowStats, Button } from "../components/common"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { extractFilenameFromHeader, triggerBrowserDownload } from "../utils/download"
import {
  ALL_BACKUP_SECTIONS,
  getBackupSections,
  setBackupSections,
  getDefaultExportFormat,
  setDefaultExportFormat,
  type BackupSection,
  type ExportFormat,
} from "../utils/exportPreferences"

export function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const authState = useAppSelector((state: RootState) => state.user)
  const currentUser = authState.user
  const token = authState.token
  
  const { data: userInfo, isLoading, error } = useGetUserByUsernameQuery(username!, {
    skip: !username,
  })
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const isOwnProfile = currentUser?.username === username

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [description, setDescription] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Initialize form values when userInfo loads
  useEffect(() => {
    if (userInfo) {
      setEditUsername(userInfo.username)
      setDescription(userInfo.description || "")
    }
  }, [userInfo])

  const handleBack = () => navigate("/")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validate passwords match if password is being changed
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const updateData: { username?: string; password?: string; description?: string } = {}
      
      // Only include fields that have changed
      if (editUsername !== userInfo?.username) {
        updateData.username = editUsername
      }
      if (password) {
        updateData.password = password
      }
      if (description !== (userInfo?.description || "")) {
        updateData.description = description
      }

      if (Object.keys(updateData).length === 0) {
        toast.error("No changes to save")
        return
      }

      await updateProfile(updateData).unwrap()
      toast.success("Profile updated successfully!")
      
      // If username changed, navigate to new profile URL
      if (updateData.username) {
        navigate(`/profile/${updateData.username}`, { replace: true })
      }
      
      setIsEditing(false)
      setPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile")
    }
  }

  const handleCancel = () => {
    if (userInfo) {
      setEditUsername(userInfo.username)
      setDescription(userInfo.description || "")
    }
    setPassword("")
    setConfirmPassword("")
    setIsEditing(false)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        <div className="max-w-md w-full">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </button>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <User size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">User not found</h3>
            <p className="text-muted-foreground mb-6">
              The user profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <div className="w-full max-w-2xl">
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {isOwnProfile ? "Your Profile" : `${userInfo.username}'s Profile`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isOwnProfile ? "View and manage your account" : "View user information and stories"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary">
                <User size={40} />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold">{userInfo.username}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {userInfo.isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    Joined {formatDate(userInfo.dateCreated)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                {/* Follow Stats */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <FollowStats userId={userInfo.id} />
                  {isOwnProfile && (
                    <Link
                      to="/follows"
                      className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    >
                      <Users size={16} />
                      View Connections
                    </Link>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">About</label>
                  <div className="p-3 rounded-md bg-muted/30 text-foreground min-h-[100px]">
                    {userInfo.description || "No description provided"}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  )}
                  {!isOwnProfile && (
                    <FollowButton userId={userInfo.id} className="flex-1" />
                  )}
                  <button
                    onClick={() => navigate(`/profile/${username}/stories`)}
                    className={`${isOwnProfile ? 'flex-1' : 'flex-1'} h-10 rounded-md border border-input bg-background hover:bg-muted transition-colors inline-flex items-center justify-center gap-2`}
                  >
                    <Book size={16} />
                    View Stories
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      placeholder="Enter your username"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    placeholder="Tell us about yourself..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium">
                    New Password <span className="text-muted-foreground text-xs">(Leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-muted-foreground" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {password && (
                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-muted-foreground" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 h-10 rounded-md border border-input bg-background hover:bg-muted transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    loading={isUpdating}
                    className="flex-1 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <BackupPreferencesCard token={token} />
        )}
      </div>
    </div>
  )
}

type BackupPreferencesCardProps = {
  token?: string | null
}

function BackupPreferencesCard({ token }: BackupPreferencesCardProps) {
  const [sections, setSections] = useState<BackupSection[]>(
    () => getBackupSections() || [...ALL_BACKUP_SECTIONS],
  )
  const [formatChoice, setFormatChoice] = useState<ExportFormat | "">(() => getDefaultExportFormat() || "")
  const [isDownloading, setIsDownloading] = useState(false)

  const sectionLabels: Record<BackupSection, string> = {
    stories: "Stories",
    chapters: "Chapters",
    bookmarks: "Bookmarks",
    tags: "Tags",
    ratings: "Ratings",
    followers: "Followers",
    following: "Following",
    "read-history": "Reading History",
  }

  const formatOptions: { value: ExportFormat; label: string }[] = [
    { value: "pdf", label: "PDF" },
    { value: "epub", label: "EPUB" },
    { value: "html", label: "HTML" },
    { value: "txt", label: "Plain Text" },
  ]

  const handleSectionToggle = (section: BackupSection) => {
    setSections((prev) => {
      const exists = prev.includes(section)
      if (exists && prev.length === 1) {
        toast.error("Keep at least one data group in your backup")
        return prev
      }
      return exists ? prev.filter((item) => item !== section) : [...prev, section]
    })
  }

  const handleSelectAll = () => {
    setSections([...ALL_BACKUP_SECTIONS])
  }

  const handleSavePreferences = () => {
    if (!formatChoice) {
      toast.error("Choose a default export format")
      return
    }
    setBackupSections(sections)
    setDefaultExportFormat(formatChoice)
    toast.success("Backup preferences saved")
  }

  const handleDownloadBackup = async () => {
    if (!token) {
      toast.error("Please login again to download your backup")
      return
    }

    try {
      setIsDownloading(true)
      const url = new URL(`${import.meta.env.VITE_API_URL}export/backup`)
      if (sections.length > 0 && sections.length !== ALL_BACKUP_SECTIONS.length) {
        url.searchParams.set("include", sections.join(","))
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        let message = "Failed to download backup"
        try {
          const payload = await response.json()
          message = payload?.message || message
        } catch (error) {
          // ignore parse errors
        }
        throw new Error(message)
      }

      const blob = await response.blob()
      const fallbackName = `storytell-backup-${Date.now()}.zip`
      const filename = extractFilenameFromHeader(response.headers.get("Content-Disposition"), fallbackName)
      triggerBrowserDownload(blob, filename)
      toast.success("Backup downloaded")
    } catch (error: any) {
      toast.error(error?.message || "Unable to download backup")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mt-10 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Backup Preferences</p>
          <h3 className="text-2xl font-semibold mt-1">Story Export & Backup</h3>
          <p className="text-sm text-muted-foreground">
            Decide which datasets belong in your backup and set a default export format.
          </p>
        </div>
        <div className="text-right text-sm text-muted-foreground hidden sm:block">
          <p>{sections.length === ALL_BACKUP_SECTIONS.length ? "Everything is included" : `${sections.length} / ${ALL_BACKUP_SECTIONS.length} sections selected`}</p>
          <button
            onClick={handleSelectAll}
            className="text-primary hover:text-primary/80 text-xs mt-1"
          >
            Select all
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <section>
          <h4 className="text-sm font-semibold mb-2">Data Groups</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_BACKUP_SECTIONS.map((section) => (
              <label
                key={section}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                  sections.includes(section)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={sections.includes(section)}
                  onChange={() => handleSectionToggle(section)}
                  className="h-4 w-4"
                />
                <span>{sectionLabels[section]}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold mb-2">Default Story Export Format</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="flex-1 h-10 rounded-md border border-input bg-background px-3"
              value={formatChoice}
              onChange={(event) => setFormatChoice(event.target.value as ExportFormat)}
            >
              <option value="" disabled>
                Select a format
              </option>
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSavePreferences}
              className="flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground h-10 px-4 hover:bg-primary/90"
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>
          {!formatChoice && <p className="text-xs text-destructive mt-1">Pick a default to speed up exports later.</p>}
        </section>

        <section className="border border-dashed border-border rounded-xl p-4 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold">Manual Backup</p>
              <p className="text-sm text-muted-foreground">Download everything (or selected sections) instantly.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Backup
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
