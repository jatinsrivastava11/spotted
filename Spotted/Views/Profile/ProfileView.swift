import SwiftUI

public struct ProfileView: View {
    @ObservedObject var socialStore = SocialStore.shared
    
    public init() {}
    
    private var user: UserProfile {
        socialStore.currentUser
    }
    
    private var userPosts: [Post] {
        socialStore.posts.filter { $0.user.id == user.id }
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 20) {
                    // Profile Header Card
                    VStack(spacing: 16) {
                        HStack(spacing: 16) {
                            ZStack(alignment: .bottomTrailing) {
                                AsyncImage(url: URL(string: user.avatarUrl)) { phase in
                                    switch phase {
                                    case .success(let img): img.resizable().scaledToFill()
                                    default: Color.zinc800
                                    }
                                }
                                .frame(width: 72, height: 72)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.spotifyGreen, lineWidth: 2))
                                
                                Circle()
                                    .fill(Color.spotifyGreen)
                                    .frame(width: 14, height: 14)
                                    .overlay(Circle().stroke(Color.black, lineWidth: 2))
                            }
                            
                            VStack(alignment: .leading, spacing: 3) {
                                HStack(spacing: 6) {
                                    Text(user.displayName)
                                        .font(.system(size: 18, weight: .black))
                                        .foregroundColor(.white)
                                    
                                    if user.spotifyConnected {
                                        Image(systemName: "checkmark.seal.fill")
                                            .font(.system(size: 14))
                                            .foregroundColor(.spotifyGreen)
                                    }
                                }
                                
                                Text("@\(user.username)")
                                    .font(.system(size: 13, design: .monospaced))
                                    .foregroundColor(.white.opacity(0.5))
                                
                                // Stats (Followers, Following, Reviews)
                                HStack(spacing: 16) {
                                    HStack(spacing: 4) {
                                        Text("\(user.followerCount)").font(.system(size: 12, weight: .bold)).foregroundColor(.white)
                                        Text("followers").font(.system(size: 11)).foregroundColor(.white.opacity(0.5))
                                    }
                                    HStack(spacing: 4) {
                                        Text("\(user.followingCount)").font(.system(size: 12, weight: .bold)).foregroundColor(.white)
                                        Text("following").font(.system(size: 11)).foregroundColor(.white.opacity(0.5))
                                    }
                                }
                                .padding(.top, 4)
                            }
                            
                            Spacer()
                        }
                        
                        // Bio
                        Text(user.bio)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.8))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .lineSpacing(3)
                        
                        // Genre Tags
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 6) {
                                ForEach(user.topGenres, id: \.self) { genre in
                                    Text(genre)
                                        .font(.system(size: 11, weight: .semibold))
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 4)
                                        .background(Color.white.opacity(0.08))
                                        .foregroundColor(.white.opacity(0.8))
                                        .cornerRadius(12)
                                }
                            }
                        }
                    }
                    .padding(18)
                    .background(
                        RoundedRectangle(cornerRadius: 24)
                            .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.white.opacity(0.06), lineWidth: 1)
                            )
                    )
                    
                    // Curated Top 4 Centerpiece
                    CuratedFavoritesView()
                    
                    // User's Posts / Reviews
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Text("Activity & Reviews")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                            Spacer()
                            Text("\(userPosts.count)")
                                .font(.system(size: 12, weight: .bold, design: .monospaced))
                                .foregroundColor(.spotifyGreen)
                        }
                        
                        ForEach(userPosts) { post in
                            PostCardView(post: post)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 80)
            }
            .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
