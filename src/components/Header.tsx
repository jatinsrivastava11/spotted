"use client";

import React from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { Headphones, Disc3, Plus, SlidersHorizontal, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  onOpenCreatePost: () => void;
  onOpenRankModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreatePost,
  onOpenRankModal,
}) => {
  const { user, isSpotifyLinked } = useAuthStore();
  const { currentTrack, isPlaying } = useAudioStore();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/10 px-4 py-3 sm:px-8 flex items-center justify-between gap-4">
      {/* Live Spotify Ticker */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#1ed760] radar-live" />
          <span className="text-zinc-400 hidden sm:inline">Spotify:</span>
          <span className="font-semibold text-white truncate max-w-[180px] sm:max-w-[280px]">
            {isPlaying && currentTrack
              ? `${currentTrack.name} • ${currentTrack.artists[0]?.name}`
              : "Nights • Frank Ocean"}
          </span>
          <Headphones className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
        </div>
      </div>

      {/* Action buttons on header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenRankModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition hover:scale-105 active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1ed760]" />
          <span>Rank Music</span>
        </button>

        <button
          onClick={onOpenCreatePost}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-black text-xs font-bold transition shadow-md shadow-[#1ed760]/20 hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">New Post</span>
        </button>

        {/* User Mini Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <Image
            src={user.avatar}
            alt={user.displayName}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>
    </header>
  );
};
