"use client";

import { motion, Variants, TargetAndTransition } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@nextui-org/react";

export interface ColorfulLoadingAnimationComponentProps {
    scale?: number;
    colors?: string[];
    shapeCount?: number;
    colorScheme?: keyof typeof colorSchemes;
    animationPattern?:
    | "default"
    | "pulsate"
    | "spiral"
    | "wave"
    | "dance"
    | "spine"
    | "custom";
    customAnimation?: (index: number) => TargetAndTransition;
    spine?: boolean;
    mixBlendMode?: MixBlendMode;
}

export const colorSchemes = {
    default: [
        "#FF0000",
        "#FF8000",
        "#FFFF00",
        "#00FF00",
        "#00FFFF",
        "#0000FF",
        "#8000FF",
        "#FF00FF",
        "#FF0080",
        "#FF8080",
        "#80FF80",
        "#8080FF",
    ],
    warm: [
        "#FFF5E6",
        "#FFE0B3",
        "#FFEE00",
        "#FFBF4D",
        "#FFAD1A",
        "#FF9900",
        "#FF8000",
        "#FF6600",
        "#FF4D00",
        "#FF3300",
        "#FF1A00",
        "#FF0000",
    ],
    all: [
        "#FF0000",
        "#FF7F00",
        "#FFFF00",
        "#00FF00",
        "#0000FF",
        "#4B0082",
        "#9400D3",
        "#FF1493",
        "#00FFFF",
        "#FF00FF",
        "#FFD700",
        "#00FF7F",
    ],
    picaGreen: [
        "#EEFBF4",
        "#D5F6E2",
        "#AEECC9",
        "#79DCAC",
        "#42C589",
        "#1FAA6F",
        "#128959",
        "#0E6E4A",
        "#0E573C",
        "#0C4832",
        "#041C14",
    ],
    greenBlue: [
        "#00FF00",
        "#00E600",
        "#00CC00",
        "#00B300",
        "#009900",
        "#008000",
        "#006666",
        "#004C99",
        "#0033CC",
        "#0000FF",
        "#0000CC",
        "#000099",
    ],
    pinkPurple: [
        "#FF1E9C",
        "#FF4BD8",
        "#FF78FF",
        "#D67BFF",
        "#AD7EFF",
        "#8582FF",
        "#5D85FF",
        "#35A7FF",
        "#0CCAFF",
        "#00EEFF",
        "#00FFD1",
        "#00FF9F",
    ],
    blueShades: [
        "#E6F3FF",
        "#CCE7FF",
        "#99CCFF",
        "#66B2FF",
        "#3399FF",
        "#0080FF",
        "#0066CC",
        "#004C99",
        "#003366",
        "#001F3F",
        "#000033",
        "#000022",
    ],
    whiteShades: [
        "#FFFFFF",
        "#E6E6E6",
        "#CCCCCC",
        "#B3B3B3",
        "#999999",
        "#808080",
        "#666666",
        "#4D4D4D",
        "#333333",
        "#1A1A1A",
        "#000000",
        "#000000",
    ],
};

const defaultShapeCount = 30;

export type MixBlendMode =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-burn"
    | "soft-light"
    | "hue"
    | "saturation"
    | "color";

export function ColorfulLoadingAnimation({
    scale = 1,
    colors,
    shapeCount = defaultShapeCount,
    colorScheme = "default",
    animationPattern = "default",
    customAnimation,
    spine = false, // Add this new prop with a default value of false
    mixBlendMode, // Add this new prop
}: ColorfulLoadingAnimationComponentProps) {
    const { theme } = useTheme();
    const defaultBlendMode = theme === "light" ? "lighten" : "color-burn";
    const blendMode = mixBlendMode || defaultBlendMode;

    const selectedColors = colors || colorSchemes[colorScheme];

    const generateShapes = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            borderRadius: `${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% / ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}% ${Math.random() * 40 + 30}%`,
            color: selectedColors[i % selectedColors.length],
            size: 10,
            rotationSpeed: Math.random() * 20 + 1,
            rotationDirection: Math.random() < 0.5 ? -1 : 1,
            fastGrow: Math.random() < 0.1,
        }));
    };

    const shapes = generateShapes(shapeCount);

    const getAnimation = (index: number): TargetAndTransition => {
        switch (animationPattern) {
            case "pulsate":
                return {
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    transition: {
                        repeat: Infinity,
                        duration: 2,
                    },
                };
            case "spiral":
                return {
                    rotate: [0, 360],
                    translateX: [0, 10 * Math.cos((index * Math.PI) / 6), 0],
                    translateY: [0, 10 * Math.sin((index * Math.PI) / 6), 0],
                };
            case "wave":
                return {
                    translateY: [0, -10, 10, 0],
                    rotate: [0, 360 * shapes[index].rotationDirection],
                    transition: {
                        delay: index * 0.1,
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                    },
                };
            case "dance":
                return {
                    translateX: [0, 10, -10, 0],
                    rotate: [0, 360 * shapes[index].rotationDirection],
                    transition: {
                        delay: index * 0.1,
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                    },
                };

            case "spine":
                return {
                    rotate: [0, 360],
                    scale: [1, Math.random() * 2 + 1, 1],
                    transition: {
                        duration: Math.random() * 0.5 + 2, // Faster animation
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: index * 0.5,
                    },
                };

            case "custom":
                return customAnimation ? customAnimation(index) : {};
            default:
                return {
                    scale: [1, 0.9, 1],
                    rotate: [0, 360 * shapes[index].rotationDirection],
                    translateX: [0, Math.random() * 20 - 10, 0],
                    translateY: [0, Math.random() * 20 - 10, 0],
                };
        }
    };

    const spineVariants = {
        animate: {
            rotate: [0, 170, 190, 360],
            transition: {
                duration: 1,
                times: [0, 0.4, 0.6, 1],
                ease: [0.45, 0.05, 0.55, 0.95],
                repeat: Infinity,
                repeatType: "reverse" as const,
            },
        },
    };

    return (
        <div
            className="flex flex-col items-center justify-center gap-4"
            style={{ transform: `scale(${scale})` }}
        >
            <motion.div
                className="relative w-10 h-10 flex items-center justify-center overflow-visible rounded-full"
                aria-label="Colorful loading animation"
                variants={spineVariants}
                animate={spine ? "animate" : ""}
            >
                {shapes.map((shape, index) => (
                    <motion.div
                        key={index}
                        className="absolute z-10"
                        style={{
                            borderColor: shape.color,
                            borderWidth: 10,
                            borderRadius: shape.borderRadius,
                            backgroundColor: "transparent",
                            width: `${shape.size}px`,
                            height: `${shape.size}px`,
                            opacity: Math.random() * 0.5 + 0.5,
                            boxShadow: `0 0 5px 0.5px ${shape.color}`, // Add glow for some shapes
                            mixBlendMode: blendMode,
                        }}
                        animate={getAnimation(index)}
                        transition={{
                            duration: Math.random() * 0.5 + 2, // Faster animation
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    />
                ))}
                <div
                    className={cn(
                        "absolute w-8 h-8 rounded-full",
                        "bg-background/50 -z-10"
                    )}
                />
            </motion.div>
        </div>
    );
}
