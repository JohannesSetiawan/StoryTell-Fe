"use client"

import { useState, useEffect } from "react"
import { type RootState, useAppSelector } from "../redux/store"
import { useDispatch } from "react-redux"
import { logout } from "../redux/slice"
import { useNavigate, useLocation } from "react-router-dom"
import ToggleTheme from "./common/ToggleTheme"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const user_token = useAppSelector((state: RootState) => state.user).token
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

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

  const handleHome = () => {
    navigate("/")
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4 p-4">
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4 p-4">
              <button
                onClick={handleHome}
                className={`${navLinkClasses} ${isActive("/") ? activeNavLinkClasses : ""} py-2`}
              >
                Home
              </button>
              <button
                onClick={handleRead}
                className={`${navLinkClasses} ${isActive("/read") ? activeNavLinkClasses : ""} py-2`}
              >
                Read
              </button>
              <button
                onClick={handleYourStory}
                className={`${navLinkClasses} ${isActive("/your-story") ? activeNavLinkClasses : ""} py-2`}
              >
                Your Story
              </button>
              <button onClick={handleLogout} className="text-destructive font-medium py-2">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    )
  }
}

