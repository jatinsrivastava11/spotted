"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { PostCard } from "@/components/PostCard";
import { FavoriteGrid } from "@/components/FavoriteGrid";
import {
  UserCheck,
  UserPlus,
  Headphones,
  CheckCircle2,
  Sparkles,
  Award,
  Disc,
  Music,
  ExternalLink,
} from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const { user: currentUser } = useAuthStore();
  const { friends, posts, rankings, toggleFollowUser } = useSocialStore();
  const { playTrack } = useAudioStore();

  // Find user (either currentUser or from friends)
  const isMe = currentUser.username.toLowerCase() === username.toLowerCase();
  const friendUser = friends.find(
    (f) => f.username.toLowerCase() === username.toLowerCase()
  );

  const profile = isMe ? currentUser : friendUser || currentUser;

  // Filter posts created by this user
  const userPosts = posts.filter(
    (p) => p.user.username.toLowerCase() === profile.username.toLowerCase()
  );

  return (
    <div className="space-y-8">
      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar with pulse */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border-2 border-[#1ed760] shadow-2xl">
            <Image
              src={profile.avatar}
              alt={profile.displayName}
              fill
              className="object-cover"
              sizes="112px"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#1ed760] radar-live border-2 border-zinc-950" />
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  {profile.spotifyConnected && (
                    <span
                      title="Verified Spotify Account"
                      className="text-[#1ed760] flex items-center"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-[#1ed760] text-black" />
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                  @{profile.username}
                </p>
              </div>

              {!isMe && (
                <button
                  onClick={() => toggleFollowUser(profile.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 self-center sm:self-auto ${
                    profile.isFollowing
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      : "bg-[#1ed760] text-black hover:bg-[#1db954] shadow-lg shadow-[#1ed760]/20"
                  }`}
                >
                  {profile.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Bio */}
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            {/* Top Genres Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {profile.topGenres.map((genre) => (
                <span
                  key={genre}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Follower Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-white font-mono text-sm">
                  {profile.followerCount}
                </span>{" "}
                <span className="text-zinc-400">followers</span>
              </div>
              <div>
                <span className="font-bold text-white font-mono text-sm">
                  {profile.followingCount}
                </span>{" "}
                <span className="text-zinc-400">following</span>
              </div>
              <div>
                <span className="font-bold text-white font-mono text-sm">
                  {userPosts.length}
                </span>{" "}
                <span className="text-zinc-400">reviews & drops</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Favorites (Top 4) */}
      {isMe ? (
        <FavoriteGrid />
      ) : (
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Disc className="w-5 h-5 text-[#1ed760]" />
              {profile.displayName}'s Favorite Records
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Top 4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.favoriteAlbums.map((album, idx) => (
              <div
                key={album.id}
                className="relative rounded-xl overflow-hidden aspect-square bg-zinc-900 border border-white/10 group"
              >
                <Image
                  src={album.images[0]?.url || ""}
                  alt={album.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-mono font-bold text-[#1ed760]">
                    #{idx + 1}
                  </span>
                  <p className="text-xs font-bold text-white truncate">{album.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {album.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User's Posts Stream */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Activity & Music Drops</span>
          <span className="text-xs font-mono text-zinc-500">({userPosts.length})</span>
        </h3>

        {userPosts.length > 0 ? (
          <div className="space-y-4 max-w-3xl">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl border border-white/5 text-center space-y-2">
            <Music className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-zinc-400">
              No music shared to the feed yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
