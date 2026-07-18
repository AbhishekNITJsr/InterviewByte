import React, { useEffect, useRef } from 'react';

function UserVoiceVisualizer({ isMicOn, isAIPlaying, isIntroPhase }) {
  const barsRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const NUM_BARS = 16;

  useEffect(() => {
    // Stop visualizer if mic is muted, AI is speaking, or intro is running
    if (!isMicOn || isAIPlaying || isIntroPhase) {
      cleanupAudio();
      barsRef.current.forEach(bar => {
        if (bar) {
          bar.style.height = '8px';
          bar.style.backgroundColor = '#4f46e5'; // indigo-600 resting
          bar.style.boxShadow = 'none';
        }
      });
      return;
    }

    let isMounted = true;

    const initAudio = async () => {
      try {
        // Request lightweight read-only audio stream for frequency analysis
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Gives 32 frequency bins
        analyser.smoothingTimeConstant = 0.8; // Smooth transitions
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        updateWaveform();
      } catch (err) {
        console.error("Microphone audio stream error:", err);
      }
    };

    initAudio();

    return () => {
      isMounted = false;
      cleanupAudio();
    };
  }, [isMicOn, isAIPlaying, isIntroPhase]);

  const cleanupAudio = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  const updateWaveform = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      // Animate DOM refs directly for buttery-smooth 60fps without React re-renders
      for (let i = 0; i < NUM_BARS; i++) {
        const bar = barsRef.current[i];
        if (bar) {
          const val = dataArray[i] || 0;
          // Map frequency (0-255) to height (8px to 120px)
          const height = Math.max(8, (val / 255) * 120);
          bar.style.height = `${height}px`;
          
          // Dynamic glow when candidate speaks loudly/clearly
          if (val > 90) {
            bar.style.backgroundColor = '#6366f1'; // indigo-500
            bar.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.6)';
          } else {
            bar.style.backgroundColor = '#4f46e5'; // indigo-600
            bar.style.boxShadow = 'none';
          }
        }
      }
    };

    render();
  };

  return (
    <div className="w-full h-48 sm:h-56 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between items-center relative overflow-hidden shadow-sm font-sans">
      
      {/* Top Status Bar */}
      <div className="w-full flex justify-between items-center text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isMicOn && !isAIPlaying && !isIntroPhase ? 'bg-indigo-600 animate-ping' : 'bg-rose-500'}`} />
          {isIntroPhase || isAIPlaying ? 'Microphone Muted (AI Speaking)' : isMicOn ? 'Listening to You...' : 'Microphone Paused'}
        </span>
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Real-Time Voice Waveform</span>
      </div>

      {/* Waveform Bars Container */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 h-36 w-full my-auto">
        {Array.from({ length: NUM_BARS }).map((_, i) => (
          <div
            key={i}
            ref={el => (barsRef.current[i] = el)}
            className="w-2 sm:w-2.5 bg-indigo-600 rounded-full transition-[height,background-color] duration-75 ease-out"
            style={{ height: '8px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default UserVoiceVisualizer;