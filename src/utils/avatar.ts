export const AVATAR_VARIANTS = ["marble", "beam", "pixel", "sunset", "ring", "bauhaus", "geometric", "abstract"] as const;
export type AvatarVariant = typeof AVATAR_VARIANTS[number];
export const DEFAULT_AVATAR_VARIANT: AvatarVariant = "beam";
export const DEFAULT_COLORS = ["#FF3366", "#6C5CE7", "#00D9FF", "#00E676", "#FF9F1C"];

export const isAvatarVariant = (value: unknown): value is AvatarVariant => {
    return typeof value === "string" && (AVATAR_VARIANTS as readonly string[]).includes(value);
};

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const generateRandomPalette = () => {
    return Array.from({ length: 5 }, () => getRandomColor());
};
