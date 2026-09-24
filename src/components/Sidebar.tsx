"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Compass,
  Flame,
  Radio,
  BarChart3,
  Award,
  User,
  PlusCircle,
  SlidersHorizontal,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenCreatePost: () => void;
  onOpenRankModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCreatePost,
  onOpenRankModal,
}) => {
  const pathname = usePathname();
  const { user, isSpotifyLinked } = useAuthStore();

  const navItems = [
    { label: "Feed", href: "/", icon: Flame },
    { label: "Explore & Friends", href: "/explore", icon: Compass },
    { label: "Music Hub & Stats", href: "/stats", icon: BarChart3 },
    { label: "Rankings & Tiers", href: "/rankings", icon: Award },
    { label: "My Profile", href: `/profile/${user.username}`, icon: User },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-white/10 bg-[#0c0c10]/95 backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex shrink-0">
      {/* Brand & Logo */}
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1ed760] to-[#128a3c] flex items-center justify-center shadow-lg shadow-[#1ed760]/20 group-hover:scale-105 transition-transform">
            <Radio className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Spotted
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30">
                Live
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              Social music ranking
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onOpenCreatePost}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1ed760] hover:bg-[#1db954] text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1ed760]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Music Drop</span>
          </button>

          <button
            onClick={onOpenRankModal}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#1ed760]" />
            <span>Rank While Listening</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-white/10 text-white shadow-inner font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-[#1ed760]"
                      : "text-zinc-400 group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Status Card & Spotify Sync State */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        {/* Live Listening Widget */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-white/10 flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image
              src={user.avatar}
              alt={user.displayName}
              fill
              className="object-cover"
              sizes="32px"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1ed760] radar-live border border-zinc-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white truncate">
                {user.displayName}
              </p>
              {isSpotifyLinked && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
              <Headphones className="w-3 h-3 text-[#1ed760]" />
              <span>Nights • Frank Ocean</span>
            </p>
          </div>
        </div>

        {/* Spotify Status Pill */}
        <div className="flex items-center justify-between px-2 text-[11px]">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760]" />
            Spotify Connected
          </span>
          <span className="text-zinc-500 font-mono">v0.9-alpha</span>
        </div>
      </div>
    </aside>
  );
};
