import SwiftUI

public struct CuratedFavoritesView: View {
    @ObservedObject var socialStore = SocialStore.shared
    @State private var selectedTab: String = "ALBUMS"
    
    public init() {}
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 13))
                            .foregroundColor(.yellow)
                        Text("Curated Favorites")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                    }
                    Text("Letterboxd-style centerpiece for your music taste.")
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.5))
                }
                
                Spacer()
                
                // Toggle Albums vs Tracks
                HStack(spacing: 2) {
                    Button(action: { selectedTab = "ALBUMS" }) {
                        Text("Albums")
                            .font(.system(size: 11, weight: .bold))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(selectedTab == "ALBUMS" ? Color.spotifyGreen : Color.clear)
                            .foregroundColor(selectedTab == "ALBUMS" ? .black : .white.opacity(0.6))
                            .cornerRadius(8)
                    }
                    
                    Button(action: { selectedTab = "TRACKS" }) {
                        Text("Songs")
                            .font(.system(size: 11, weight: .bold))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(selectedTab == "TRACKS" ? Color.spotifyGreen : Color.clear)
                            .foregroundColor(selectedTab == "TRACKS" ? .black : .white.opacity(0.6))
                            .cornerRadius(8)
                    }
                }
                .padding(3)
                .background(Color.black.opacity(0.4))
                .cornerRadius(10)
            }
            
            // 4-Slot Grid
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                if selectedTab == "ALBUMS" {
                    ForEach(Array(socialStore.currentUser.favoriteAlbums.prefix(4).enumerated()), id: \.offset) { index, album in
                        favoriteAlbumItem(album: album, index: index + 1)
                    }
                } else {
                    ForEach(Array(socialStore.currentUser.favoriteTracks.prefix(4).enumerated()), id: \.offset) { index, track in
                        favoriteTrackItem(track: track, index: index + 1)
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
    }
    
    private func favoriteAlbumItem(album: SpotifyAlbum, index: Int) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            ZStack(alignment: .topLeading) {
                AsyncImage(url: URL(string: album.imageUrl)) { phase in
                    switch phase {
                    case .success(let img): img.resizable().scaledToFill()
                    default: Color.zinc800
                    }
                }
                .aspectRatio(1, contentMode: .fit)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                
                Text("#\(index)")
                    .font(.system(size: 10, weight: .black))
                    .foregroundColor(.spotifyGreen)
                    .padding(4)
                    .background(Color.black.opacity(0.7))
                    .cornerRadius(4)
                    .padding(4)
            }
            
            Text(album.name)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
                .lineLimit(1)
            
            Text(album.artistNames)
                .font(.system(size: 9))
                .foregroundColor(.white.opacity(0.5))
                .lineLimit(1)
        }
    }
    
    private func favoriteTrackItem(track: SpotifyTrack, index: Int) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            ZStack(alignment: .topLeading) {
                AsyncImage(url: URL(string: track.album.imageUrl)) { phase in
                    switch phase {
                    case .success(let img): img.resizable().scaledToFill()
                    default: Color.zinc800
                    }
                }
                .aspectRatio(1, contentMode: .fit)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                
                Text("#\(index)")
                    .font(.system(size: 10, weight: .black))
                    .foregroundColor(.spotifyGreen)
                    .padding(4)
                    .background(Color.black.opacity(0.7))
                    .cornerRadius(4)
                    .padding(4)
            }
            
            Text(track.name)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
                .lineLimit(1)
            
            Text(track.artistNames)
                .font(.system(size: 9))
                .foregroundColor(.white.opacity(0.5))
                .lineLimit(1)
        }
    }
}
