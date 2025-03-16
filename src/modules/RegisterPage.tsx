"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRegisterMutation } from "../redux/api/authAPi"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common"
import { Eye, EyeOff, Lock, User, Check, X } from "lucide-react"

export function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  })

  const [register] = useRegisterMutation()
  const navigate = useNavigate()

  // Check password strength
  useEffect(() => {
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setPasswordCriteria(criteria)

    // Calculate strength (0-4)
    const strength = Object.values(criteria).filter(Boolean).length
    setPasswordStrength(strength)
  }, [password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    event.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      setIsLoading(false)
      return
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions")
      setIsLoading(false)
      return
    }

    const data = {
      username: username,
      password: password,
    }

    await register({ ...data }).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Registration successful!")
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

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(event.target.checked)
  }

  // Get color for password strength indicator
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 pb-10 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            StoryTell
          </h1>
          <p className="text-muted-foreground mt-2">Create an account to start your storytelling journey</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

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
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
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

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Password strength:{" "}
                      {passwordStrength === 0
                        ? "Very weak"
                        : passwordStrength === 1
                          ? "Weak"
                          : passwordStrength === 2
                            ? "Fair"
                            : passwordStrength === 3
                              ? "Good"
                              : "Strong"}
                    </div>

                    {/* Password criteria */}
                    <ul className="text-xs space-y-1 mt-2">
                      <li className="flex items-center gap-1">
                        {passwordCriteria.length ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-red-500" />
                        )}
                        <span className={passwordCriteria.length ? "text-green-500" : "text-muted-foreground"}>
                          At least 8 characters
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        {passwordCriteria.lowercase ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-red-500" />
                        )}
                        <span className={passwordCriteria.lowercase ? "text-green-500" : "text-muted-foreground"}>
                          One lowercase letter
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        {passwordCriteria.uppercase ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-red-500" />
                        )}
                        <span className={passwordCriteria.uppercase ? "text-green-500" : "text-muted-foreground"}>
                          One uppercase letter
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        {passwordCriteria.number ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-red-500" />
                        )}
                        <span className={passwordCriteria.number ? "text-green-500" : "text-muted-foreground"}>
                          One number
                        </span>
                      </li>
                      <li className="flex items-center gap-1">
                        {passwordCriteria.special ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-red-500" />
                        )}
                        <span className={passwordCriteria.special ? "text-green-500" : "text-muted-foreground"}>
                          One special character
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`pl-10 w-full h-10 rounded-md border ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-input focus:ring-primary"
                    } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
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
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={acceptTerms}
                    onChange={handleTermsChange}
                    required
                  />
                </div>
                {/* <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div> */}
              </div>

              <div>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={(password !== confirmPassword)}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-muted/30 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/login")
                }}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

