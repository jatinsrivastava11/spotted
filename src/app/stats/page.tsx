import { SpotifyStatsHub } from "@/components/SpotifyStatsHub";
import { FavoriteGrid } from "@/components/FavoriteGrid";

export const metadata = {
  title: "Music Stats & Listening Logs — Spotted",
  description: "Automated Spotify top tracks, albums, and curated favorites",
};

export default function StatsPage() {
  return (
    <div className="space-y-8">
      {/* Letterboxd Top 4 Curated Centerpiece */}
      <FavoriteGrid />

      {/* Automated Spotify Listening Stats Hub */}
      <SpotifyStatsHub />
    </div>
  );
}
