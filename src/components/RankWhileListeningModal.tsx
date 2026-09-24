"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { MOCK_TRACKS } from "@/lib/mockData";
import { SpotifyTrack } from "@/types";
import { X, SlidersHorizontal, Award, Sparkles, Disc3 } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface RankWhileListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RankWhileListeningModal: React.FC<RankWhileListeningModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { rankCurrentTrack } = useSocialStore();
  const { currentTrack, playTrack } = useAudioStore();

  // Active track (currently playing or fallback to top track)
  const activeTrack: SpotifyTrack = currentTrack || MOCK_TRACKS[1]; // Nights

  const [score, setScore] = useState<number>(9.5);
  const [selectedTier, setSelectedTier] = useState<"S" | "A" | "B" | "C" | "D">("S");
  const [reviewNote, setReviewNote] = useState("");

  if (!isOpen) return null;

  const handleRankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rankCurrentTrack(activeTrack, score, selectedTier, reviewNote);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1ed760", "#f59e0b", "#ffffff"],
    });

    onClose();
  };

  const tiers: { tier: "S" | "A" | "B" | "C" | "D"; label: string; color: string }[] = [
    { tier: "S", label: "Masterpiece", color: "bg-red-500/20 text-red-400 border-red-500/40" },
    { tier: "A", label: "Exceptional", color: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
    { tier: "B", label: "Great", color: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
    { tier: "C", label: "Decent", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
    { tier: "D", label: "Skip", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel bg-[#121217] rounded-2xl border border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#1ed760]" />
            <h2 className="text-lg font-bold text-white">Rank While Listening</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Playing Card */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md">
              <Image
                src={activeTrack.album.images[0]?.url || ""}
                alt={activeTrack.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc3 className="w-6 h-6 text-[#1ed760] animate-spin-slow" />
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#1ed760] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] radar-live" />
                Live on Spotify
              </span>
              <p className="text-base font-bold text-white truncate">{activeTrack.name}</p>
              <p className="text-xs text-zinc-400 truncate">
                {activeTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>

          <button
            onClick={() => playTrack(activeTrack)}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition shrink-0"
          >
            Preview
          </button>
        </div>

        <form onSubmit={handleRankSubmit} className="mt-5 space-y-4">
          {/* Numerical Score Slider */}
          <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Song Rating Score
              </span>
              <span className="text-lg font-bold font-mono text-[#1ed760]">
                {score.toFixed(1)} / 10.0
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.1"
              value={score}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setScore(val);
                if (val >= 9.2) setSelectedTier("S");
                else if (val >= 8.2) setSelectedTier("A");
                else if (val >= 7.0) setSelectedTier("B");
                else if (val >= 5.0) setSelectedTier("C");
                else setSelectedTier("D");
              }}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
            />
          </div>

          {/* Tier Selector */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
              Assign Tier List Level
            </label>
            <div className="grid grid-cols-5 gap-2">
              {tiers.map((t) => (
                <button
                  key={t.tier}
                  type="button"
                  onClick={() => setSelectedTier(t.tier)}
                  className={cn(
                    "py-2 px-1 rounded-xl text-center border font-bold text-sm transition-all",
                    selectedTier === t.tier
                      ? "ring-2 ring-white scale-105 shadow-md " + t.color
                      : "bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white"
                  )}
                >
                  <div>{t.tier} Tier</div>
                  <div className="text-[9px] font-normal opacity-80">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Review note */}
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
              Quick Observation / Note
            </label>
            <input
              type="text"
              placeholder="e.g., That synth breakdown at 2:40 is unforgettable..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-black font-semibold text-sm transition shadow-lg shadow-[#1ed760]/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Drop to Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
