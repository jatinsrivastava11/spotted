import SwiftUI

public struct FeedView: View {
    @ObservedObject var socialStore = SocialStore.shared
    @State private var selectedFilter: String = "ALL"
    @State private var showCreateSheet = false
    
    public init() {}
    
    private var filteredPosts: [Post] {
        socialStore.posts.filter { post in
            switch selectedFilter {
            case "REVIEWS": return post.type == .albumReview
            case "DROPS": return post.type == .songDrop || post.type == .listeningNow
            case "TIERS": return post.type == .tierList
            default: return true
            }
        }
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 16) {
                    // Live Banner
                    liveListeningBanner
                    
                    // Filter Chips
                    filterChipsView
                    
                    // Posts
                    ForEach(filteredPosts) { post in
                        PostCardView(post: post)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 80) // Spacing for NowPlayingBar
            }
            .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
            .navigationTitle("Spotted")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    HStack(spacing: 6) {
                        Circle().fill(Color.spotifyGreen).frame(width: 8, height: 8)
                        Text("LIVE")
                            .font(.system(size: 10, weight: .black))
                            .foregroundColor(.spotifyGreen)
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showCreateSheet = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.spotifyGreen)
                    }
                }
            }
            .sheet(isPresented: $showCreateSheet) {
                CreatePostSheet()
            }
        }
    }
    
    private var liveListeningBanner: some View {
        HStack(spacing: 12) {
            Image(systemName: "headphones")
                .font(.system(size: 24))
                .foregroundColor(.spotifyGreen)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Your Circle's Live Rotation")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                Text("See what friends are ranking and reviewing in real time.")
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.6))
            }
            
            Spacer()
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(red: 18/255, green: 18/255, blue: 24/255))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.spotifyGreen.opacity(0.3), lineWidth: 1)
                )
        )
    }
    
    private var filterChipsView: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach([
                    ("ALL", "All Activity"),
                    ("REVIEWS", "Album Reviews"),
                    ("DROPS", "Song Drops"),
                    ("TIERS", "Tier Lists")
                ], id: \.0) { id, title in
                    let isSelected = selectedFilter == id
                    Button(action: { selectedFilter = id }) {
                        Text(title)
                            .font(.system(size: 12, weight: .bold))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(isSelected ? Color.white.opacity(0.15) : Color(red: 20/255, green: 20/255, blue: 24/255))
                            .foregroundColor(isSelected ? .white : .white.opacity(0.5))
                            .cornerRadius(20)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(isSelected ? Color.spotifyGreen.opacity(0.5) : Color.white.opacity(0.06), lineWidth: 1)
                            )
                    }
                }
            }
        }
    }
}
