import React from 'react';
import { motion } from 'motion/react';

function AIVisualizer({ isAIPlaying, gender = "female" }) {
  // Waveform heights for the dancing audio bars
  const bars = [
    { id: 1, resting: 8, active: [8, 28, 14, 36, 8], delay: 0 },
    { id: 2, resting: 12, active: [12, 44, 20, 52, 12], delay: 0.1 },
    { id: 3, resting: 16, active: [16, 60, 28, 64, 16], delay: 0.2 },
    { id: 4, resting: 12, active: [12, 44, 20, 52, 12], delay: 0.15 },
    { id: 5, resting: 8, active: [8, 28, 14, 36, 8], delay: 0.05 },
  ];

  return (
    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-3xl flex flex-col items-center justify-center p-6 shadow-xl relative overflow-hidden border border-slate-800 font-sans">
      
      {/* Background Ambient Glow */}
      <motion.div
        animate={{
          scale: isAIPlaying ? [1, 1.4, 1] : 1,
          opacity: isAIPlaying ? [0.25, 0.5, 0.25] : 0.05,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none"
      />

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
        <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isAIPlaying ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
        <span className="text-xs font-medium text-slate-300">
          {isAIPlaying ? 'AI Speaking...' : 'AI Standby'}
        </span>
      </div>

      {/* Animated Waveform Bars */}
      <div className="flex items-center justify-center gap-2.5 z-10 h-20 my-auto">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            animate={{
              height: isAIPlaying ? bar.active : bar.resting,
              backgroundColor: isAIPlaying ? "#818cf8" : "#475569", // indigo-400 vs slate-600
              boxShadow: isAIPlaying ? "0 0 16px rgba(129, 140, 248, 0.6)" : "0 0 0px rgba(0,0,0,0)",
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: bar.delay,
            }}
            className="w-2.5 sm:w-3 rounded-full transition-colors duration-300"
          />
        ))}
      </div>

      {/* Bottom Voice Label */}
      <p className="text-xs text-slate-400 tracking-wide font-medium z-10 mt-auto">
        {gender === 'male' ? '👨 Male Neural Voice' : '👩 Female Neural Voice'}
      </p>
    </div>
  );
}

export default AIVisualizer;