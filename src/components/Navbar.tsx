"use client"

import { useState, useEffect, useRef } from "react"
import { type RootState, useAppSelector } from "../redux/store"
import { useDispatch } from "react-redux"
import { logout } from "../redux/slice"
import { useNavigate, useLocation } from "react-router-dom"
import ToggleTheme from "./common/ToggleTheme"
import { Menu, X, Shield, ChevronDown } from "lucide-react"
import { useGetUnreadCountQuery } from "../redux/api/messageApi"

export function Navbar() {
  const user_token = useAppSelector((state: RootState) => state.user).token
  const user = useAppSelector((state: RootState) => state.user).user
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [mobileStoryDropdownOpen, setMobileStoryDropdownOpen] = useState(false)
  const [mobileCollectionsDropdownOpen, setMobileCollectionsDropdownOpen] = useState(false)
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false)
  const collectionsDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  
  // Fetch unread message count only when user is logged in
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user_token,
    pollingInterval: 30000, // Poll every 30 seconds
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll' // Prevent layout shift
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll' // Prevent layout shift
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsCollectionsDropdownOpen(false)
    setIsProfileDropdownOpen(false)
    setMobileStoryDropdownOpen(false)
    setMobileCollectionsDropdownOpen(false)
    setMobileUserDropdownOpen(false)
  }, [location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionsDropdownRef.current && !collectionsDropdownRef.current.contains(event.target as Node)) {
        setIsCollectionsDropdownOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleRegister = () => {
    navigate("/register")
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleYourStory = () => {
    navigate("/your-story")
  }

  const handleRead = () => {
    navigate("/read")
  }

  const handleHistory = () => {
    navigate("/history")
  }

  const handleBookmark = () => {
    navigate("/bookmark")
  }

  const handleFeed = () => {
    navigate("/feed")
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleProfile = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`)
    } else {
      navigate("/profile")
    }
  }

  const handleAdmin = () => {
    navigate("/admin")
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 w-full 
    transition-all duration-300 ease-in-out
    ${scrolled ? "shadow-md py-2" : "py-4"}
    ${scrolled && !user_token ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" : ""}
    ${user_token ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" : ""}
  `

  const navLinkClasses = "font-medium transition-all duration-200 ease-in-out hover:text-primary"
  const activeNavLinkClasses = "font-bold text-primary"

  if (!user_token) {
    return (
      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-xl font-bold cursor-pointer" onClick={handleHome}>
            Storytell
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ToggleTheme />
            <button
              onClick={() => navigate("/read")}
              className={`${navLinkClasses} ${isActive("/read") ? activeNavLinkClasses : ""}`}
            >
              Browse Stories
            </button>
            <div className="relative" ref={collectionsDropdownRef}>
              <button
                onClick={() => setIsCollectionsDropdownOpen(!isCollectionsDropdownOpen)}
                className={`${navLinkClasses} ${location.pathname.includes("/collection") ? activeNavLinkClasses : ""} inline-flex items-center gap-1`}
              >
                Collections
                <ChevronDown size={16} className={`transition-transform ${isCollectionsDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isCollectionsDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigate("/discover-collections")}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground"
                  >
                    Discover Collections
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleRegister}
              className={`${navLinkClasses} ${isActive("/register") ? activeNavLinkClasses : ""}`}
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Login
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <ToggleTheme />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-4 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top max-h-[calc(100vh-64px)] overflow-y-auto"
            style={{ 
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex flex-col space-y-4 p-4">
              <button
                onClick={() => navigate("/read")}
                className={`${navLinkClasses} ${isActive("/read") ? activeNavLinkClasses : ""} py-2`}
              >
                Browse Stories
              </button>
              <button
                onClick={() => navigate("/discover-collections")}
                className={`${navLinkClasses} ${isActive("/discover-collections") ? activeNavLinkClasses : ""} py-2`}
              >
                Discover Collections
              </button>
              <button
                onClick={handleRegister}
                className={`${navLinkClasses} ${isActive("/register") ? activeNavLinkClasses : ""} py-2`}
              >
                Register
              </button>
              <button
                onClick={handleLogin}
                className={`${navLinkClasses} ${isActive("/login") ? activeNavLinkClasses : ""} py-2`}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
    )
  } else {
    return (
      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-xl font-bold cursor-pointer" onClick={handleHome}>
            Storytell
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ToggleTheme />
            <button onClick={handleHome} className={`${navLinkClasses} ${isActive("/") ? activeNavLinkClasses : ""}`}>
              Home
            </button>
            <button
              onClick={handleRead}
              className={`${navLinkClasses} ${isActive("/read") ? activeNavLinkClasses : ""}`}
            >
              Read
            </button>
            <button
              onClick={handleYourStory}
              className={`${navLinkClasses} ${isActive("/your-story") ? activeNavLinkClasses : ""}`}
            >
              Your Story
            </button>
            <button
              onClick={handleHistory}
              className={`${navLinkClasses} ${isActive("/history") ? activeNavLinkClasses : ""}`}
            >
              History
            </button>
            <button
              onClick={handleBookmark}
              className={`${navLinkClasses} ${isActive("/bookmark") ? activeNavLinkClasses : ""}`}
            >
              Bookmark
            </button>
            <button
              onClick={handleFeed}
              className={`${navLinkClasses} ${isActive("/feed") ? activeNavLinkClasses : ""}`}
            >
              Feed
            </button>
            <div className="relative" ref={collectionsDropdownRef}>
              <button
                onClick={() => setIsCollectionsDropdownOpen(!isCollectionsDropdownOpen)}
                className={`${navLinkClasses} ${location.pathname.includes("/collection") ? activeNavLinkClasses : ""} inline-flex items-center gap-1`}
              >
                Collections
                <ChevronDown size={16} className={`transition-transform ${isCollectionsDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isCollectionsDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => navigate("/collections")}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground"
                  >
                    My Collections
                  </button>
                  <button
                    onClick={() => navigate("/discover-collections")}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground"
                  >
                    Discover Collections
                  </button>
                </div>
              )}
            </div>
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`${navLinkClasses} ${location.pathname.startsWith("/profile") || location.pathname === "/users" || location.pathname.startsWith("/message") ? activeNavLinkClasses : ""} inline-flex items-center gap-1 relative`}
              >
                Profile
                <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                {unreadData?.hasUnread && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
                )}
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/users")}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground"
                  >
                    User Directory
                  </button>
                  <button
                    onClick={() => navigate("/messages")}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-foreground relative"
                  >
                    Messages
                    {unreadData?.hasUnread && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 bg-destructive rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
            {user?.isAdmin && (
              <button
                onClick={handleAdmin}
                className={`${navLinkClasses} ${isActive("/admin") ? activeNavLinkClasses : ""} inline-flex items-center gap-1`}
              >
                <Shield size={16} />
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <ToggleTheme />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-4 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top max-h-[calc(100vh-64px)] overflow-y-auto"
            style={{ 
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex flex-col p-4">
              {/* 1. Home */}
              <button
                onClick={handleHome}
                className={`${navLinkClasses} ${isActive("/") ? activeNavLinkClasses : ""} py-3 text-left`}
              >
                Home
              </button>
              
              <div className="h-px bg-border my-2"></div>

              {/* 2. Story Dropdown */}
              <div>
                <button
                  onClick={() => setMobileStoryDropdownOpen(!mobileStoryDropdownOpen)}
                  className={`${navLinkClasses} ${["/read", "/your-story", "/history", "/bookmark"].some(path => isActive(path)) ? activeNavLinkClasses : ""} py-3 text-left w-full flex items-center justify-between`}
                >
                  <span>Story</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileStoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileStoryDropdownOpen && (
                  <div className="pl-4 space-y-1 mt-2 mb-2">
                    <button
                      onClick={handleRead}
                      className={`${navLinkClasses} ${isActive("/read") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      Read Story
                    </button>
                    <button
                      onClick={handleYourStory}
                      className={`${navLinkClasses} ${isActive("/your-story") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      Your Story
                    </button>
                    <button
                      onClick={handleHistory}
                      className={`${navLinkClasses} ${isActive("/history") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      History
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`${navLinkClasses} ${isActive("/bookmark") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      Bookmark
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-border my-2"></div>

              {/* 3. Feed */}
              <button
                onClick={handleFeed}
                className={`${navLinkClasses} ${isActive("/feed") ? activeNavLinkClasses : ""} py-3 text-left`}
              >
                Feed
              </button>

              <div className="h-px bg-border my-2"></div>

              {/* 4. Collections Dropdown */}
              <div>
                <button
                  onClick={() => setMobileCollectionsDropdownOpen(!mobileCollectionsDropdownOpen)}
                  className={`${navLinkClasses} ${["/collections", "/discover-collections"].some(path => location.pathname.includes(path.split("/")[1])) ? activeNavLinkClasses : ""} py-3 text-left w-full flex items-center justify-between`}
                >
                  <span>Collections</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileCollectionsDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCollectionsDropdownOpen && (
                  <div className="pl-4 space-y-1 mt-2 mb-2">
                    <button
                      onClick={() => navigate("/collections")}
                      className={`${navLinkClasses} ${isActive("/collections") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      My Collections
                    </button>
                    <button
                      onClick={() => navigate("/discover-collections")}
                      className={`${navLinkClasses} ${isActive("/discover-collections") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      Discover
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-border my-2"></div>

              {/* 5. User Dropdown */}
              <div>
                <button
                  onClick={() => setMobileUserDropdownOpen(!mobileUserDropdownOpen)}
                  className={`${navLinkClasses} ${["/profile", "/users", "/messages", "/message/"].some(path => location.pathname.includes(path.split("/")[1])) ? activeNavLinkClasses : ""} py-3 text-left w-full flex items-center justify-between relative`}
                >
                  <span>User</span>
                  <div className="flex items-center gap-2">
                    {unreadData?.hasUnread && (
                      <span className="h-2 w-2 bg-destructive rounded-full"></span>
                    )}
                    <ChevronDown size={16} className={`transition-transform ${mobileUserDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {mobileUserDropdownOpen && (
                  <div className="pl-4 space-y-1 mt-2 mb-2">
                    <button
                      onClick={handleProfile}
                      className={`${navLinkClasses} ${location.pathname.startsWith("/profile") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/users")}
                      className={`${navLinkClasses} ${isActive("/users") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm`}
                    >
                      User Directory
                    </button>
                    <button
                      onClick={() => navigate("/messages")}
                      className={`${navLinkClasses} ${isActive("/messages") || location.pathname.startsWith("/message/") ? activeNavLinkClasses : ""} py-2 text-left w-full text-sm relative inline-flex items-center gap-2`}
                    >
                      <span>Messages</span>
                      {unreadData?.hasUnread && (
                        <span className="h-2 w-2 bg-destructive rounded-full"></span>
                      )}
                    </button>
                    <div className="h-px bg-border my-2"></div>
                    <button 
                      onClick={handleLogout} 
                      className="text-destructive font-medium py-2 text-left w-full text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    )
  }
}

