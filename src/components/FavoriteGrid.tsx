"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SpotifyTrack, SpotifyAlbum } from "@/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { spotify } from "@/lib/spotify";
import { Play, Plus, Star, Disc, Music, X, Search } from "lucide-react";

export const FavoriteGrid: React.FC = () => {
  const { user, updateFavorites } = useAuthStore();
  const { playTrack } = useAudioStore();

  const [activeCategory, setActiveCategory] = useState<"ALBUMS" | "TRACKS">("ALBUMS");
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    tracks: SpotifyTrack[];
    albums: SpotifyAlbum[];
  }>({ tracks: [], albums: [] });

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults({ tracks: [], albums: [] });
      return;
    }
    const res = await spotify.search(q);
    setSearchResults(res);
  };

  const handleSelectFavorite = (item: SpotifyTrack | SpotifyAlbum) => {
    if (editingSlot === null) return;

    if (activeCategory === "ALBUMS") {
      const newAlbums = [...user.favoriteAlbums];
      newAlbums[editingSlot] = item as SpotifyAlbum;
      updateFavorites(user.favoriteTracks, newAlbums);
    } else {
      const newTracks = [...user.favoriteTracks];
      newTracks[editingSlot] = item as SpotifyTrack;
      updateFavorites(newTracks, user.favoriteAlbums);
    }

    setEditingSlot(null);
    setSearchQuery("");
  };

  // Ensure 4 slots
  const albumSlots = Array.from({ length: 4 }, (_, i) => user.favoriteAlbums[i] || null);
  const trackSlots = Array.from({ length: 4 }, (_, i) => user.favoriteTracks[i] || null);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
      {/* Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white">Curated Favorites</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Letterboxd-style centerpiece for your profile (choose your top 4).
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveCategory("ALBUMS")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeCategory === "ALBUMS"
                ? "bg-[#1ed760] text-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Top 4 Albums</span>
          </button>
          <button
            onClick={() => setActiveCategory("TRACKS")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeCategory === "TRACKS"
                ? "bg-[#1ed760] text-black shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Top 4 Songs</span>
          </button>
        </div>
      </div>

      {/* 4-Item Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(activeCategory === "ALBUMS" ? albumSlots : trackSlots).map((item, idx) => {
          const imgUrl = item
            ? "images" in item
              ? item.images[0]?.url
              : item.album.images[0]?.url
            : null;

          const title = item?.name;
          const artist = item
            ? item.artists.map((a) => a.name).join(", ")
            : "Empty Slot";

          return (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden aspect-square bg-zinc-900 border border-white/10 hover:border-[#1ed760]/50 transition-all shadow-md flex flex-col justify-end"
            >
              {item && imgUrl ? (
                <>
                  <Image
                    src={imgUrl}
                    alt={title || "Cover"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-mono font-bold text-[#1ed760]">
                      #{idx + 1}
                    </span>
                    <p className="text-xs font-bold text-white truncate">{title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{artist}</p>
                  </div>

                  {/* Hover Controls */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {"album" in item && (
                      <button
                        onClick={() => playTrack(item as SpotifyTrack)}
                        className="w-9 h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-110 active:scale-95 transition"
                        title="Preview"
                      >
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingSlot(idx)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-medium transition"
                    >
                      Swap
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setEditingSlot(idx)}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition"
                >
                  <div className="w-9 h-9 rounded-full border border-dashed border-zinc-700 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Add #{idx + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Swap / Add Modal */}
      {editingSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#121217] rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Pick Favorite #{editingSlot + 1} ({activeCategory})
              </h4>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search Spotify..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760]"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {(activeCategory === "ALBUMS"
                ? searchResults.albums
                : searchResults.tracks
              ).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFavorite(item)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                >
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image
                      src={
                        "images" in item
                          ? item.images[0]?.url || ""
                          : item.album.images[0]?.url || ""
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
              {searchQuery &&
                searchResults.tracks.length === 0 &&
                searchResults.albums.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">No results found.</p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
