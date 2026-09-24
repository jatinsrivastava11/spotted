"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Flame, Compass, BarChart3, Award, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenCreatePost: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCreatePost }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { label: "Feed", href: "/", icon: Flame },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Stats", href: "/stats", icon: BarChart3 },
    { label: "Rankings", href: "/rankings", icon: Award },
    { label: "Profile", href: `/profile/${user.username}`, icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-16 left-0 right-0 z-40 glass-panel border-t border-white/10 px-3 py-2 flex items-center justify-around">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.href);

        return (
          <React.Fragment key={item.href}>
            {index === 2 && (
              <button
                onClick={onOpenCreatePost}
                className="w-10 h-10 -mt-5 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg shadow-[#1ed760]/30 hover:scale-110 active:scale-95 transition"
                aria-label="Create Post"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition",
                isActive ? "text-[#1ed760]" : "text-zinc-400 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
