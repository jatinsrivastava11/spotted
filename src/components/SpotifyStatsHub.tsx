"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { spotify, SpotifyTimeRangeStats, SpotifyTopAlbumsStats } from "@/lib/spotify";
import { SpotifyTrack, SpotifyAlbum } from "@/types";
import { useAudioStore } from "@/stores/useAudioStore";
import { useSocialStore } from "@/stores/useSocialStore";
import {
  BarChart3,
  Calendar,
  Play,
  Pause,
  ExternalLink,
  PlusCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

export const SpotifyStatsHub: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioStore();
  const { rankCurrentTrack } = useSocialStore();

  const [timeRange, setTimeRange] = useState<"shortTerm" | "mediumTerm" | "longTerm">("shortTerm");
  const [tab, setTab] = useState<"TRACKS" | "ALBUMS">("TRACKS");
  const [tracksStats, setTracksStats] = useState<SpotifyTimeRangeStats | null>(null);
  const [albumsStats, setAlbumsStats] = useState<SpotifyTopAlbumsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const [tStats, aStats] = await Promise.all([
        spotify.getTopTracks(),
        spotify.getTopAlbums(),
      ]);
      setTracksStats(tStats);
      setAlbumsStats(aStats);
      setLoading(false);
    }
    loadStats();
  }, []);

  const timeRangeLabels = {
    shortTerm: "Last 4 Weeks (Heavy Rotation)",
    mediumTerm: "Last 6 Months (Recent Vibe)",
    longTerm: "All-Time (Lifelong Favorites)",
  };

  const currentTracks: SpotifyTrack[] = tracksStats ? tracksStats[timeRange] : [];
  const currentAlbums: SpotifyAlbum[] = albumsStats ? albumsStats[timeRange] : [];

  return (
    <div className="space-y-6">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1ed760]" />
            <h2 className="text-xl font-bold text-white">Automated Spotify Listening Stats</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Pulled directly from Spotify listening logs. Updated daily.
          </p>
        </div>

        {/* Time range pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5 overflow-x-auto">
          {(["shortTerm", "mediumTerm", "longTerm"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                timeRange === range
                  ? "bg-[#1ed760] text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {range === "shortTerm" ? "4 Weeks" : range === "mediumTerm" ? "6 Months" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs: Songs vs Albums */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-4 text-sm font-bold">
          <button
            onClick={() => setTab("TRACKS")}
            className={`pb-2 transition relative ${
              tab === "TRACKS" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Top Songs
            {tab === "TRACKS" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1ed760] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setTab("ALBUMS")}
            className={`pb-2 transition relative ${
              tab === "ALBUMS" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Top Albums
            {tab === "ALBUMS" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1ed760] rounded-full" />
            )}
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono">
          {timeRangeLabels[timeRange]}
        </span>
      </div>

      {/* Track List View */}
      {tab === "TRACKS" ? (
        <div className="space-y-2">
          {currentTracks.map((track, index) => {
            const isTrackPlaying = currentTrack?.id === track.id && isPlaying;

            return (
              <div
                key={track.id}
                className="group glass-card rounded-xl p-3 border border-white/5 hover:border-[#1ed760]/30 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-5 text-center font-mono font-bold text-xs text-zinc-500 group-hover:text-[#1ed760]">
                    #{index + 1}
                  </span>

                  {/* Album Cover & Play */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                    <Image
                      src={track.album.images[0]?.url || ""}
                      alt={track.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    <button
                      onClick={() =>
                        currentTrack?.id === track.id ? togglePlay() : playTrack(track)
                      }
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                      aria-label="Play snippet"
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-5 h-5 text-[#1ed760] fill-[#1ed760]" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-[#1ed760] transition">
                      {track.name}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {track.artists.map((a) => a.name).join(", ")} • {track.album.name}
                    </p>
                  </div>
                </div>

                {/* Right controls: Quick Rate & External Link */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                    {formatDuration(track.duration_ms)}
                  </span>

                  <button
                    onClick={() => rankCurrentTrack(track, 9.5, "S", "My top listened track!")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/5 transition"
                    title="Quick Rank"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#1ed760]" />
                    <span className="hidden sm:inline">Rank Track</span>
                  </button>

                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-500 hover:text-white transition"
                    title="Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Albums Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentAlbums.map((album, index) => (
            <div
              key={album.id}
              className="glass-card rounded-2xl p-4 border border-white/5 hover:border-[#1ed760]/30 transition group flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-3">
                <Image
                  src={album.images[0]?.url || ""}
                  alt={album.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="220px"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-[#1ed760]">
                  #{index + 1}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate">{album.name}</h4>
                <p className="text-xs text-zinc-400 truncate">
                  {album.artists.map((a) => a.name).join(", ")}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
                  <span>{album.release_date?.slice(0, 4)}</span>
                  <span>{album.total_tracks} songs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
