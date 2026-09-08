'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface HeroVideoProps {
  poster?: string;
}

export default function HeroVideo({ poster = '/media/wds/wyszol1126.jpg' }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: keep muted and playing
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0D0D0B]">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        onLoadedData={() => setIsLoaded(true)}
        className={`w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.08] transition-opacity duration-700 ${
          isLoaded ? 'opacity-70' : 'opacity-40'
        }`}
      >
        <source src="/media/wds/hero-video.mp4" type="video/mp4" />
        <source src="https://warsawduragstore.pl/wp-content/uploads/2025/06/Krotsza-wersja-1.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Vignette & Grid Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B] via-[#0D0D0B]/40 to-[#0D0D0B]/70" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0B]/30 to-[#0D0D0B]/80 pointer-events-none" />

      {/* Minimalist Tech Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0D0D0B]/80 backdrop-blur-xs border border-white/20 text-white hover:border-[#D9A87E] hover:text-[#D9A87E] transition-colors text-[10px] font-mono uppercase tracking-wider cursor-pointer"
          aria-label={isPlaying ? 'Wstrzymaj film' : 'Odtwórz film'}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0D0D0B]/80 backdrop-blur-xs border border-white/20 text-white hover:border-[#D9A87E] hover:text-[#D9A87E] transition-colors text-[10px] font-mono uppercase tracking-wider cursor-pointer"
          aria-label={isMuted ? 'Włącz dźwięk' : 'Wycisz film'}
        >
          {isMuted ? <VolumeX className="w-3 h-3 text-gray-400" /> : <Volume2 className="w-3 h-3 text-[#D9A87E]" />}
          <span>{isMuted ? 'MUTE' : 'SOUND ON'}</span>
        </button>
      </div>

      {/* Live Feed Tech Stamp (Top Left) */}
      <div className="absolute top-6 left-6 z-20 hidden md:flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/70">
          WDS ARCHIVE // WARSZAWA 2026
        </span>
      </div>
    </div>
  );
}
