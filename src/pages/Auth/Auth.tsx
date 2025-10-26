import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Auth(){
    const [pixelColors, setPixelColors] = useState<string[]>([]);
    
    const colors = [
        '#FF0080', // hot pink
        '#00FF80', // electric green
        '#8000FF', // electric purple
        '#FF8000', // bright orange
        '#0080FF', // electric blue
        '#FFFF00', // bright yellow
        '#FF0040', // bright red
        '#40FF00', // lime green
        '#FF4080', // magenta
        '#80FF00', // chartreuse
        '#0040FF', // royal blue
        '#FF8000', // tangerine
        '#80FF80', // light green
        '#FF80FF', // light magenta
        '#8080FF', // light blue
        '#FF4040', // coral red
        '#40FFFF', // cyan
        '#FFFF80', // light yellow
        '#FF8080', // light coral
        '#8080FF', // periwinkle
    ];
      
      

    useEffect(() => {
        // Initialize with default gray color
        const initialColors = Array.from({ length: 300 }, () => '#374151');
        setPixelColors(initialColors);
    }, []);

    const handlePixelHover = (index: number) => {
        setPixelColors(prev => {
            // Only change color if it's still gray (not already colored)
            if (prev[index] === '#374151') {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const newColors = [...prev];
                newColors[index] = randomColor;
                return newColors;
            }
            return prev; // No change if already colored
        });
    };

    return(
        <div className="w-screen h-screen bg-neutral-900 flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 h-full bg-neutral-9 flex flex-col items-center justify-center font-bold border-r-0 md:border-r-4">
                <Outlet></Outlet>
            </div>

            <div className="hidden md:block w-full md:flex-1 bg-gray-800 overflow-hidden">
                <div className="grid grid-cols-15 gap-1 h-full w-full">
                    {Array.from({ length: 300 }, (_, i) => {
                        return (
                            <div
                                key={i}
                                className="aspect-square border border-gray-600 transition-all duration-500 cursor-pointer hover:scale-105"
                                style={{
                                    backgroundColor: pixelColors[i] || '#374151',
                                    transition: 'background-color 0.3s ease, transform 0.2s ease'
                                }}
                                onMouseEnter={() => handlePixelHover(i)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 