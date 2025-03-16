"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface SliderPickerProps {
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  initialValue?: number
}

const SliderPicker: React.FC<SliderPickerProps> = ({ onChange, min = 1, max = 10, step = 1, initialValue = 10 }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10)
    setValue(newValue)
    onChange(newValue)
  }

  // Calculate percentage for background gradient
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full px-2">
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
          }}
        />
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
            <span key={num} className={value === num ? "font-bold text-primary" : ""}>
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SliderPicker

