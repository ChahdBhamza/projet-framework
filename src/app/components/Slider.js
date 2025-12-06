"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const Slider = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    formatLabel = (val) => val,
    className = "",
}) => {
    const [isDragging, setIsDragging] = useState(null); // null, 0 (min), or 1 (max)
    const trackRef = useRef(null);
    const isDual = Array.isArray(value);

    // Helper to get percentage from value
    const getPercentage = useCallback(
        (val) => {
            return ((val - min) / (max - min)) * 100;
        },
        [min, max]
    );

    // Helper to get value from percentage
    const getValue = useCallback(
        (percentage) => {
            const rawValue = min + (percentage / 100) * (max - min);
            const steppedValue = Math.round(rawValue / step) * step;
            return Math.min(Math.max(steppedValue, min), max);
        },
        [min, max, step]
    );

    const handleMouseDown = (index) => (e) => {
        e.preventDefault();
        setIsDragging(index);
    };

    const handleTouchStart = (index) => (e) => {
        setIsDragging(index);
    };

    useEffect(() => {
        const handleMove = (clientX) => {
            if (isDragging === null || !trackRef.current) return;

            const rect = trackRef.current.getBoundingClientRect();
            const percentage = Math.min(
                Math.max(((clientX - rect.left) / rect.width) * 100, 0),
                100
            );
            const newValue = getValue(percentage);

            if (isDual) {
                const newValues = [...value];

                // Prevent crossing
                if (isDragging === 0) {
                    newValues[0] = Math.min(newValue, value[1] - step);
                } else {
                    newValues[1] = Math.max(newValue, value[0] + step);
                }

                // Only update if changed
                if (newValues[isDragging] !== value[isDragging]) {
                    onChange(newValues);
                }
            } else {
                if (newValue !== value) {
                    onChange(newValue);
                }
            }
        };

        const handleMouseMove = (e) => handleMove(e.clientX);
        const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

        const handleEnd = () => {
            setIsDragging(null);
        };

        if (isDragging !== null) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleEnd);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging, value, isDual, getValue, onChange, step]);

    return (
        <div className={`relative w-full h-6 flex items-center select-none ${className}`}>
            {/* Track */}
            <div
                ref={trackRef}
                className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden"
            >
                {/* Active Range Bar */}
                <div
                    className="absolute h-full bg-[#7ab530]"
                    style={{
                        left: isDual ? `${getPercentage(value[0])}%` : "0%",
                        width: isDual
                            ? `${getPercentage(value[1]) - getPercentage(value[0])}%`
                            : `${getPercentage(value)}%`,
                    }}
                />
            </div>

            {/* Handles */}
            {isDual ? (
                <>
                    {/* Min Handle */}
                    <div
                        className={`absolute w-5 h-5 bg-white border-2 border-[#7ab530] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 focus:outline-none focus:ring-2 focus:ring-[#7ab530]/50 ${isDragging === 0 ? 'scale-110 ring-2 ring-[#7ab530]/50' : ''}`}
                        style={{ left: `calc(${getPercentage(value[0])}% - 10px)` }}
                        onMouseDown={handleMouseDown(0)}
                        onTouchStart={handleTouchStart(0)}
                    />
                    {/* Max Handle */}
                    <div
                        className={`absolute w-5 h-5 bg-white border-2 border-[#7ab530] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 focus:outline-none focus:ring-2 focus:ring-[#7ab530]/50 ${isDragging === 1 ? 'scale-110 ring-2 ring-[#7ab530]/50' : ''}`}
                        style={{ left: `calc(${getPercentage(value[1])}% - 10px)` }}
                        onMouseDown={handleMouseDown(1)}
                        onTouchStart={handleTouchStart(1)}
                    />
                </>
            ) : (
                /* Single Handle */
                <div
                    className={`absolute w-5 h-5 bg-white border-2 border-[#7ab530] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 focus:outline-none focus:ring-2 focus:ring-[#7ab530]/50 ${isDragging !== null ? 'scale-110 ring-2 ring-[#7ab530]/50' : ''}`}
                    style={{ left: `calc(${getPercentage(value)}% - 10px)` }}
                    onMouseDown={handleMouseDown(0)}
                    onTouchStart={handleTouchStart(0)}
                />
            )}
        </div>
    );
};

export default Slider;
