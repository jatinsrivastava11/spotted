import SwiftUI

public struct PostCardView: View {
    public let post: Post
    @ObservedObject var socialStore = SocialStore.shared
    @ObservedObject var audioService = AudioPlayerService.shared
    @State private var showCommentSheet = false
    @State private var commentText = ""
    
    public init(post: Post) {
        self.post = post
    }
    
    private var isPlayingThisTrack: Bool {
        guard let track = post.track else { return false }
        return audioService.currentTrack?.id == track.id && audioService.isPlaying
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // User Header
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: post.user.avatarUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().scaledToFill()
                    default:
                        Color.zinc800
                    }
                }
                .frame(width: 40, height: 40)
                .clipShape(Circle())
                .overlay(Circle().stroke(Color.white.opacity(0.1), lineWidth: 1))
                
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 4) {
                        Text(post.user.displayName)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("@\(post.user.username)")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.5))
                    }
                    
                    Text("35m ago")
                        .font(.system(size: 11))
                        .foregroundColor(.white.opacity(0.4))
                }
                
                Spacer()
                
                // Badge
                badgeView
            }
            
            // Music Showcase (Track or Album or Tier)
            if post.type != .tierList {
                musicShowcaseView
            } else {
                tierListShowcaseView
            }
            
            // Caption
            if !post.caption.isEmpty {
                Text(post.caption)
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.9))
                    .lineSpacing(3)
            }
            
            // Actions (Like & Comments)
            HStack(spacing: 20) {
                Button(action: {
                    withAnimation(.spring(response: 0.25, dampingFraction: 0.6)) {
                        socialStore.toggleLike(postId: post.id)
                    }
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: post.isLiked ? "heart.fill" : "heart")
                            .font(.system(size: 15))
                            .foregroundColor(post.isLiked ? .red : .white.opacity(0.6))
                        
                        Text("\(post.likesCount)")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(post.isLiked ? .red : .white.opacity(0.6))
                    }
                }
                
                Button(action: {
                    showCommentSheet = true
                }) {
                    HStack(spacing: 6) {
                        Image(systemName: "bubble.right")
                            .font(.system(size: 15))
                            .foregroundColor(.white.opacity(0.6))
                        
                        Text("\(post.commentsCount)")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                
                Spacer()
                
                if let urlString = post.track?.spotifyUrl ?? post.album?.spotifyUrl,
                   let url = URL(string: urlString) {
                    Link(destination: url) {
                        HStack(spacing: 4) {
                            Text("Spotify")
                                .font(.system(size: 11, weight: .semibold))
                            Image(systemName: "arrow.up.right")
                                .font(.system(size: 9))
                        }
                        .foregroundColor(.spotifyGreen)
                    }
                }
            }
            .padding(.top, 4)
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
        .sheet(isPresented: $showCommentSheet) {
            commentSheetView
        }
    }
    
    // MARK: - Subviews
    
    private var badgeView: some View {
        Group {
            switch post.type {
            case .albumReview:
                HStack(spacing: 4) {
                    Image(systemName: "star.fill").font(.system(size: 10))
                    Text("Album Review")
                }
                .font(.system(size: 11, weight: .bold))
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color.yellow.opacity(0.15))
                .foregroundColor(.yellow)
                .cornerRadius(12)
            case .songDrop:
                Text("Song Drop")
                    .font(.system(size: 11, weight: .bold))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.spotifyGreen.opacity(0.15))
                    .foregroundColor(.spotifyGreen)
                    .cornerRadius(12)
            case .tierList:
                HStack(spacing: 4) {
                    Image(systemName: "sparkles").font(.system(size: 10))
                    Text("Tier List")
                }
                .font(.system(size: 11, weight: .bold))
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color.purple.opacity(0.15))
                .foregroundColor(.purple)
                .cornerRadius(12)
            case .listeningNow:
                HStack(spacing: 4) {
                    Circle().fill(Color.spotifyGreen).frame(width: 6, height: 6)
                    Text("Listening Now")
                }
                .font(.system(size: 11, weight: .bold))
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(Color.spotifyGreen.opacity(0.15))
                .foregroundColor(.spotifyGreen)
                .cornerRadius(12)
            }
        }
    }
    
    private var musicShowcaseView: some View {
        let imageUrl = post.track?.album.imageUrl ?? post.album?.imageUrl ?? ""
        let title = post.track?.name ?? post.album?.name ?? ""
        let artists = post.track?.artistNames ?? post.album?.artistNames ?? ""
        
        return HStack(spacing: 16) {
            // Album art with slide-out vinyl
            ZStack {
                // Peek vinyl
                Circle()
                    .fill(Color.black)
                    .frame(width: 80, height: 80)
                    .overlay(Circle().stroke(Color.white.opacity(0.15), lineWidth: 1))
                    .offset(x: isPlayingThisTrack ? 18 : 6)
                
                // Cover
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().scaledToFill()
                    default:
                        Color.zinc800
                    }
                }
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                
                // Play overlay if it's a track
                if let track = post.track {
                    Button(action: {
                        audioService.play(track: track)
                    }) {
                        Circle()
                            .fill(Color.black.opacity(0.4))
                            .frame(width: 32, height: 32)
                            .overlay(
                                Image(systemName: isPlayingThisTrack ? "pause.fill" : "play.fill")
                                    .font(.system(size: 13))
                                    .foregroundColor(.white)
                            )
                    }
                }
            }
            .frame(width: 100, height: 80)
            
            // Metadata & Ratings
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                
                Text(artists)
                    .font(.system(size: 13))
                    .foregroundColor(.white.opacity(0.6))
                    .lineLimit(1)
                
                // Star rating for reviews
                if let rating = post.rating {
                    HStack(spacing: 3) {
                        ForEach(1...5, id: \.self) { star in
                            Image(systemName: Double(star) <= rating ? "star.fill" : "star")
                                .font(.system(size: 12))
                                .foregroundColor(.yellow)
                        }
                        Text(String(format: "%.1f", rating))
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.yellow)
                            .padding(.leading, 4)
                    }
                    .padding(.top, 2)
                }
                
                if let track = post.track {
                    Button(action: {
                        audioService.play(track: track)
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: isPlayingThisTrack ? "waveform" : "play.circle.fill")
                                .font(.system(size: 11))
                            Text(isPlayingThisTrack ? "Playing 30s" : "Preview Track")
                                .font(.system(size: 11, weight: .semibold))
                        }
                        .foregroundColor(isPlayingThisTrack ? .spotifyGreen : .white.opacity(0.8))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.white.opacity(0.08))
                        .cornerRadius(6)
                    }
                    .padding(.top, 2)
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.black.opacity(0.3))
        .cornerRadius(16)
    }
    
    private var tierListShowcaseView: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let title = post.rankingTitle {
                Text(title)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
            }
            
            if let tiers = post.tiers {
                ForEach(["S", "A", "B"], id: \.self) { tierKey in
                    let items = tiers.filter { $0.tier == tierKey }
                    if !items.isEmpty {
                        HStack(spacing: 8) {
                            Text(tierKey)
                                .font(.system(size: 14, weight: .black))
                                .frame(width: 32, height: 32)
                                .background(tierColor(for: tierKey).opacity(0.2))
                                .foregroundColor(tierColor(for: tierKey))
                                .cornerRadius(8)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 6) {
                                    ForEach(items) { item in
                                        let img = item.track?.album.imageUrl ?? item.album?.imageUrl ?? ""
                                        AsyncImage(url: URL(string: img)) { phase in
                                            switch phase {
                                            case .success(let image):
                                                image.resizable().scaledToFill()
                                            default:
                                                Color.zinc800
                                            }
                                        }
                                        .frame(width: 32, height: 32)
                                        .clipShape(RoundedRectangle(cornerRadius: 6))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.black.opacity(0.3))
        .cornerRadius(16)
    }
    
    private func tierColor(for tier: String) -> Color {
        switch tier {
        case "S": return .red
        case "A": return .orange
        case "B": return .yellow
        default: return .blue
        }
    }
    
    private var commentSheetView: some View {
        NavigationStack {
            VStack(spacing: 0) {
                List {
                    ForEach(post.comments) { comment in
                        HStack(alignment: .top, spacing: 10) {
                            AsyncImage(url: URL(string: comment.avatarUrl)) { phase in
                                switch phase {
                                case .success(let img): img.resizable().scaledToFill()
                                default: Color.zinc800
                                }
                            }
                            .frame(width: 32, height: 32)
                            .clipShape(Circle())
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(comment.displayName)
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Text(comment.text)
                                    .font(.system(size: 13))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                        }
                        .listRowBackground(Color.clear)
                    }
                }
                .listStyle(.plain)
                
                HStack(spacing: 12) {
                    TextField("Add a comment...", text: $commentText)
                        .padding(10)
                        .background(Color.zinc800)
                        .cornerRadius(10)
                        .foregroundColor(.white)
                    
                    Button("Post") {
                        socialStore.addComment(postId: post.id, text: commentText)
                        commentText = ""
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.spotifyGreen)
                    .disabled(commentText.isEmpty)
                }
                .padding()
            }
            .background(Color(red: 14/255, green: 14/255, blue: 18/255).ignoresSafeArea())
            .navigationTitle("Comments")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
