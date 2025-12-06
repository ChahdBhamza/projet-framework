"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function RangeFilter({ title, icon, unit = "", min, max, step = 1, initialMin, initialMax, onValueChange }) {
  const [values, setValues] = useState([initialMin ?? min, initialMax ?? max])
  const [isOpen, setIsOpen] = useState(true)

  const handleValueChange = (newValues) => {
    const sortedValues = newValues.sort((a, b) => a - b)
    setValues([sortedValues[0], sortedValues[1]])
    onValueChange?.([sortedValues[0], sortedValues[1]])
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg text-filter-green">{icon}</span>
          <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-filter-green px-3 py-1 font-bold text-white text-sm">
            {values[0]} - {values[1]} {unit}
          </span>
          <ChevronUp size={20} className={`text-gray-400 transition-transform ${isOpen ? "" : "rotate-180"}`} />
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="space-y-4">
          {/* Slider */}
          <Slider min={min} max={max} step={step} value={values} onValueChange={handleValueChange} className="py-2" />

          {/* Min and Max Labels */}
          <div className="flex justify-between text-sm">
            <span className="font-bold text-filter-green">
              {values[0]} {unit}
            </span>
            <span className="font-bold text-filter-green">
              {values[1]} {unit}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
