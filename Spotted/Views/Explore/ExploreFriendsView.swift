import SwiftUI

public struct ExploreFriendsView: View {
    @ObservedObject var socialStore = SocialStore.shared
    @ObservedObject var audioService = AudioPlayerService.shared
    
    public init() {}
    
    private func compatibilityInfo(for username: String) -> (score: Int, reason: String) {
        switch username {
        case "alexrivera":
            return (94, "Shared top artists: Frank Ocean & Kendrick Lamar")
        case "mayachen":
            return (86, "Shared top genres: Neo-Soul & R&B")
        case "liamtorres":
            return (79, "Shared love for: Daft Punk & French House")
        default:
            return (82, "High genre overlap in Indie Rock & Hip-Hop")
        }
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 16) {
                    // Header Card
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Image(systemName: "person.2.fill")
                                .foregroundColor(.spotifyGreen)
                            Text("Music DNA & Friend Match")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }
                        Text("Compare musical taste overlap and listen to friend rotations.")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.white.opacity(0.06), lineWidth: 1)
                            )
                    )
                    
                    // Friends List
                    ForEach(socialStore.friends) { friend in
                        let match = compatibilityInfo(for: friend.username)
                        
                        VStack(alignment: .leading, spacing: 14) {
                            // User Row & Follow Button
                            HStack(spacing: 12) {
                                AsyncImage(url: URL(string: friend.avatarUrl)) { phase in
                                    switch phase {
                                    case .success(let img): img.resizable().scaledToFill()
                                    default: Color.zinc800
                                    }
                                }
                                .frame(width: 46, height: 46)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.white.opacity(0.1), lineWidth: 1))
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(friend.displayName)
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(.white)
                                    Text("@\(friend.username)")
                                        .font(.system(size: 12))
                                        .foregroundColor(.white.opacity(0.5))
                                }
                                
                                Spacer()
                                
                                Button(action: {
                                    socialStore.toggleFollow(friendId: friend.id)
                                }) {
                                    HStack(spacing: 4) {
                                        Image(systemName: friend.isFollowing ? "checkmark" : "plus")
                                            .font(.system(size: 10, weight: .bold))
                                        Text(friend.isFollowing ? "Following" : "Follow")
                                            .font(.system(size: 12, weight: .bold))
                                    }
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(friend.isFollowing ? Color.white.opacity(0.1) : Color.spotifyGreen)
                                    .foregroundColor(friend.isFollowing ? .white : .black)
                                    .cornerRadius(20)
                                }
                            }
                            
                            // Bio
                            Text(friend.bio)
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.7))
                                .lineLimit(2)
                            
                            // Music Taste Match Bar
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    HStack(spacing: 4) {
                                        Image(systemName: "sparkles")
                                            .font(.system(size: 11))
                                        Text("Taste Compatibility")
                                            .font(.system(size: 12, weight: .bold))
                                    }
                                    .foregroundColor(.purple)
                                    
                                    Spacer()
                                    
                                    Text("\(match.score)% Match")
                                        .font(.system(size: 12, weight: .black, design: .monospaced))
                                        .foregroundColor(.purple)
                                }
                                
                                GeometryReader { geo in
                                    ZStack(alignment: .leading) {
                                        Capsule().fill(Color.black.opacity(0.4)).frame(height: 6)
                                        Capsule().fill(
                                            LinearGradient(
                                                colors: [.purple, .spotifyGreen],
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            )
                                        )
                                        .frame(width: geo.size.width * CGFloat(match.score) / 100, height: 6)
                                    }
                                }
                                .frame(height: 6)
                                
                                Text(match.reason)
                                    .font(.system(size: 10))
                                    .foregroundColor(.white.opacity(0.4))
                                    .italic()
                            }
                            .padding(12)
                            .background(Color.purple.opacity(0.08))
                            .cornerRadius(12)
                            
                            // Friend's current top track
                            if let topTrack = friend.favoriteTracks.first {
                                HStack(spacing: 10) {
                                    AsyncImage(url: URL(string: topTrack.album.imageUrl)) { phase in
                                        switch phase {
                                        case .success(let img): img.resizable().scaledToFill()
                                        default: Color.zinc800
                                        }
                                    }
                                    .frame(width: 32, height: 32)
                                    .cornerRadius(6)
                                    
                                    VStack(alignment: .leading, spacing: 1) {
                                        HStack(spacing: 4) {
                                            Circle().fill(Color.spotifyGreen).frame(width: 4, height: 4)
                                            Text("Heavy Rotation")
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(.spotifyGreen)
                                        }
                                        Text(topTrack.name)
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(.white)
                                            .lineLimit(1)
                                    }
                                    
                                    Spacer()
                                    
                                    Button(action: { audioService.play(track: topTrack) }) {
                                        Image(systemName: "play.circle.fill")
                                            .font(.system(size: 20))
                                            .foregroundColor(.white.opacity(0.7))
                                    }
                                }
                                .padding(8)
                                .background(Color.black.opacity(0.3))
                                .cornerRadius(10)
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
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 80)
            }
            .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
            .navigationTitle("Explore Friends")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
