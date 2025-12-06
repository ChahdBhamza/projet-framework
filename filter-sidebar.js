"use client"

import { useState } from "react"
import { X, Flame, DollarSign, Heart, ShoppingCart, Tag } from "lucide-react"
import { RangeFilter } from "@/components/range-filter"

export const FilterSidebar = ({ isOpen, onClose }) => {
  const [calorieRange, setCalorieRange] = useState([-110, 680])
  const [priceRange, setPriceRange] = useState([18, 35])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [favorites] = useState(0)
  const [cartCount] = useState(0)

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full transform bg-white transition-transform duration-300 ease-in-out md:static md:w-96 md:transform-none md:bg-white ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-filter-green px-6 py-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <p className="text-sm text-white/90">Refine your search</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto px-6 py-6 pb-20">
          {/* Quick Access Section */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase text-gray-600">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <div className="rounded-lg bg-red-500 p-2">
                    <Heart size={24} className="text-white fill-white" />
                  </div>
                </div>
                <p className="font-semibold text-gray-900">Favorites</p>
                <p className="text-lg font-bold text-gray-600">{favorites}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <div className="rounded-lg bg-blue-500 p-2">
                    <ShoppingCart size={24} className="text-white fill-white" />
                  </div>
                </div>
                <p className="font-semibold text-gray-900">Cart</p>
                <p className="text-lg font-bold text-gray-600">{cartCount}</p>
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-filter-green" />
                <h3 className="font-bold text-gray-900">Category</h3>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-filter-green"
            >
              <option>All Categories</option>
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Grains</option>
              <option>Proteins</option>
            </select>
          </div>

          {/* Calories Filter */}
          <div className="mb-6">
            <RangeFilter
              title="Calories"
              icon={<Flame size={20} />}
              unit="kcal"
              min={-110}
              max={680}
              step={10}
              initialMin={-110}
              initialMax={680}
              onValueChange={setCalorieRange}
            />
          </div>

          {/* Price Filter */}
          <div>
            <RangeFilter
              title="Price"
              icon={<DollarSign size={20} />}
              unit="TND"
              min={0}
              max={100}
              step={1}
              initialMin={18}
              initialMax={35}
              onValueChange={setPriceRange}
            />
          </div>
        </div>
      </aside>
    </>
  )
}
