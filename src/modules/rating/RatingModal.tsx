"use client"

import { useState, useEffect } from "react"
import SliderPicker from "../../components/common/NumberSlider"
import { useCreateRatingMutation, useUpdateRatingMutation } from "../../redux/api/ratingApi"
import toast from "react-hot-toast"
import { Button } from "../../components/common"
import { Star, X } from "lucide-react"

interface RatingModalProps {
  prevRating: string
  storyId: string
  toggler: () => void
}

export default function RatingModal(props: RatingModalProps) {
  const [rate, setRate] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [createRating] = useCreateRatingMutation()
  const [updateRating] = useUpdateRatingMutation()

  // Animation effect when opening the modal
  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const handleChange = (value: number) => {
    setRate(value)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const body = { rate }

    try {
      if (props.prevRating) {
        await updateRating({ updateData: body, ratingId: props.prevRating }).unwrap()
        toast.success("Rating updated successfully!")
      } else {
        await createRating({ body, storyId: props.storyId }).unwrap()
        toast.success("Rating submitted successfully!")
      }
      handleClose()
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    // Delay the actual closing to allow for animation
    setTimeout(() => {
      props.toggler()
    }, 300)
  }

  // Generate stars based on rating
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <Star
          key={i}
          size={28}
          className={`transition-all duration-300 ${
            i <= rate ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
        />,
      )
    }
    return stars
  }

  // Get descriptive text based on rating
  const getRatingText = () => {
    if (rate <= 2) return "Poor"
    else if (rate <= 4) return "Fair"
    else if (rate <= 6) return "Good"
    else if (rate <= 8) return "Very Good"
    else return "Excellent"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Rate this Story
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stars display */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">{renderStars()}</div>
          </div>

          {/* Rating text */}
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-primary">{rate}</span>
            <span className="text-2xl font-bold text-foreground">/10</span>
            <p className="text-muted-foreground mt-1">{getRatingText()}</p>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <SliderPicker onChange={handleChange} initialValue={rate} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleClose}
              className="px-4 py-2 border border-input bg-background hover:bg-muted text-foreground transition-colors"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {props.prevRating ? "Update Rating" : "Submit Rating"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

