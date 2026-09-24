"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAudioStore } from "@/stores/useAudioStore";
import { Play, Pause, Volume2, VolumeX, ExternalLink, Disc3 } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export const AudioPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    pauseTrack,
    resumeTrack,
    setTime,
  } = useAudioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = React.useState(false);

  // Sync state with HTMLAudioElement
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (currentTrack.preview_url) {
      if (audioRef.current.src !== currentTrack.preview_url) {
        audioRef.current.src = currentTrack.preview_url;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Auto-play might be blocked until user gesture
          pauseTrack();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying, pauseTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTime(audioRef.current.currentTime, audioRef.current.duration || 30);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    if (audioRef.current && duration > 0) {
      const newTime = (newPercent / 100) * duration;
      audioRef.current.currentTime = newTime;
      setTime(newTime, duration);
    }
  };

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const albumImage = currentTrack.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 py-2.5 sm:px-6 shadow-2xl transition-all duration-300">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={pauseTrack}
        muted={muted}
      />
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Details & Spinning Disc */}
        <div className="flex items-center gap-3.5 min-w-0 max-w-[35%]">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg group">
            <Image
              src={albumImage}
              alt={currentTrack.name}
              fill
              className="object-cover"
              sizes="48px"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                <Disc3 className="w-6 h-6 text-[#1ed760] animate-spin-slow" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
                {currentTrack.name}
              </p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 shrink-0">
                PREVIEW
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Center Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => togglePlay()}
              className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition shadow-lg hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            <span className="w-8 text-right">{formatDuration(currentTime * 1000)}</span>
            <div className="relative flex-1 group flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent || 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1ed760] group-hover:h-2 transition-all"
              />
            </div>
            <span className="w-8">{formatDuration(duration * 1000)}</span>
          </div>
        </div>

        {/* Right Actions: Mute & Spotify Deep Link */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 text-zinc-400 hover:text-white transition rounded-lg hover:bg-white/5"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <a
            href={currentTrack.external_urls?.spotify || "https://open.spotify.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-black bg-[#1ed760] hover:bg-[#1db954] px-3 py-1.5 rounded-full transition shadow-md hover:scale-105"
          >
            <span>Open in Spotify</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
