"use client"

import type React from "react"
import { useState } from "react"
import { useLoginMutation } from "../redux/api/authAPi"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [login] = useLoginMutation()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()
    const data = {
      username: username,
      password: password,
    }

    // If remember me is checked, we could store this in localStorage
    // This is just a placeholder for the functionality
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username)
    } else {
      localStorage.removeItem("rememberedUsername")
    }

    await login({ ...data }).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Login success!")
          navigate("/")
        } else if ("data" in res.error) {
          const errorData = res.error.data as { message: string }
          toast.error(errorData.message)
        } else {
          toast.error("Unknown error!")
        }
      }
    })
    setIsLoading(false)
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-10 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            StoryTell
          </h1>
          <p className="text-muted-foreground mt-2">Welcome back! Log in to continue your journey.</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span>Sign in</span>
                </Button>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-muted/30 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/register")
                }}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </p>
        </div> */}
      </div>
    </div>
  )
}

