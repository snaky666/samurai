import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import rainGif from '@assets/Raining_Feudal_Japan_GIF_by_Xbox_1765755510192.gif';
import katanaSound from '@assets/katana-370403_(1)_1765760828510.mp3';

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [sequence, setSequence] = useState<'gif' | 'title' | 'complete'>('gif');
  const [step, setStep] = useState(0);
  const katanaSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    katanaSoundRef.current = new Howl({
      src: [katanaSound],
      volume: 0.7,
    });
    return () => {
      katanaSoundRef.current?.unload();
    };
  }, []);

  const handleGifClick = () => {
    katanaSoundRef.current?.play();
  };

  useEffect(() => {
    // --- Phase 1: GIF Intro ---
    // Play GIF for 3 seconds, then slash
    const t1 = setTimeout(() => {
        setSequence('title');
    }, 3500);

    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (sequence === 'title') {
        // --- Phase 2: Title Sequence (Original) ---
        // Immediate: Black screen is visible (GIF removed)
        
        // 0.5s: Sound/Flash cue
        const t2 = setTimeout(() => setStep(1), 500); 
        // 1.5s: Split animation
        const t3 = setTimeout(() => setStep(2), 1500);
        // 2.5s: Fade out entire overlay
        const t4 = setTimeout(() => {
            setStep(3);
            setTimeout(() => {
                setSequence('complete');
                onComplete();
            }, 1000);
        }, 2500);

        return () => {
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        }
    }
  }, [sequence, onComplete]);

  if (sequence === 'complete') return null;

  return (
    <AnimatePresence mode="wait">
      {/* --- GIF PHASE --- */}
      {sequence === 'gif' && (
        <motion.div
            key="gif-overlay"
            className="fixed inset-0 z-[10001] bg-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, scale: 1.1, filter: 'brightness(0)' }} // Fade to black
            transition={{ duration: 0.8, ease: "circIn" }}
        >
             <img 
                src={rainGif} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 cursor-pointer" 
                alt="Atmospheric Rain"
                onClick={handleGifClick}
             />
             <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Darken for mood */}
             
             {/* Subtle Text Overlay on GIF */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                className="z-10 text-white/50 font-serif-jp tracking-[0.5em] text-xs absolute bottom-10 pointer-events-none"
            >
                EST. 1603
             </motion.div>
        </motion.div>
      )}

      {/* --- TITLE PHASE (Original) --- */}
      {sequence === 'title' && (
        <motion.div 
          key="title-overlay"
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
                    initial={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                    animate={{ opacity: step >= 1 ? 1 : 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    className="text-primary font-cinzel text-5xl md:text-7xl tracking-[0.5em] font-bold"
                >
                    RONIN
                </motion.h1>
            </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
