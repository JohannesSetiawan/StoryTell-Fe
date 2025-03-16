"use client"

import { useGetAllHistoriesQuery } from "../redux/api/historyApi"
import { type RootState, useAppSelector } from "../redux/store"
import { dateToString } from "../utils/utils"
import { useNavigate } from "react-router-dom"
import { Book, BookOpen, History, PenTool, Sparkles } from "lucide-react"

export function LandingPage() {
  const userId = useAppSelector((state: RootState) => state.user).user?.userId
  const navigate = useNavigate()

  if (userId) {
    const { data: historyData, isLoading } = useGetAllHistoriesQuery()
    return (
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent pb-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
                StoryTell
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                Create and Read Stories to Your Heart's Content!
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                Discover, share, and enjoy engaging stories anytime, anywhere.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
                <button
                  onClick={() => navigate("/read")}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <BookOpen size={20} />
                  Start Reading
                </button>
                <button
                  onClick={() => navigate("/your-story")}
                  className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <PenTool size={20} />
                  Write a Story
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50 dark:bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why StoryTell?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create</h3>
                <p className="text-muted-foreground">
                  Express yourself through storytelling. Our intuitive editor makes it easy to bring your ideas to life.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Read</h3>
                <p className="text-muted-foreground">
                  Explore a vast library of stories from writers around the world, across all genres and styles.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share</h3>
                <p className="text-muted-foreground">
                  Connect with a community of readers and writers who share your passion for storytelling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reading History Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <History className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-center">Your Reading History</h2>
            </div>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Pick up where you left off or revisit your favorite stories.
            </p>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : historyData && historyData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyData.map((history, index) => (
                  <a href={`/read-story/${history.storyId}`} key={history.id} className="group">
                    <div className="h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-y-[-4px]">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <div className="text-sm text-muted-foreground">{dateToString(history.date)}</div>
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {history.story.title}
                        </h3>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                          <Book className="h-4 w-4 mr-1" />
                          <span>Continue reading</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-8 text-center max-w-2xl mx-auto">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No reading history yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring stories and your most recent reads will appear here.
                </p>
                <button
                  onClick={() => navigate("/read")}
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  Discover Stories
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  } else {
    return (
      <div className="min-h-screen pt-20">
        {/* Hero Section for Non-Logged In Users */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent pb-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
                StoryTell
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                Your Gateway to Endless Stories
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                Create, read, and share stories to your heart's content. Join our community of storytellers today!
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-md"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 rounded-full bg-card border border-input text-card-foreground font-medium hover:bg-muted transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50 dark:bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Unleash Your Creativity</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Write Stories</h3>
                <p className="text-muted-foreground">
                  Express yourself through storytelling with our intuitive editor that makes it easy to bring your ideas
                  to life.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Read Anywhere</h3>
                <p className="text-muted-foreground">
                  Explore a vast library of stories from writers around the world, across all genres and styles.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join Community</h3>
                <p className="text-muted-foreground">
                  Connect with a community of readers and writers who share your passion for storytelling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join StoryTell today and become part of a growing community of storytellers and readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-colors shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

