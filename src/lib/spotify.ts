import { SpotifyTrack, SpotifyAlbum, LivePlaybackState } from "@/types";
import { MOCK_TRACKS, MOCK_ALBUMS } from "./mockData";

export interface SpotifyTimeRangeStats {
  shortTerm: SpotifyTrack[]; // 4 weeks
  mediumTerm: SpotifyTrack[]; // 6 months
  longTerm: SpotifyTrack[]; // All time
}

export interface SpotifyTopAlbumsStats {
  shortTerm: SpotifyAlbum[];
  mediumTerm: SpotifyAlbum[];
  longTerm: SpotifyAlbum[];
}

export class SpotifyService {
  private static instance: SpotifyService;

  public static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  // Simulated or live user Top Tracks
  public async getTopTracks(token?: string): Promise<SpotifyTimeRangeStats> {
    if (!token) {
      return {
        shortTerm: [MOCK_TRACKS[4], MOCK_TRACKS[1], MOCK_TRACKS[3], MOCK_TRACKS[0], MOCK_TRACKS[6]],
        mediumTerm: [MOCK_TRACKS[1], MOCK_TRACKS[0], MOCK_TRACKS[5], MOCK_TRACKS[2], MOCK_TRACKS[4]],
        longTerm: [MOCK_TRACKS[0], MOCK_TRACKS[5], MOCK_TRACKS[1], MOCK_TRACKS[6], MOCK_TRACKS[2]],
      };
    }

    try {
      const [short, med, long] = await Promise.all([
        this.fetchSpotify(`/me/top/tracks?time_range=short_term&limit=10`, token),
        this.fetchSpotify(`/me/top/tracks?time_range=medium_term&limit=10`, token),
        this.fetchSpotify(`/me/top/tracks?time_range=long_term&limit=10`, token),
      ]);
      return {
        shortTerm: short.items || [],
        mediumTerm: med.items || [],
        longTerm: long.items || [],
      };
    } catch {
      return this.getTopTracks();
    }
  }

  // Derived or fetched Top Albums
  public async getTopAlbums(token?: string): Promise<SpotifyTopAlbumsStats> {
    if (!token) {
      return {
        shortTerm: [MOCK_ALBUMS[3], MOCK_ALBUMS[0], MOCK_ALBUMS[2]],
        mediumTerm: [MOCK_ALBUMS[0], MOCK_ALBUMS[4], MOCK_ALBUMS[1]],
        longTerm: [MOCK_ALBUMS[0], MOCK_ALBUMS[1], MOCK_ALBUMS[4], MOCK_ALBUMS[5]],
      };
    }

    // In Spotify API, albums are extracted from top tracks
    const tracks = await this.getTopTracks(token);
    const extractAlbums = (trks: SpotifyTrack[]) => {
      const seen = new Set<string>();
      const albums: SpotifyAlbum[] = [];
      for (const t of trks) {
        if (t.album && !seen.has(t.album.id)) {
          seen.add(t.album.id);
          albums.push(t.album);
        }
      }
      return albums;
    };

    return {
      shortTerm: extractAlbums(tracks.shortTerm),
      mediumTerm: extractAlbums(tracks.mediumTerm),
      longTerm: extractAlbums(tracks.longTerm),
    };
  }

  // Currently playing live track
  public async getCurrentlyPlaying(token?: string): Promise<LivePlaybackState> {
    if (!token) {
      return {
        isPlaying: true,
        progressMs: 142000,
        track: MOCK_TRACKS[1], // "Nights" by Frank Ocean
        device: "MacBook Pro",
      };
    }

    try {
      const data = await this.fetchSpotify("/me/player/currently-playing", token);
      if (!data || !data.item) {
        return { isPlaying: false, progressMs: 0, track: null };
      }
      return {
        isPlaying: data.is_playing,
        progressMs: data.progress_ms,
        track: data.item,
        device: data.device?.name,
      };
    } catch {
      return {
        isPlaying: true,
        progressMs: 85000,
        track: MOCK_TRACKS[0],
        device: "Web Player",
      };
    }
  }

  // Search Spotify tracks & albums for posting and ranking
  public async search(query: string, token?: string): Promise<{ tracks: SpotifyTrack[]; albums: SpotifyAlbum[] }> {
    const q = query.trim().toLowerCase();
    if (!q) return { tracks: [], albums: [] };

    if (!token) {
      const tracks = MOCK_TRACKS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.artists.some((a) => a.name.toLowerCase().includes(q)) ||
          t.album.name.toLowerCase().includes(q)
      );
      const albums = MOCK_ALBUMS.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.artists.some((art) => art.name.toLowerCase().includes(q))
      );
      return { tracks, albums };
    }

    try {
      const res = await this.fetchSpotify(
        `/search?q=${encodeURIComponent(query)}&type=track,album&limit=8`,
        token
      );
      return {
        tracks: res.tracks?.items || [],
        albums: res.albums?.items || [],
      };
    } catch {
      return this.search(query);
    }
  }

  private async fetchSpotify(endpoint: string, token: string) {
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`Spotify API error: ${res.statusText}`);
    return res.json();
  }
}

export const spotify = SpotifyService.getInstance();
