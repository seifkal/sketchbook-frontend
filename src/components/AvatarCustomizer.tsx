import Avatar from "boring-avatars";
import { useState, useRef, useEffect } from "react";

// Avatar utility types and constants
export const AVATAR_VARIANTS = ["marble", "beam", "pixel", "sunset", "ring", "bauhaus"] as const;
export type AvatarVariant = typeof AVATAR_VARIANTS[number];
export const DEFAULT_COLORS = ["#FF3366", "#6C5CE7", "#00D9FF", "#00E676", "#FF9F1C"];

// Generate random hex color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Generate random palette
export const generateRandomPalette = () => {
    return Array.from({ length: 5 }, () => getRandomColor());
};
interface AvatarCustomizerProps {
    name: string;
    variant: AvatarVariant;
    colors: string[];
    onVariantChange: (variant: AvatarVariant) => void;
    onColorsChange: (colors: string[]) => void;
    size?: number;
}

export default function AvatarCustomizer({
    name,
    variant,
    colors,
    onVariantChange,
    onColorsChange,
    size = 96,
}: AvatarCustomizerProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex justify-center mb-8 relative" ref={menuRef}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="rounded-full overflow-hidden border-2 border-neutral-700 hover:border-neutral-500 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                    style={{ width: size, height: size }}
                >
                    <Avatar
                        size={size}
                        name={name}
                        variant={variant}
                        colors={colors}
                    />
                </button>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-500 whitespace-nowrap">
                    Click to customize
                </div>
            </div>

            {/* Avatar Customization Menu */}
            {showMenu && (
                <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 w-full max-w-sm bg-neutral-800 border border-neutral-700 rounded-2xl p-5 shadow-2xl z-50">
                    {/* Variant Selection */}
                    <div className="mb-5">
                        <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider font-medium">Style</p>
                        <div className="grid grid-cols-3 gap-2">
                            {AVATAR_VARIANTS.map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => onVariantChange(v)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${variant === v
                                        ? 'bg-neutral-700 ring-2 ring-white/20'
                                        : 'bg-neutral-900 hover:bg-neutral-750 border border-neutral-700'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Avatar
                                            size={40}
                                            name={name}
                                            variant={v}
                                            colors={colors}
                                        />
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${variant === v ? 'text-white' : 'text-neutral-400'}`}>
                                        {v}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Colors</p>
                            <button
                                type="button"
                                onClick={() => onColorsChange(generateRandomPalette())}
                                className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Random
                            </button>
                        </div>
                        <div className="flex gap-2 justify-between">
                            {colors.map((color, index) => (
                                <label
                                    key={index}
                                    className="relative w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-neutral-700 hover:border-neutral-500 transition-all hover:scale-110"
                                    style={{ backgroundColor: color }}
                                >
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => {
                                            const newColors = [...colors];
                                            newColors[index] = e.target.value;
                                            onColorsChange(newColors);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
