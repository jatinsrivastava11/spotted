"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { UserProfile, SpotifyTrack } from "@/types";
import {
  Users,
  UserPlus,
  UserCheck,
  Flame,
  Headphones,
  Play,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const ExploreFriends: React.FC = () => {
  const { friends, toggleFollowUser } = useSocialStore();
  const { playTrack } = useAudioStore();

  // Music compatibility calculation helper
  const getCompatibilityDetails = (friend: UserProfile) => {
    switch (friend.username) {
      case "alexrivera":
        return { score: 94, reason: "Shared top artists: Frank Ocean & Kendrick Lamar" };
      case "mayachen":
        return { score: 86, reason: "Shared top genres: Neo-Soul & R&B" };
      case "liamtorres":
        return { score: 79, reason: "Shared love for: Daft Punk & French House" };
      default:
        return { score: 82, reason: "High genre overlap in indie & hip-hop" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1ed760]" />
          <h2 className="text-xl font-bold text-white">Friends & Music Taste Match</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Compare musical DNA, listen to friend rotations, and build your social music circle.
        </p>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends.map((friend) => {
          const { score, reason } = getCompatibilityDetails(friend);
          const currentListen = friend.favoriteTracks[0];

          return (
            <div
              key={friend.id}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-[#1ed760]/30 transition-all space-y-4 group"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <Link
                  href={`/profile/${friend.username}`}
                  className="flex items-center gap-3 group/link"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover/link:border-[#1ed760] transition">
                    <Image
                      src={friend.avatar}
                      alt={friend.displayName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover/link:text-[#1ed760] transition">
                      {friend.displayName}
                    </h3>
                    <p className="text-xs text-zinc-400">@{friend.username}</p>
                  </div>
                </Link>

                {/* Follow Button */}
                <button
                  onClick={() => toggleFollowUser(friend.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    friend.isFollowing
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      : "bg-[#1ed760] text-black hover:bg-[#1db954] shadow-md shadow-[#1ed760]/20"
                  }`}
                >
                  {friend.isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bio */}
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {friend.bio}
              </p>

              {/* Music Taste Match Meter */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Taste Compatibility
                  </span>
                  <span className="font-mono font-bold text-purple-400">
                    {score}% Match
                  </span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-[#1ed760] h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400 italic">{reason}</p>
              </div>

              {/* Currently / Most Played Track */}
              {currentListen && (
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={currentListen.album.images[0]?.url || ""}
                        alt={currentListen.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[10px] text-[#1ed760] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] radar-live" />
                        Heavy Rotation
                      </div>
                      <p className="text-xs font-bold text-white truncate">
                        {currentListen.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => playTrack(currentListen)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
                    title="Preview track"
                  >
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
