import Foundation

@MainActor
public final class SpotifyService: ObservableObject {
    public static let shared = SpotifyService()
    
    // Default Mock Albums
    public let mockAlbums: [SpotifyAlbum] = [
        SpotifyAlbum(
            id: "alb-blonde",
            name: "Blonde",
            artists: [SpotifyArtist(id: "art-frank", name: "Frank Ocean")],
            imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2016",
            totalTracks: 17,
            spotifyUrl: "https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf"
        ),
        SpotifyAlbum(
            id: "alb-tpab",
            name: "To Pimp a Butterfly",
            artists: [SpotifyArtist(id: "art-kendrick", name: "Kendrick Lamar")],
            imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2015",
            totalTracks: 16,
            spotifyUrl: "https://open.spotify.com/album/7ycBtnsMtyVbbw3f4RqiKE"
        ),
        SpotifyAlbum(
            id: "alb-igor",
            name: "IGOR",
            artists: [SpotifyArtist(id: "art-tyler", name: "Tyler, The Creator")],
            imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2019",
            totalTracks: 12,
            spotifyUrl: "https://open.spotify.com/album/5zi7WsKlIiUXv09tbGLKsE"
        ),
        SpotifyAlbum(
            id: "alb-sos",
            name: "SOS",
            artists: [SpotifyArtist(id: "art-sza", name: "SZA")],
            imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2022",
            totalTracks: 23,
            spotifyUrl: "https://open.spotify.com/album/07w0rG5TETcyihsEIZR3qG"
        ),
        SpotifyAlbum(
            id: "alb-inrainbows",
            name: "In Rainbows",
            artists: [SpotifyArtist(id: "art-radiohead", name: "Radiohead")],
            imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2007",
            totalTracks: 10,
            spotifyUrl: "https://open.spotify.com/album/7eyQX4a0BNQc7A79u54zZ7"
        ),
        SpotifyAlbum(
            id: "alb-discovery",
            name: "Discovery",
            artists: [SpotifyArtist(id: "art-daftpunk", name: "Daft Punk")],
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
            releaseDate: "2001",
            totalTracks: 14,
            spotifyUrl: "https://open.spotify.com/album/2noACgV0118B8iRk5jCeqk"
        )
    ]
    
    // Default Mock Tracks
    public lazy var mockTracks: [SpotifyTrack] = [
        SpotifyTrack(
            id: "trk-nights",
            name: "Nights",
            artists: [SpotifyArtist(id: "art-frank", name: "Frank Ocean")],
            album: mockAlbums[0],
            durationMs: 307000,
            previewUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_evening.ogg",
            spotifyUrl: "https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ",
            popularity: 92
        ),
        SpotifyTrack(
            id: "trk-white-ferrari",
            name: "White Ferrari",
            artists: [SpotifyArtist(id: "art-frank", name: "Frank Ocean")],
            album: mockAlbums[0],
            durationMs: 248000,
            previewUrl: "https://actions.google.com/sounds/v1/water/rain_heavy.ogg",
            spotifyUrl: "https://open.spotify.com/track/2LMkwUfqC6S6s6qQI7iojZ",
            popularity: 88
        ),
        SpotifyTrack(
            id: "trk-alright",
            name: "Alright",
            artists: [SpotifyArtist(id: "art-kendrick", name: "Kendrick Lamar")],
            album: mockAlbums[1],
            durationMs: 219000,
            previewUrl: "https://actions.google.com/sounds/v1/transportation/subway_interior.ogg",
            spotifyUrl: "https://open.spotify.com/track/3iVcQ50SS4AkEvCa1vaq5Z",
            popularity: 89
        ),
        SpotifyTrack(
            id: "trk-earfquake",
            name: "EARFQUAKE",
            artists: [SpotifyArtist(id: "art-tyler", name: "Tyler, The Creator")],
            album: mockAlbums[2],
            durationMs: 190000,
            previewUrl: "https://actions.google.com/sounds/v1/water/gentle_stream.ogg",
            spotifyUrl: "https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYip",
            popularity: 91
        ),
        SpotifyTrack(
            id: "trk-snooze",
            name: "Snooze",
            artists: [SpotifyArtist(id: "art-sza", name: "SZA")],
            album: mockAlbums[3],
            durationMs: 201000,
            previewUrl: "https://actions.google.com/sounds/v1/ambiences/rain_on_roof.ogg",
            spotifyUrl: "https://open.spotify.com/track/4iZ4mst790ZCrSV48vKVkX",
            popularity: 95
        ),
        SpotifyTrack(
            id: "trk-weird-fishes",
            name: "Weird Fishes / Arpeggi",
            artists: [SpotifyArtist(id: "art-radiohead", name: "Radiohead")],
            album: mockAlbums[4],
            durationMs: 318000,
            previewUrl: "https://actions.google.com/sounds/v1/water/lake_waves_lapping.ogg",
            spotifyUrl: "https://open.spotify.com/track/4wajJ1N70QTEgIIgtSpAC0",
            popularity: 85
        ),
        SpotifyTrack(
            id: "trk-digital-love",
            name: "Digital Love",
            artists: [SpotifyArtist(id: "art-daftpunk", name: "Daft Punk")],
            album: mockAlbums[5],
            durationMs: 298000,
            previewUrl: "https://actions.google.com/sounds/v1/transportation/plane_cabin_chime.ogg",
            spotifyUrl: "https://open.spotify.com/track/2noACgV0118B8iRk5jCeqk",
            popularity: 84
        )
    ]
    
    // Top Tracks by Timeframe
    public func getTopTracks(for timeframe: String) -> [SpotifyTrack] {
        switch timeframe {
        case "4_weeks":
            return [mockTracks[4], mockTracks[0], mockTracks[3], mockTracks[1]]
        case "6_months":
            return [mockTracks[0], mockTracks[1], mockTracks[5], mockTracks[2], mockTracks[4]]
        default: // all_time
            return [mockTracks[1], mockTracks[5], mockTracks[0], mockTracks[6], mockTracks[2]]
        }
    }
    
    // Top Albums by Timeframe
    public func getTopAlbums(for timeframe: String) -> [SpotifyAlbum] {
        switch timeframe {
        case "4_weeks":
            return [mockAlbums[3], mockAlbums[0], mockAlbums[2]]
        case "6_months":
            return [mockAlbums[0], mockAlbums[4], mockAlbums[1]]
        default:
            return [mockAlbums[0], mockAlbums[1], mockAlbums[4], mockAlbums[5]]
        }
    }
    
    // Search
    public func search(query: String) -> (tracks: [SpotifyTrack], albums: [SpotifyAlbum]) {
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !q.isEmpty else { return ([], []) }
        
        let matchingTracks = mockTracks.filter {
            $0.name.lowercased().contains(q) ||
            $0.artistNames.lowercased().contains(q) ||
            $0.album.name.lowercased().contains(q)
        }
        
        let matchingAlbums = mockAlbums.filter {
            $0.name.lowercased().contains(q) ||
            $0.artistNames.lowercased().contains(q)
        }
        
        return (matchingTracks, matchingAlbums)
    }
}
