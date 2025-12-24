import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderImage {
    id: string;
    imageUrl: string;
    author: string;
}

// Local pixel art images for the login slider
const SLIDER_IMAGES: SliderImage[] = [
    { id: "1", imageUrl: "/slider-images/pixel_sunset_1766612969209.png", author: "pixelmaster" },
    { id: "2", imageUrl: "/slider-images/pixel_cat_1766612982279.png", author: "8bitartist" },
    { id: "3", imageUrl: "/slider-images/pixel_spaceship_1766612931832.png", author: "cosmicpixels" },
    { id: "4", imageUrl: "/slider-images/pixel_mushroom_1766612919615.png", author: "forestbits" },
    { id: "5", imageUrl: "/slider-images/pixel_treasure_1766612947164.png", author: "rpgpixels" },
];

export default function PixelArtSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(handleNext, 3000);
        return () => clearInterval(interval);
    }, [handleNext]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-neutral-900">
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Branding */}
                <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                    sketchbook
                </h1>
                <p className="text-neutral-600 text-sm tracking-widest mb-12">
                    pixel by pixel.
                </p>

                {/* Slider container */}
                <div className="relative flex items-center justify-center">
                    {/* Previous button */}
                    <button
                        onClick={handlePrev}
                        className="absolute -left-12 z-20 p-2 rounded-full text-neutral-600 hover:text-white transition-colors cursor-pointer"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Image container with fade transition */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                        {SLIDER_IMAGES.map((image, index) => (
                            <img
                                key={image.id}
                                src={image.imageUrl}
                                alt="Pixel art"
                                className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-700 ${index === currentIndex ? "opacity-100" : "opacity-0"
                                    }`}
                                style={{ imageRendering: "pixelated" }}
                            />
                        ))}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={handleNext}
                        className="absolute -right-12 z-20 p-2 rounded-full text-neutral-600 hover:text-white transition-colors cursor-pointer"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Author */}
                <p className="text-neutral-500 text-sm mt-4">
                    by @{SLIDER_IMAGES[currentIndex].author}
                </p>

                {/* Dot indicators */}
                <div className="flex gap-2 mt-6">
                    {SLIDER_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? "w-6 h-1.5 bg-neutral-500"
                                : "w-1.5 h-1.5 bg-neutral-700 hover:bg-neutral-600"
                                }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
