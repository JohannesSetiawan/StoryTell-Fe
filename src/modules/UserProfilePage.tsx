"use client"

import { useNavigate, useParams, Link } from "react-router-dom"
import { useGetUserByUsernameQuery } from "../redux/api/authAPi"
import { type RootState, useAppSelector } from "../redux/store"
import { User, Calendar, Shield, ChevronLeft, Book, Edit2, Users } from "lucide-react"
import { FollowButton, FollowStats } from "../components/common"

export function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const currentUser = useAppSelector((state: RootState) => state.user).user
  
  const { data: userInfo, isLoading, error } = useGetUserByUsernameQuery(username!, {
    skip: !username,
  })

  const isOwnProfile = currentUser?.username === username

  const handleBack = () => navigate("/")
  const handleEditProfile = () => navigate("/profile")

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
            <div className="space-y-6">
              {/* Follow Stats */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <FollowStats userId={userInfo.userId} />
                <Link
                  to="/follows"
                  className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                >
                  <Users size={16} />
                  View Connections
                </Link>
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
                    onClick={handleEditProfile}
                    className="flex-1 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                )}
                {!isOwnProfile && (
                  <FollowButton userId={userInfo.userId} className="flex-1" />
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
          </div>
        </div>
      </div>
    </div>
  )
}
