import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Step 1: Sound cue (simulated visual delay)
    const t1 = setTimeout(() => setStep(1), 500); 
    // Step 2: Slash
    const t2 = setTimeout(() => setStep(2), 1500);
    // Step 3: Fade out
    const t3 = setTimeout(() => {
        setStep(3);
        setTimeout(onComplete, 1000);
    }, 2500);

    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
    }
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div 
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
            {/* Split Screen Effect */}
            <motion.div 
                initial={{ scaleY: 1 }}
                animate={step >= 2 ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full h-1/2 bg-black z-20 origin-top border-b border-primary/20"
            />
            <motion.div 
                initial={{ scaleY: 1 }}
                animate={step >= 2 ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 w-full h-1/2 bg-black z-20 origin-bottom border-t border-primary/20"
            />

            {/* Flash of Light (The Slash) */}
            {step === 1 && (
                <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-full h-[2px] bg-white z-30 shadow-[0_0_50px_rgba(255,255,255,1)]"
                />
            )}
            
            {/* Text Reveal */}
            <div className="z-10 relative">
                <motion.h1 
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: step >= 1 ? 1 : 0, scale: 1 }}
                    className="text-primary font-cinzel text-4xl tracking-[1em] font-bold"
                >
                    RONIN
                </motion.h1>
            </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
