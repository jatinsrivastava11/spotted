export interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string; height: number; width: number }[];
  genres?: string[];
  external_urls?: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: { url: string; height: number; width: number }[];
  release_date?: string;
  total_tracks?: number;
  uri?: string;
  external_urls?: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  uri: string;
  external_urls: { spotify: string };
  popularity?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  spotifyConnected: boolean;
  spotifyUri?: string;
  topGenres: string[];
  favoriteTracks: SpotifyTrack[];
  favoriteAlbums: SpotifyAlbum[];
}

export type PostType = "SONG_DROP" | "ALBUM_REVIEW" | "TIER_LIST" | "LISTENING_NOW";

export interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

export interface TierListItem {
  tier: "S" | "A" | "B" | "C" | "D";
  name: string;
  items: (SpotifyTrack | SpotifyAlbum)[];
}

export interface Post {
  id: string;
  user: UserProfile;
  type: PostType;
  track?: SpotifyTrack;
  album?: SpotifyAlbum;
  caption: string;
  rating?: number; // 0.5 to 5.0
  tiers?: TierListItem[];
  rankingTitle?: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  comments: Comment[];
  createdAt: string;
}

export interface RankedItem {
  id: string;
  spotifyId: string;
  type: "track" | "album";
  title: string;
  artist: string;
  imageUrl: string;
  previewUrl?: string | null;
  rank?: number;
  tier?: "S" | "A" | "B" | "C" | "D";
  score?: number; // e.g. 9.4
  reviewNote?: string;
}

export interface RankingList {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: "ALBUM" | "TRACK" | "DISCOGRAPHY";
  isTierList: boolean;
  items: RankedItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LivePlaybackState {
  isPlaying: boolean;
  progressMs: number;
  track: SpotifyTrack | null;
  device?: string;
}
