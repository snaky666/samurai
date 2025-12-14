import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const mouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('pointer-events-auto')) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }
    }

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", mouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10000] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0
        }}
        transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.5
        }}
      >
          {/* Cursor Graphic */}
          <div className={`relative w-full h-full border-2 transition-colors duration-300 ${isHovering ? 'border-primary bg-primary/20' : 'border-white rounded-full'}`}>
              {/* Crosshair lines for "target" feel when hovering */}
              {isHovering && (
                  <>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary transform -translate-y-1/2 scale-x-150" />
                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-primary transform -translate-x-1/2 scale-y-150" />
                  </>
              )}
          </div>
      </motion.div>
      
      {/* Trailing "Slash" Effect */}
      <motion.div 
         className="fixed top-0 left-0 w-2 h-2 bg-red-500 rounded-full pointer-events-none z-[9999] opacity-50 blur-[2px]"
         animate={{
             x: mousePosition.x - 4,
             y: mousePosition.y - 4
         }}
         transition={{
             type: "tween",
             ease: "linear",
             duration: 0.1
         }}
      />
    </>
  );
}
