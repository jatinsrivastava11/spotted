"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { spotify } from "@/lib/spotify";
import { SpotifyTrack, SpotifyAlbum, PostType } from "@/types";
import { X, Search, Star, Music, Disc, Headphones, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const { createPost } = useSocialStore();

  const [postType, setPostType] = useState<PostType>("SONG_DROP");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    tracks: SpotifyTrack[];
    albums: SpotifyAlbum[];
  }>({ tracks: [], albums: [] });
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState<number>(4.5);
  const [isSearching, setIsSearching] = useState(false);

  // Search Spotify debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ tracks: [], albums: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await spotify.search(searchQuery);
      setSearchResults(res);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && !selectedTrack && !selectedAlbum) return;

    createPost({
      user,
      type: postType,
      track: selectedTrack || undefined,
      album: selectedAlbum || undefined,
      caption: caption.trim(),
      rating: postType === "ALBUM_REVIEW" ? rating : undefined,
    });

    // Launch celebratory confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#1ed760", "#a855f7", "#ffffff"],
    });

    // Reset and close
    setCaption("");
    setSelectedTrack(null);
    setSelectedAlbum(null);
    setSearchQuery("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl glass-panel bg-[#121217] rounded-2xl border border-white/10 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1ed760]" />
            <h2 className="text-lg font-bold text-white">Create Music Post</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Post Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setPostType("SONG_DROP");
                setSelectedAlbum(null);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition",
                postType === "SONG_DROP"
                  ? "bg-[#1ed760] text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Music className="w-4 h-4" />
              <span>Song Drop</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType("ALBUM_REVIEW");
                setSelectedTrack(null);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition",
                postType === "ALBUM_REVIEW"
                  ? "bg-[#1ed760] text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Disc className="w-4 h-4" />
              <span>Album Review</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPostType("LISTENING_NOW");
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition",
                postType === "LISTENING_NOW"
                  ? "bg-[#1ed760] text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Headphones className="w-4 h-4" />
              <span>Listening Now</span>
            </button>
          </div>

          {/* Spotify Search Bar */}
          {!selectedTrack && !selectedAlbum && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                {postType === "ALBUM_REVIEW" ? "Select Album from Spotify" : "Select Song from Spotify"}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={
                    postType === "ALBUM_REVIEW"
                      ? "Search album (e.g. Blonde, In Rainbows, SOS)..."
                      : "Search track (e.g. Nights, Alright, Digital Love)..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760]"
                />
              </div>

              {/* Search Results Dropdown */}
              {(searchResults.tracks.length > 0 || searchResults.albums.length > 0) && (
                <div className="max-h-48 overflow-y-auto space-y-1 p-2 rounded-xl bg-zinc-900 border border-white/10">
                  {postType === "ALBUM_REVIEW"
                    ? searchResults.albums.map((album) => (
                        <div
                          key={album.id}
                          onClick={() => {
                            setSelectedAlbum(album);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
                        >
                          <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                            <Image
                              src={album.images[0]?.url || ""}
                              alt={album.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{album.name}</p>
                            <p className="text-xs text-zinc-400 truncate">
                              {album.artists.map((a) => a.name).join(", ")}
                            </p>
                          </div>
                        </div>
                      ))
                    : searchResults.tracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => {
                            setSelectedTrack(track);
                            setSearchQuery("");
                          }}
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
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{track.name}</p>
                            <p className="text-xs text-zinc-400 truncate">
                              {track.artists.map((a) => a.name).join(", ")} • {track.album.name}
                            </p>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Music Display Banner */}
          {(selectedTrack || selectedAlbum) && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-[#1ed760]/30 shadow-inner">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={
                      selectedTrack
                        ? selectedTrack.album.images[0]?.url || ""
                        : selectedAlbum?.images[0]?.url || ""
                    }
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1ed760]">
                    {selectedTrack ? "Track Selected" : "Album Selected"}
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {selectedTrack ? selectedTrack.name : selectedAlbum?.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {selectedTrack
                      ? selectedTrack.artists.map((a) => a.name).join(", ")
                      : selectedAlbum?.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrack(null);
                  setSelectedAlbum(null);
                }}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
              >
                Change
              </button>
            </div>
          )}

          {/* Rating Slider for Album Reviews */}
          {postType === "ALBUM_REVIEW" && (
            <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Your Rating
                </span>
                <span className="font-bold text-amber-400 text-sm">
                  {rating.toFixed(1)} / 5.0
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          )}

          {/* Caption / Thoughts Area */}
          <div>
            <textarea
              rows={3}
              placeholder={
                postType === "ALBUM_REVIEW"
                  ? "What makes this album special? Favorite tracks, lyrics, production details..."
                  : "Add your thoughts, what scene this reminds you of, or why this song is on repeat..."
              }
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760] resize-none"
            />
          </div>

          {/* Submit Button */}
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
              disabled={!caption.trim() && !selectedTrack && !selectedAlbum}
              className="px-5 py-2.5 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-black font-semibold text-sm transition shadow-lg shadow-[#1ed760]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post to Spotted
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
