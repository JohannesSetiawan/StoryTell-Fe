"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGetUserInfoQuery, useUpdateProfileMutation } from "../redux/api/authAPi"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common"
import { User, Lock, Edit2, Save, X, Eye, EyeOff, Calendar, Shield } from "lucide-react"

export function ProfilePage() {
  const { data: userInfo, isLoading: isLoadingUserInfo, error } = useGetUserInfoQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [description, setDescription] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username)
      setDescription(userInfo.description || "")
    }
  }, [userInfo])

  useEffect(() => {
    if (error) {
      toast.error("Please login to view your profile")
      navigate("/login")
    }
  }, [error, navigate])

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
      if (username !== userInfo?.username) {
        updateData.username = username
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
      setIsEditing(false)
      setPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile")
    }
  }

  const handleCancel = () => {
    if (userInfo) {
      setUsername(userInfo.username)
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

  if (isLoadingUserInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-muted-foreground mt-2">View and manage your account information</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userInfo.username}</h2>
                <div className="flex items-center gap-2 mt-1">
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
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Username</label>
                  <div className="p-3 rounded-md bg-muted/30 text-foreground">{userInfo.username}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Description</label>
                  <div className="p-3 rounded-md bg-muted/30 text-foreground min-h-[100px]">
                    {userInfo.description || "No description provided"}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </Button>
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </div>
  )
}
