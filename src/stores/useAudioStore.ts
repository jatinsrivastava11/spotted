import { create } from "zustand";
import { SpotifyTrack } from "@/types";

interface AudioStoreState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  progress: number; // 0 to 100
  duration: number; // in seconds
  currentTime: number; // in seconds
  volume: number; // 0 to 1
  playTrack: (track: SpotifyTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: (track?: SpotifyTrack) => void;
  setProgress: (percent: number) => void;
  setTime: (current: number, duration: number) => void;
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 30, // standard preview duration
  currentTime: 0,
  volume: 0.8,

  playTrack: (track: SpotifyTrack) => {
    set({
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
    });
  },

  pauseTrack: () => {
    set({ isPlaying: false });
  },

  resumeTrack: () => {
    if (get().currentTrack) {
      set({ isPlaying: true });
    }
  },

  togglePlay: (track?: SpotifyTrack) => {
    const state = get();
    if (track && (!state.currentTrack || state.currentTrack.id !== track.id)) {
      set({ currentTrack: track, isPlaying: true, progress: 0, currentTime: 0 });
      return;
    }
    set({ isPlaying: !state.isPlaying });
  },

  setProgress: (percent: number) => {
    set({ progress: percent });
  },

  setTime: (currentTime: number, duration: number) => {
    set({
      currentTime,
      duration,
      progress: duration > 0 ? (currentTime / duration) * 100 : 0,
    });
  },
}));
