import { SpotifyAlbum, SpotifyArtist, SpotifyTrack, UserProfile, Post, RankingList } from "@/types";

// High quality albums with real artwork
export const MOCK_ALBUMS: SpotifyAlbum[] = [
  {
    id: "alb-blonde",
    name: "Blonde",
    artists: [{ id: "art-frank", name: "Frank Ocean" }],
    images: [{ url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2016-08-20",
    total_tracks: 17,
  },
  {
    id: "alb-tpab",
    name: "To Pimp a Butterfly",
    artists: [{ id: "art-kendrick", name: "Kendrick Lamar" }],
    images: [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2015-03-15",
    total_tracks: 16,
  },
  {
    id: "alb-igor",
    name: "IGOR",
    artists: [{ id: "art-tyler", name: "Tyler, The Creator" }],
    images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2019-05-17",
    total_tracks: 12,
  },
  {
    id: "alb-sos",
    name: "SOS",
    artists: [{ id: "art-sza", name: "SZA" }],
    images: [{ url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2022-12-09",
    total_tracks: 23,
  },
  {
    id: "alb-inrainbows",
    name: "In Rainbows",
    artists: [{ id: "art-radiohead", name: "Radiohead" }],
    images: [{ url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2007-10-10",
    total_tracks: 10,
  },
  {
    id: "alb-discovery",
    name: "Discovery",
    artists: [{ id: "art-daftpunk", name: "Daft Punk" }],
    images: [{ url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80", height: 600, width: 600 }],
    release_date: "2001-03-12",
    total_tracks: 14,
  }
];

// Rich Tracks with real-sounding details and sample preview audio
export const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: "trk-white-ferrari",
    name: "White Ferrari",
    artists: [{ id: "art-frank", name: "Frank Ocean" }],
    album: MOCK_ALBUMS[0],
    duration_ms: 248000,
    preview_url: "https://actions.google.com/sounds/v1/water/rain_heavy.ogg", // fallback playable stream
    uri: "spotify:track:2LMkwUfqC6S6s6qQI7iojZ",
    external_urls: { spotify: "https://open.spotify.com/track/2LMkwUfqC6S6s6qQI7iojZ" },
    popularity: 88,
  },
  {
    id: "trk-nights",
    name: "Nights",
    artists: [{ id: "art-frank", name: "Frank Ocean" }],
    album: MOCK_ALBUMS[0],
    duration_ms: 307000,
    preview_url: "https://actions.google.com/sounds/v1/ambiences/outdoor_evening.ogg",
    uri: "spotify:track:7eqoqGkKwgOaWNNHx90uEZ",
    external_urls: { spotify: "https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ" },
    popularity: 92,
  },
  {
    id: "trk-alright",
    name: "Alright",
    artists: [{ id: "art-kendrick", name: "Kendrick Lamar" }],
    album: MOCK_ALBUMS[1],
    duration_ms: 219000,
    preview_url: "https://actions.google.com/sounds/v1/transportation/subway_interior.ogg",
    uri: "spotify:track:3iVcQ50SS4AkEvCa1vaq5Z",
    external_urls: { spotify: "https://open.spotify.com/track/3iVcQ50SS4AkEvCa1vaq5Z" },
    popularity: 89,
  },
  {
    id: "trk-earfquake",
    name: "EARFQUAKE",
    artists: [{ id: "art-tyler", name: "Tyler, The Creator" }],
    album: MOCK_ALBUMS[2],
    duration_ms: 190000,
    preview_url: "https://actions.google.com/sounds/v1/water/gentle_stream.ogg",
    uri: "spotify:track:5hVghJ4KaYES3BFUATCYip",
    external_urls: { spotify: "https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYip" },
    popularity: 91,
  },
  {
    id: "trk-snooze",
    name: "Snooze",
    artists: [{ id: "art-sza", name: "SZA" }],
    album: MOCK_ALBUMS[3],
    duration_ms: 201000,
    preview_url: "https://actions.google.com/sounds/v1/ambiences/rain_on_roof.ogg",
    uri: "spotify:track:4iZ4mst790ZCrSV48vKVkX",
    external_urls: { spotify: "https://open.spotify.com/track/4iZ4mst790ZCrSV48vKVkX" },
    popularity: 95,
  },
  {
    id: "trk-weird-fishes",
    name: "Weird Fishes / Arpeggi",
    artists: [{ id: "art-radiohead", name: "Radiohead" }],
    album: MOCK_ALBUMS[4],
    duration_ms: 318000,
    preview_url: "https://actions.google.com/sounds/v1/water/lake_waves_lapping.ogg",
    uri: "spotify:track:4wajJ1N70QTEgIIgtSpAC0",
    external_urls: { spotify: "https://open.spotify.com/track/4wajJ1N70QTEgIIgtSpAC0" },
    popularity: 85,
  },
  {
    id: "trk-digital-love",
    name: "Digital Love",
    artists: [{ id: "art-daftpunk", name: "Daft Punk" }],
    album: MOCK_ALBUMS[5],
    duration_ms: 298000,
    preview_url: "https://actions.google.com/sounds/v1/transportation/plane_cabin_chime.ogg",
    uri: "spotify:track:2noACgV0118B8iRk5jCeqk",
    external_urls: { spotify: "https://open.spotify.com/track/2noACgV0118B8iRk5jCeqk" },
    popularity: 84,
  }
];

export const CURRENT_USER: UserProfile = {
  id: "usr-me",
  username: "jatins",
  displayName: "Jatin Srivastava",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "Audiophile, late night synth dreamer & hip-hop purist. Listening to music 14h/day.",
  followerCount: 248,
  followingCount: 184,
  spotifyConnected: true,
  spotifyUri: "spotify:user:jatinsrivastava",
  topGenres: ["Neo-Soul", "Indie Rock", "Conscious Hip-Hop", "French House"],
  favoriteTracks: [MOCK_TRACKS[1], MOCK_TRACKS[5], MOCK_TRACKS[0], MOCK_TRACKS[6]],
  favoriteAlbums: [MOCK_ALBUMS[0], MOCK_ALBUMS[4], MOCK_ALBUMS[2], MOCK_ALBUMS[1]],
};

export const MOCK_FRIENDS: UserProfile[] = [
  {
    id: "usr-alex",
    username: "alexrivera",
    displayName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    bio: "Vinyl collector. Stankonia on repeat. Catch me at Primavera Sound.",
    followerCount: 512,
    followingCount: 340,
    isFollowing: true,
    spotifyConnected: true,
    topGenres: ["Psychedelic Rock", "Conscious Hip-Hop", "Nu-Disco"],
    favoriteTracks: [MOCK_TRACKS[0], MOCK_TRACKS[2], MOCK_TRACKS[4]],
    favoriteAlbums: [MOCK_ALBUMS[1], MOCK_ALBUMS[0], MOCK_ALBUMS[5]],
  },
  {
    id: "usr-maya",
    username: "mayachen",
    displayName: "Maya Chen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    bio: "R&B aficionado | bedroom pop producer | SZA stan account basically",
    followerCount: 890,
    followingCount: 420,
    isFollowing: true,
    spotifyConnected: true,
    topGenres: ["Contemporary R&B", "Bed Pop", "Neo-Soul"],
    favoriteTracks: [MOCK_TRACKS[4], MOCK_TRACKS[3]],
    favoriteAlbums: [MOCK_ALBUMS[3], MOCK_ALBUMS[0]],
  },
  {
    id: "usr-liam",
    username: "liamtorres",
    displayName: "Liam Torres",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    bio: "Synthesizers & basslines. If it has a Rhodes piano, I am already sold.",
    followerCount: 310,
    followingCount: 290,
    isFollowing: false,
    spotifyConnected: true,
    topGenres: ["French House", "Post-Punk", "Ambient"],
    favoriteTracks: [MOCK_TRACKS[6], MOCK_TRACKS[5]],
    favoriteAlbums: [MOCK_ALBUMS[5], MOCK_ALBUMS[4]],
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    user: MOCK_FRIENDS[0],
    type: "ALBUM_REVIEW",
    album: MOCK_ALBUMS[0],
    caption: "Still the greatest pop/experimental album of the 2010s. The beat switch on 'Nights' at 3:30 marks the exact midpoint of the record and splits daytime from night. Absolute genius.",
    rating: 5.0,
    likesCount: 64,
    isLiked: true,
    commentsCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    comments: [
      {
        id: "c-1",
        user: { id: CURRENT_USER.id, username: CURRENT_USER.username, displayName: CURRENT_USER.displayName, avatar: CURRENT_USER.avatar },
        text: "White Ferrari into Seigfried is the most emotional 8 minutes in modern music.",
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: "c-2",
        user: { id: MOCK_FRIENDS[1].id, username: MOCK_FRIENDS[1].username, displayName: MOCK_FRIENDS[1].displayName, avatar: MOCK_FRIENDS[1].avatar },
        text: "Agreed 10000%. Truly untouchable.",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      }
    ]
  },
  {
    id: "post-2",
    user: MOCK_FRIENDS[1],
    type: "LISTENING_NOW",
    track: MOCK_TRACKS[4],
    caption: "Late night vibes hit different with this on headphones. SZA's vocals on this bridge give me chills every single time.",
    likesCount: 38,
    isLiked: false,
    commentsCount: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    comments: []
  },
  {
    id: "post-3",
    user: CURRENT_USER,
    type: "TIER_LIST",
    rankingTitle: "Radiohead & Kendrick Discography Tiers",
    caption: "Spent my Sunday ranking these masterpieces. Putting In Rainbows in God Tier was non-negotiable.",
    tiers: [
      { tier: "S", name: "God Tier", items: [MOCK_ALBUMS[4], MOCK_ALBUMS[1]] },
      { tier: "A", name: "Essential", items: [MOCK_ALBUMS[0], MOCK_ALBUMS[2]] },
      { tier: "B", name: "Great", items: [MOCK_ALBUMS[5], MOCK_ALBUMS[3]] },
    ],
    likesCount: 92,
    isLiked: false,
    commentsCount: 19,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    comments: [
      {
        id: "c-3",
        user: { id: MOCK_FRIENDS[2].id, username: MOCK_FRIENDS[2].username, displayName: MOCK_FRIENDS[2].displayName, avatar: MOCK_FRIENDS[2].avatar },
        text: "Discovery should be S tier! That guitar solo in Digital Love is legendary.",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      }
    ]
  },
  {
    id: "post-4",
    user: MOCK_FRIENDS[2],
    type: "SONG_DROP",
    track: MOCK_TRACKS[6],
    caption: "If you've never listened to this with good open-back headphones, you're missing out on 4 layers of basslines.",
    likesCount: 45,
    isLiked: true,
    commentsCount: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    comments: []
  }
];

export const MOCK_RANKING_LISTS: RankingList[] = [
  {
    id: "rank-1",
    userId: CURRENT_USER.id,
    title: "All-Time Top 10 Albums",
    description: "The 10 records that shaped my musical perspective.",
    category: "ALBUM",
    isTierList: false,
    items: [
      { id: "ri-1", spotifyId: MOCK_ALBUMS[0].id, type: "album", title: MOCK_ALBUMS[0].name, artist: "Frank Ocean", imageUrl: MOCK_ALBUMS[0].images[0].url, rank: 1, score: 9.9, reviewNote: "Peak songwriting and sonic atmosphere." },
      { id: "ri-2", spotifyId: MOCK_ALBUMS[4].id, type: "album", title: MOCK_ALBUMS[4].name, artist: "Radiohead", imageUrl: MOCK_ALBUMS[4].images[0].url, rank: 2, score: 9.8, reviewNote: "Warm, textured, breathtaking art rock." },
      { id: "ri-3", spotifyId: MOCK_ALBUMS[1].id, type: "album", title: MOCK_ALBUMS[1].name, artist: "Kendrick Lamar", imageUrl: MOCK_ALBUMS[1].images[0].url, rank: 3, score: 9.7, reviewNote: "A cultural and musical milestone." },
      { id: "ri-4", spotifyId: MOCK_ALBUMS[2].id, type: "album", title: MOCK_ALBUMS[2].name, artist: "Tyler, The Creator", imageUrl: MOCK_ALBUMS[2].images[0].url, rank: 4, score: 9.4, reviewNote: "Genre-bending production masterclass." },
      { id: "ri-5", spotifyId: MOCK_ALBUMS[5].id, type: "album", title: MOCK_ALBUMS[5].name, artist: "Daft Punk", imageUrl: MOCK_ALBUMS[5].images[0].url, rank: 5, score: 9.3, reviewNote: "Pure nostalgic French touch joy." },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "rank-2",
    userId: CURRENT_USER.id,
    title: "2020s R&B / Neo-Soul Tier List",
    description: "Evaluating the modern soul landscape.",
    category: "DISCOGRAPHY",
    isTierList: true,
    items: [
      { id: "ri-6", spotifyId: MOCK_ALBUMS[3].id, type: "album", title: MOCK_ALBUMS[3].name, artist: "SZA", imageUrl: MOCK_ALBUMS[3].images[0].url, tier: "S", score: 9.5, reviewNote: "Genre defining opus." },
      { id: "ri-7", spotifyId: MOCK_TRACKS[4].id, type: "track", title: MOCK_TRACKS[4].name, artist: "SZA", imageUrl: MOCK_TRACKS[4].album.images[0].url, tier: "S", score: 9.6, reviewNote: "Unbeatable melody." },
      { id: "ri-8", spotifyId: MOCK_TRACKS[0].id, type: "track", title: MOCK_TRACKS[0].name, artist: "Frank Ocean", imageUrl: MOCK_TRACKS[0].album.images[0].url, tier: "A", score: 9.2, reviewNote: "Transcendent ending." },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  }
];
