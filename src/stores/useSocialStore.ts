import { create } from "zustand";
import { Post, RankingList, RankedItem, UserProfile, SpotifyTrack, SpotifyAlbum } from "@/types";
import { MOCK_POSTS, MOCK_RANKING_LISTS, MOCK_FRIENDS, CURRENT_USER } from "@/lib/mockData";

interface SocialStoreState {
  posts: Post[];
  friends: UserProfile[];
  rankings: RankingList[];
  activeFeedTab: "ALL" | "REVIEWS" | "DROPS" | "TIERS";
  
  // Post actions
  setActiveFeedTab: (tab: "ALL" | "REVIEWS" | "DROPS" | "TIERS") => void;
  createPost: (newPost: Omit<Post, "id" | "likesCount" | "isLiked" | "commentsCount" | "comments" | "createdAt">) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;

  // Social graph
  toggleFollowUser: (userId: string) => void;

  // Rankings & Tier Lists
  createRankingList: (list: Omit<RankingList, "id" | "createdAt" | "updatedAt">) => RankingList;
  updateRankedItem: (listId: string, itemId: string, updates: Partial<RankedItem>) => void;
  addItemToRanking: (listId: string, item: Omit<RankedItem, "id">) => void;
  removeItemFromRanking: (listId: string, itemId: string) => void;

  // Quick "Rank while listening"
  rankCurrentTrack: (track: SpotifyTrack, score: number, tier?: "S" | "A" | "B" | "C" | "D", reviewNote?: string) => void;
}

export const useSocialStore = create<SocialStoreState>((set, get) => ({
  posts: MOCK_POSTS,
  friends: MOCK_FRIENDS,
  rankings: MOCK_RANKING_LISTS,
  activeFeedTab: "ALL",

  setActiveFeedTab: (tab) => set({ activeFeedTab: tab }),

  createPost: (newPost) => {
    const post: Post = {
      ...newPost,
      id: `post-${Date.now()}`,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ posts: [post, ...state.posts] }));
  },

  toggleLikePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;
        const willBeLiked = !p.isLiked;
        return {
          ...p,
          isLiked: willBeLiked,
          likesCount: willBeLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }),
    }));
  },

  addComment: (postId, text) => {
    if (!text.trim()) return;
    const comment = {
      id: `c-${Date.now()}`,
      user: {
        id: CURRENT_USER.id,
        username: CURRENT_USER.username,
        displayName: CURRENT_USER.displayName,
        avatar: CURRENT_USER.avatar,
      },
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, comment],
        };
      }),
    }));
  },

  toggleFollowUser: (userId) => {
    set((state) => ({
      friends: state.friends.map((friend) => {
        if (friend.id !== userId) return friend;
        const willFollow = !friend.isFollowing;
        return {
          ...friend,
          isFollowing: willFollow,
          followerCount: willFollow ? friend.followerCount + 1 : Math.max(0, friend.followerCount - 1),
        };
      }),
    }));
  },

  createRankingList: (listData) => {
    const newList: RankingList = {
      ...listData,
      id: `rank-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ rankings: [newList, ...state.rankings] }));
    return newList;
  },

  updateRankedItem: (listId, itemId, updates) => {
    set((state) => ({
      rankings: state.rankings.map((r) => {
        if (r.id !== listId) return r;
        return {
          ...r,
          items: r.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  addItemToRanking: (listId, itemData) => {
    const newItem: RankedItem = {
      ...itemData,
      id: `ri-${Date.now()}`,
    };
    set((state) => ({
      rankings: state.rankings.map((r) => {
        if (r.id !== listId) return r;
        return {
          ...r,
          items: [...r.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  removeItemFromRanking: (listId, itemId) => {
    set((state) => ({
      rankings: state.rankings.map((r) => {
        if (r.id !== listId) return r;
        return {
          ...r,
          items: r.items.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  rankCurrentTrack: (track, score, tier, reviewNote) => {
    const targetList = get().rankings[0];
    if (targetList) {
      get().addItemToRanking(targetList.id, {
        spotifyId: track.id,
        type: "track",
        title: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        imageUrl: track.album.images[0]?.url || "",
        previewUrl: track.preview_url,
        score,
        tier: tier || (score >= 9 ? "S" : score >= 8 ? "A" : score >= 7 ? "B" : "C"),
        reviewNote,
      });
    }

    // Auto-share to feed if score or note is high
    get().createPost({
      user: CURRENT_USER,
      type: "SONG_DROP",
      track,
      caption: reviewNote ? `Rated ${score}/10: "${reviewNote}"` : `Just rated ${track.name} a ${score}/10!`,
      rating: score / 2, // 10-scale to 5-star scale
    });
  },
}));
