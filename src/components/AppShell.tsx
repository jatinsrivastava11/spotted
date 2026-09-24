"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AudioPlayerBar } from "@/components/AudioPlayerBar";
import { CreatePostModal } from "@/components/CreatePostModal";
import { RankWhileListeningModal } from "@/components/RankWhileListeningModal";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
      {/* Desktop Left Sidebar */}
      <Sidebar
        onOpenCreatePost={() => setIsCreateOpen(true)}
        onOpenRankModal={() => setIsRankOpen(true)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-24">
        <Header
          onOpenCreatePost={() => setIsCreateOpen(true)}
          onOpenRankModal={() => setIsRankOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenCreatePost={() => setIsCreateOpen(true)} />

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <RankWhileListeningModal
        isOpen={isRankOpen}
        onClose={() => setIsRankOpen(false)}
      />
    </div>
  );
};
