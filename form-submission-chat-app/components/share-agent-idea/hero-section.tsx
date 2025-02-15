"use client";

import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import Image from "next/image";


const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function FloatingEmoji({
  emoji,
  className,
}: {
  emoji: string;
  className: string;
}) {
  return (
    <motion.div
      className={cn("absolute text-4xl pointer-events-none", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  badge = "Pica Agents",
  title1 = "Share Your Idea",
  title2 = "for an AI Agent",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute inset-0 blur-3xl" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={200}
          height={80}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] sm:left-[-15%] md:left-[-5%] top-[15%] md:top-[20%] scale-75 sm:scale-100"
        />

        <ElegantShape
          delay={0.5}
          width={180}
          height={60}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-8%] sm:right-[-10%] md:right-[0%] top-[60%] md:top-[75%] scale-75 sm:scale-100"
        />

        <ElegantShape
          delay={0.4}
          width={150}
          height={50}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[2%] sm:left-[0%] md:left-[10%] bottom-[8%] md:bottom-[10%] scale-75 sm:scale-100"
        />

        <ElegantShape
          delay={0.6}
          width={120}
          height={35}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[8%] sm:right-[10%] md:right-[20%] top-[20%] md:top-[15%] scale-75 sm:scale-100"
        />

        <ElegantShape
          delay={0.7}
          width={80}
          height={25}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[12%] sm:left-[15%] md:left-[25%] top-[12%] md:top-[10%] scale-75 sm:scale-100"
        />

        {/* Add floating emojis */}
        <FloatingEmoji emoji="🤖" className="text-xl sm:text-2xl md:text-4xl left-[8%] sm:left-[10%] top-[35%]" />
        <FloatingEmoji emoji="💡" className="text-xl sm:text-2xl md:text-4xl right-[12%] sm:right-[15%] top-[28%]" />
        <FloatingEmoji emoji="🚀" className="text-xl sm:text-2xl md:text-4xl left-[20%] sm:left-[25%] bottom-[25%]" />
        <FloatingEmoji emoji="✨" className="text-xl sm:text-2xl md:text-4xl right-[18%] sm:right-[20%] bottom-[35%]" />
        <FloatingEmoji emoji="📊" className="text-xl sm:text-2xl md:text-4xl left-[12%] sm:left-[15%] top-[55%]" />
        <FloatingEmoji emoji="🎉" className="text-xl sm:text-2xl md:text-4xl right-[8%] sm:right-[10%] top-[45%]" />
        <FloatingEmoji emoji="💼" className="text-xl sm:text-2xl md:text-4xl left-[25%] sm:left-[30%] top-[18%]" />
        <FloatingEmoji emoji="🔍" className="text-xl sm:text-2xl md:text-4xl right-[22%] sm:right-[25%] bottom-[20%]" />
      </div>

      <div className="relative z-20 container mx-auto px-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4 md:mb-8"
          >
            <Image
              src={"/solo-dark.svg"}
              alt="Pica Agents"
              width={14}
              height={14}
              className="sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px]"
            />
            <span className="text-[10px] sm:text-xs md:text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-[28px] xs:text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-8 tracking-tight leading-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 block mb-1 sm:mb-2 leading-[1.6] pb-2",
                  pacifico.className
                )}
              >
                {title1}
              </span>
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-emerald-300 text-[24px] xs:text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl block leading-[1.6] pt-1"
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/40 mb-4 sm:mb-6 md:mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-1 sm:px-2 md:px-4">
              Be one of the first to get your custom AI agent built and hosted for
              free. Submit your idea today and join us in shaping the future of AI
              automation.
            </p>
          </motion.div>
        </div>
      </div>


    </div>
  );
}
