"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";
import { useSocialStore } from "@/stores/useSocialStore";
import { useAudioStore } from "@/stores/useAudioStore";
import {
  Heart,
  MessageCircle,
  Play,
  Pause,
  Star,
  ExternalLink,
  Disc3,
  Send,
  Sparkles,
} from "lucide-react";
import { formatRelativeTime, cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLikePost, addComment } = useSocialStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioStore();

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const isCurrentAudioPlaying =
    post.track && currentTrack?.id === post.track.id && isPlaying;

  const handleAudioAction = () => {
    if (!post.track) return;
    if (currentTrack?.id === post.track.id) {
      togglePlay();
    } else {
      playTrack(post.track);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
    setShowComments(true);
  };

  // Get artwork image
  const artworkUrl =
    post.track?.album.images[0]?.url ||
    post.album?.images[0]?.url ||
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600";

  const title = post.track?.name || post.album?.name || post.rankingTitle || "Music Selection";
  const artistName =
    post.track?.artists.map((a) => a.name).join(", ") ||
    post.album?.artists.map((a) => a.name).join(", ") ||
    "Multiple Artists";

  const spotifyUrl =
    post.track?.external_urls?.spotify ||
    post.album?.external_urls?.spotify ||
    "https://open.spotify.com";

  return (
    <article className="glass-card rounded-2xl p-5 border border-white/5 transition-all duration-300 relative overflow-hidden group">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-3 group/user"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 group-hover/user:border-[#1ed760] transition">
            <Image
              src={post.user.avatar}
              alt={post.user.displayName}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white group-hover/user:text-[#1ed760] transition truncate">
                {post.user.displayName}
              </span>
              <span className="text-xs text-zinc-500">@{post.user.username}</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </Link>

        {/* Post Type Badge */}
        <div className="flex items-center gap-2">
          {post.type === "ALBUM_REVIEW" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              Album Review
            </span>
          )}
          {post.type === "SONG_DROP" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30">
              Song Drop
            </span>
          )}
          {post.type === "TIER_LIST" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Tier List
            </span>
          )}
          {post.type === "LISTENING_NOW" && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 radar-live" />
              Listening Now
            </span>
          )}
        </div>
      </div>

      {/* Main Music Showcase Area */}
      {post.type !== "TIER_LIST" ? (
        <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/5 p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Artwork with vinyl peek */}
            <div className="relative w-36 h-36 sm:w-28 sm:h-28 shrink-0 group/cover">
              {/* Vinyl record disc peeking out behind album cover */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-full h-full rounded-full bg-zinc-950 border-2 border-zinc-800 transition-all duration-500 flex items-center justify-center shadow-xl",
                  isCurrentAudioPlaying
                    ? "translate-x-6 sm:translate-x-8 rotate-45"
                    : "translate-x-1"
                )}
              >
                <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1ed760]" />
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl z-10 border border-white/10">
                <Image
                  src={artworkUrl}
                  alt={title}
                  fill
                  className="object-cover group-hover/cover:scale-105 transition-transform duration-300"
                  sizes="150px"
                />

                {post.track && (
                  <button
                    onClick={handleAudioAction}
                    className="absolute inset-0 bg-black/40 hover:bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white transition opacity-90 sm:opacity-0 sm:group-hover/cover:opacity-100"
                    aria-label="Play Track Preview"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition">
                      {isCurrentAudioPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Metadata & Rating */}
            <div className="min-w-0 flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight truncate">
                  {title}
                </h3>
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#1ed760] transition"
                  title="Open on Spotify"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-sm font-medium text-zinc-400 truncate">
                {artistName}
              </p>

              {/* Star Rating for Reviews */}
              {post.rating && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= Math.round(post.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-600"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {post.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              )}

              {/* Quick Play Trigger Bar */}
              {post.track && (
                <button
                  onClick={handleAudioAction}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition mt-1"
                >
                  {isCurrentAudioPlaying ? (
                    <>
                      <Disc3 className="w-4 h-4 text-[#1ed760] animate-spin-slow" />
                      <span className="text-[#1ed760]">Playing 30s Snippet</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Preview Track</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Tier List Showcase */
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            {post.rankingTitle}
          </h4>
          <div className="space-y-2">
            {post.tiers?.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900/80 border border-white/5"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0",
                    tier.tier === "S"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : tier.tier === "A"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  )}
                >
                  {tier.tier}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {tier.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10"
                      title={item.name}
                    >
                      <Image
                        src={
                          "images" in item
                            ? item.images[0]?.url || ""
                            : item.album.images[0]?.url || ""
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caption / Review Body */}
      {post.caption && (
        <p className="text-sm text-zinc-300 leading-relaxed mb-4 whitespace-pre-line font-normal">
          {post.caption}
        </p>
      )}

      {/* Action Footer (Likes, Comments) */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => toggleLikePost(post.id)}
            className="flex items-center gap-1.5 text-xs font-semibold group/btn transition"
          >
            <div
              className={cn(
                "p-2 rounded-full transition group-hover/btn:bg-red-500/10",
                post.isLiked ? "text-red-500" : "text-zinc-400 group-hover/btn:text-red-500"
              )}
            >
              <Heart
                className={cn("w-4 h-4 transition-transform group-active/btn:scale-125", {
                  "fill-red-500": post.isLiked,
                })}
              />
            </div>
            <span
              className={cn(
                post.isLiked ? "text-red-400 font-bold" : "text-zinc-400 group-hover/btn:text-white"
              )}
            >
              {post.likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white group/btn transition"
          >
            <div className="p-2 rounded-full group-hover/btn:bg-white/5 transition">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>{post.commentsCount}</span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-500">Spotted for Web</span>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {post.comments.length > 0 ? (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={comment.user.avatar}
                      alt={comment.user.displayName}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </div>
                  <div className="bg-zinc-900/80 rounded-xl px-3 py-2 flex-1 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {comment.user.displayName}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-zinc-300 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic">No comments yet. Start the conversation!</p>
          )}

          {/* Add Comment Input */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Drop a thought or agreement..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#1ed760]"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 rounded-xl bg-[#1ed760] text-black hover:bg-[#1db954] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
