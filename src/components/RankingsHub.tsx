"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { spotify } from "@/lib/spotify";
import { RankingList, RankedItem, SpotifyTrack } from "@/types";
import {
  Award,
  Plus,
  Play,
  Pause,
  Trash2,
  Sparkles,
  Sliders,
  Search,
  X,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export const RankingsHub: React.FC = () => {
  const {
    rankings,
    createRankingList,
    updateRankedItem,
    addItemToRanking,
    removeItemFromRanking,
  } = useSocialStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioStore();

  const [activeListId, setActiveListId] = useState<string>(rankings[0]?.id || "");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // New list form
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListCategory, setNewListCategory] = useState<"ALBUM" | "TRACK" | "DISCOGRAPHY">("ALBUM");
  const [isTierListType, setIsTierListType] = useState(false);

  // Add item search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [itemScore, setItemScore] = useState(9.0);
  const [itemTier, setItemTier] = useState<"S" | "A" | "B" | "C" | "D">("S");
  const [itemNote, setItemNote] = useState("");

  const currentList = rankings.find((r) => r.id === activeListId) || rankings[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    const created = createRankingList({
      userId: "usr-me",
      title: newListTitle.trim(),
      description: newListDesc.trim(),
      category: newListCategory,
      isTierList: isTierListType,
      items: [],
    });

    setActiveListId(created.id);
    setShowCreateModal(false);
    setNewListTitle("");
    setNewListDesc("");
  };

  const handleSearchMusic = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const res = await spotify.search(q);
    setSearchResults(res.tracks);
  };

  const handleAddItem = (track: SpotifyTrack) => {
    if (!currentList) return;

    addItemToRanking(currentList.id, {
      spotifyId: track.id,
      type: "track",
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      imageUrl: track.album.images[0]?.url || "",
      previewUrl: track.preview_url,
      rank: currentList.items.length + 1,
      tier: itemTier,
      score: itemScore,
      reviewNote: itemNote,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#1ed760", "#ffffff"],
    });

    setShowAddItemModal(false);
    setSearchQuery("");
    setItemNote("");
  };

  const tiers: { tier: "S" | "A" | "B" | "C" | "D"; label: string; style: string }[] = [
    { tier: "S", label: "God Tier / Masterpiece", style: "bg-red-500/20 text-red-400 border-red-500/40" },
    { tier: "A", label: "Essential / Excellent", style: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
    { tier: "B", label: "Great / Solid", style: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
    { tier: "C", label: "Decent / Average", style: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
    { tier: "D", label: "Skippable", style: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40" },
  ];

  return (
    <div className="space-y-6">
      {/* List Selection Header & New List Action */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#1ed760]" />
              <h2 className="text-xl font-bold text-white">Rankings & Tier Lists</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Personal music hierarchies, discography tier makers, and ranked master lists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New List</span>
            </button>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-xs font-semibold text-black transition shadow-md shadow-[#1ed760]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Music to List</span>
            </button>
          </div>
        </div>

        {/* List Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          {rankings.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveListId(r.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border",
                currentList?.id === r.id
                  ? "bg-white/15 text-white border-[#1ed760]/50 shadow-md"
                  : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:text-white"
              )}
            >
              {r.title}
              <span className="ml-2 text-[10px] text-zinc-500">
                ({r.items.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Ranking List View */}
      {currentList && (
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1ed760]">
                {currentList.isTierList ? "Tier Matrix" : "Numbered Ranking"}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{currentList.title}</h3>
              {currentList.description && (
                <p className="text-xs text-zinc-400 mt-1">{currentList.description}</p>
              )}
            </div>
          </div>

          {/* Tier List Format */}
          {currentList.isTierList ? (
            <div className="space-y-3">
              {tiers.map((t) => {
                const tierItems = currentList.items.filter((item) => item.tier === t.tier);

                return (
                  <div
                    key={t.tier}
                    className="flex flex-col sm:flex-row items-stretch gap-3 p-3 rounded-xl bg-black/40 border border-white/5"
                  >
                    <div
                      className={cn(
                        "w-full sm:w-28 p-3 rounded-lg flex flex-col items-center justify-center font-bold text-center border shrink-0",
                        t.style
                      )}
                    >
                      <span className="text-2xl">{t.tier} Tier</span>
                      <span className="text-[10px] font-normal opacity-80">{t.label}</span>
                    </div>

                    <div className="flex-1 flex items-center gap-3 overflow-x-auto py-2">
                      {tierItems.length > 0 ? (
                        tierItems.map((item) => (
                          <div
                            key={item.id}
                            className="relative group/item w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md"
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                              <p className="text-[10px] font-bold text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-[9px] text-zinc-400 truncate">
                                {item.artist}
                              </p>
                            </div>

                            {/* Delete on hover */}
                            <button
                              onClick={() => removeItemFromRanking(currentList.id, item.id)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-red-400 opacity-0 group-hover/item:opacity-100 transition"
                              title="Remove"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-600 italic px-3">
                          No items in {t.tier} Tier yet.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Numbered Ranking View */
            <div className="space-y-2">
              {currentList.items.map((item, index) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-[#1ed760]/30 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-6 font-mono font-bold text-sm text-[#1ed760]">
                      #{index + 1}
                    </span>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                        {item.score && (
                          <span className="text-xs font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                            {item.score.toFixed(1)}/10
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{item.artist}</p>
                      {item.reviewNote && (
                        <p className="text-[11px] text-zinc-300 italic mt-0.5 truncate">
                          "{item.reviewNote}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tier selector shortcut */}
                    <div className="flex items-center gap-1">
                      {(["S", "A", "B", "C"] as const).map((tierKey) => (
                        <button
                          key={tierKey}
                          onClick={() =>
                            updateRankedItem(currentList.id, item.id, { tier: tierKey })
                          }
                          className={cn(
                            "w-6 h-6 rounded text-[10px] font-bold transition",
                            item.tier === tierKey
                              ? "bg-white text-black font-extrabold"
                              : "bg-white/5 text-zinc-500 hover:text-white"
                          )}
                        >
                          {tierKey}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => removeItemFromRanking(currentList.id, item.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#121217] rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Ranking List</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">
                  List Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2024 Hip-Hop Albums Ranked..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#1ed760]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Personal ranking from best to worst"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#1ed760]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Format as S/A/B/C/D Tier List</p>
                  <p className="text-[11px] text-zinc-400">
                    Switch between Tier List and Numbered 1-to-N list
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isTierListType}
                  onChange={(e) => setIsTierListType(e.target.checked)}
                  className="w-4 h-4 accent-[#1ed760]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#1ed760] text-black font-semibold text-xs transition disabled:opacity-50"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#121217] rounded-2xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Add Music to {currentList?.title}</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search song to add..."
                value={searchQuery}
                onChange={(e) => handleSearchMusic(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760]"
              />
            </div>

            {/* Tier & Score Settings */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Assign Tier</label>
                <select
                  value={itemTier}
                  onChange={(e) => setItemTier(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                >
                  <option value="S">S Tier (God Tier)</option>
                  <option value="A">A Tier (Essential)</option>
                  <option value="B">B Tier (Great)</option>
                  <option value="C">C Tier (Decent)</option>
                  <option value="D">D Tier (Skip)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Score (out of 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={itemScore}
                  onChange={(e) => setItemScore(parseFloat(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-56 overflow-y-auto space-y-1">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleAddItem(track)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                >
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image
                      src={track.album.images[0]?.url || ""}
                      alt={track.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{track.name}</p>
                    <p className="text-xs text-zinc-400 truncate">
                      {track.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-[#1ed760] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
