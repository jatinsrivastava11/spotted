import { create } from "zustand";
import { UserProfile } from "@/types";
import { CURRENT_USER } from "@/lib/mockData";

interface AuthState {
  user: UserProfile;
  isSpotifyLinked: boolean;
  demoMode: boolean;
  setSpotifyLinked: (linked: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateFavorites: (tracks: UserProfile["favoriteTracks"], albums: UserProfile["favoriteAlbums"]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: CURRENT_USER,
  isSpotifyLinked: true,
  demoMode: true,

  setSpotifyLinked: (linked) =>
    set((state) => ({
      isSpotifyLinked: linked,
      user: { ...state.user, spotifyConnected: linked },
    })),

  setDemoMode: (enabled) => set({ demoMode: enabled }),

  updateProfile: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),

  updateFavorites: (tracks, albums) =>
    set((state) => ({
      user: { ...state.user, favoriteTracks: tracks, favoriteAlbums: albums },
    })),
}));
