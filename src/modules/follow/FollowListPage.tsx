"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetFollowersQuery, useGetFollowingQuery } from "../../redux/api/followApi"
import { ChevronLeft, Users, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

type TabType = 'followers' | 'following'

export function FollowListPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('followers')

  const { data: followers, isLoading: isLoadingFollowers } = useGetFollowersQuery()
  const { data: following, isLoading: isLoadingFollowing } = useGetFollowingQuery()

  const handleBack = () => navigate(-1)

  const isLoading = activeTab === 'followers' ? isLoadingFollowers : isLoadingFollowing
  const data = activeTab === 'followers' ? followers : following

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Connections
          </h1>
          <p className="mt-2 text-muted-foreground">
            View your followers and the authors you follow
          </p>
        </div>

        <div className="mb-6 border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'followers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Followers {followers && `(${followers.length})`}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'following'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Following {following && `(${following.length})`}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading...</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                    {item.user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <Link
                      to={`/profile/${item.user.username}`}
                      className="font-semibold text-lg hover:text-primary transition-colors"
                    >
                      {item.user.username}
                    </Link>
                    {item.user.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.user.description}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  to={`/profile/${item.user.username}`}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <UserPlus size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {activeTab === 'followers'
                ? 'When authors follow you, they will appear here.'
                : 'Start following your favorite authors to see their latest updates in your feed.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
