import SwiftUI

public struct SpotifyStatsView: View {
    @ObservedObject var spotify = SpotifyService.shared
    @ObservedObject var audioService = AudioPlayerService.shared
    @ObservedObject var socialStore = SocialStore.shared
    
    @State private var timeframe = "4_weeks"
    @State private var selectedMedia = "TRACKS"
    
    public init() {}
    
    private var topTracks: [SpotifyTrack] {
        spotify.getTopTracks(for: timeframe)
    }
    
    private var topAlbums: [SpotifyAlbum] {
        spotify.getTopAlbums(for: timeframe)
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 20) {
                    // Curated Top 4
                    CuratedFavoritesView()
                    
                    // Timeframe Switcher
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: "chart.bar.fill")
                                .foregroundColor(.spotifyGreen)
                            Text("Automated Spotify Stats")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                            Spacer()
                        }
                        
                        HStack(spacing: 8) {
                            ForEach([
                                ("4_weeks", "4 Weeks"),
                                ("6_months", "6 Months"),
                                ("all_time", "All Time")
                            ], id: \.0) { id, title in
                                let isSelected = timeframe == id
                                Button(action: { timeframe = id }) {
                                    Text(title)
                                        .font(.system(size: 12, weight: .bold))
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 8)
                                        .background(isSelected ? Color.spotifyGreen : Color(red: 22/255, green: 22/255, blue: 26/255))
                                        .foregroundColor(isSelected ? .black : .white.opacity(0.6))
                                        .cornerRadius(12)
                                }
                            }
                        }
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.white.opacity(0.06), lineWidth: 1)
                            )
                    )
                    
                    // Tracks or Albums Toggle
                    HStack(spacing: 16) {
                        Button(action: { selectedMedia = "TRACKS" }) {
                            VStack(spacing: 4) {
                                Text("Top Tracks")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(selectedMedia == "TRACKS" ? .white : .white.opacity(0.5))
                                
                                Rectangle()
                                    .fill(selectedMedia == "TRACKS" ? Color.spotifyGreen : Color.clear)
                                    .frame(height: 2)
                            }
                        }
                        
                        Button(action: { selectedMedia = "ALBUMS" }) {
                            VStack(spacing: 4) {
                                Text("Top Albums")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(selectedMedia == "ALBUMS" ? .white : .white.opacity(0.5))
                                
                                Rectangle()
                                    .fill(selectedMedia == "ALBUMS" ? Color.spotifyGreen : Color.clear)
                                    .frame(height: 2)
                            }
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 4)
                    
                    // List or Grid
                    if selectedMedia == "TRACKS" {
                        VStack(spacing: 8) {
                            ForEach(Array(topTracks.enumerated()), id: \.element.id) { index, track in
                                trackRow(track: track, index: index + 1)
                            }
                        }
                    } else {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            ForEach(Array(topAlbums.enumerated()), id: \.element.id) { index, album in
                                albumGridItem(album: album, index: index + 1)
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 80)
            }
            .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
            .navigationTitle("Music Stats")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func trackRow(track: SpotifyTrack, index: Int) -> some View {
        HStack(spacing: 12) {
            Text("#\(index)")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(.white.opacity(0.4))
                .frame(width: 24)
            
            AsyncImage(url: URL(string: track.album.imageUrl)) { phase in
                switch phase {
                case .success(let img): img.resizable().scaledToFill()
                default: Color.zinc800
                }
            }
            .frame(width: 44, height: 44)
            .cornerRadius(8)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(track.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                
                Text(track.artistNames)
                    .font(.system(size: 12))
                    .foregroundColor(.white.opacity(0.6))
                    .lineLimit(1)
            }
            
            Spacer()
            
            // Preview & Rank Actions
            Button(action: {
                audioService.play(track: track)
            }) {
                Image(systemName: audioService.currentTrack?.id == track.id && audioService.isPlaying ? "pause.fill" : "play.fill")
                    .font(.system(size: 12))
                    .foregroundColor(.white)
                    .frame(width: 32, height: 32)
                    .background(Color.white.opacity(0.1))
                    .clipShape(Circle())
            }
            
            Button(action: {
                socialStore.rankCurrentTrack(track: track, score: 9.5, tier: "S", note: "My top listened track!")
            }) {
                Text("Rank")
                    .font(.system(size: 11, weight: .bold))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 5)
                    .background(Color.spotifyGreen.opacity(0.15))
                    .foregroundColor(.spotifyGreen)
                    .cornerRadius(6)
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white.opacity(0.04), lineWidth: 1)
                )
        )
    }
    
    private func albumGridItem(album: SpotifyAlbum, index: Int) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack(alignment: .topLeading) {
                AsyncImage(url: URL(string: album.imageUrl)) { phase in
                    switch phase {
                    case .success(let img): img.resizable().scaledToFill()
                    default: Color.zinc800
                    }
                }
                .aspectRatio(1, contentMode: .fit)
                .cornerRadius(12)
                
                Text("#\(index)")
                    .font(.system(size: 11, weight: .black))
                    .foregroundColor(.spotifyGreen)
                    .padding(5)
                    .background(Color.black.opacity(0.7))
                    .cornerRadius(6)
                    .padding(6)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(album.name)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                
                Text(album.artistNames)
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.5))
                    .lineLimit(1)
            }
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
        )
    }
}
