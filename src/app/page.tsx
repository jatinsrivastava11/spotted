"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { PostCard } from "@/components/PostCard";
import { MOCK_TRACKS, MOCK_ALBUMS } from "@/lib/mockData";
import {
  Sparkles,
  Flame,
  Star,
  Music,
  Disc,
  Play,
  TrendingUp,
  Headphones,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const { posts, activeFeedTab, setActiveFeedTab, friends } = useSocialStore();
  const { currentTrack, isPlaying, playTrack } = useAudioStore();

  const filteredPosts = posts.filter((post) => {
    if (activeFeedTab === "ALL") return true;
    if (activeFeedTab === "REVIEWS") return post.type === "ALBUM_REVIEW";
    if (activeFeedTab === "DROPS") return post.type === "SONG_DROP" || post.type === "LISTENING_NOW";
    if (activeFeedTab === "TIERS") return post.type === "TIER_LIST";
    return true;
  });

  const featuredTrack = MOCK_TRACKS[1]; // Nights

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Feed Column (8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Welcome & Story-like Rotating Listening Banner */}
        <div className="relative rounded-2xl overflow-hidden glass-panel p-6 border border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1ed760] radar-live" />
                <span className="text-xs font-bold text-[#1ed760] uppercase tracking-wider">
                  Live Listening Stream
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Your Music Circle
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md">
                Real-time listening logs, community tier drops, and unfiltered album reviews.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playTrack(featuredTrack)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-black font-bold text-xs shadow-lg shadow-[#1ed760]/20 transition hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Listen to Friend Mix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feed Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "All Activity", icon: Flame },
            { id: "REVIEWS", label: "Album Reviews", icon: Star },
            { id: "DROPS", label: "Song Drops", icon: Music },
            { id: "TIERS", label: "Tier Lists", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeedTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeedTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border",
                  isActive
                    ? "bg-white/15 text-white border-[#1ed760]/40 shadow-md"
                    : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#1ed760]" : "")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Posts Stream */}
        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Rail: Now Spinning & Trending Widget (4 cols on desktop) */}
      <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20">
        {/* Currently Spinning Spotlight */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-[#1ed760]" />
              Trending in Your Circle
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Today</span>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-white/10 group">
            <Image
              src={MOCK_ALBUMS[0].images[0]?.url || ""}
              alt="Blonde"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-[#1ed760] uppercase">
                #1 Most Discussed Record
              </span>
              <p className="text-base font-bold text-white">Blonde • Frank Ocean</p>
              <p className="text-xs text-zinc-300">4 friends reviewed this week</p>
            </div>

            <button
              onClick={() => playTrack(MOCK_TRACKS[1])}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
              title="Play 30s preview"
            >
              <Play className="w-5 h-5 fill-black ml-0.5" />
            </button>
          </div>
        </div>

        {/* Friend Live Listeners */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Friends Online
            </h3>
            <Link
              href="/explore"
              className="text-xs text-[#1ed760] hover:underline font-semibold"
            >
              See all
            </Link>
          </div>

          <div className="space-y-3">
            {friends.slice(0, 3).map((friend) => (
              <Link
                key={friend.id}
                href={`/profile/${friend.username}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={friend.avatar}
                      alt={friend.displayName}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#1ed760] radar-live border border-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-[#1ed760] transition truncate">
                      {friend.displayName}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {friend.favoriteTracks[0]?.name || "Listening on Spotify"}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                  92% match
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
