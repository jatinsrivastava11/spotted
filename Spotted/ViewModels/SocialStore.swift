import Foundation
import SwiftUI

@MainActor
public final class SocialStore: ObservableObject {
    public static let shared = SocialStore()
    
    @Published public var currentUser: UserProfile
    @Published public var friends: [UserProfile]
    @Published public var posts: [Post]
    @Published public var rankings: [RankingList]
    
    private init() {
        let spotify = SpotifyService.shared
        
        // Setup Current User
        let user = UserProfile(
            id: "usr-me",
            username: "jatins",
            displayName: "Jatin Srivastava",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
            bio: "Audiophile, late night synth dreamer & hip-hop purist. Listening to music 14h/day.",
            followerCount: 248,
            followingCount: 184,
            isFollowing: false,
            spotifyConnected: true,
            topGenres: ["Neo-Soul", "Indie Rock", "Conscious Hip-Hop", "French House"],
            favoriteTracks: [spotify.mockTracks[1], spotify.mockTracks[5], spotify.mockTracks[0], spotify.mockTracks[6]],
            favoriteAlbums: [spotify.mockAlbums[0], spotify.mockAlbums[4], spotify.mockAlbums[2], spotify.mockAlbums[1]]
        )
        self.currentUser = user
        
        // Setup Friends
        let alex = UserProfile(
            id: "usr-alex",
            username: "alexrivera",
            displayName: "Alex Rivera",
            avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
            bio: "Vinyl collector. Stankonia on repeat. Catch me at Primavera Sound.",
            followerCount: 512,
            followingCount: 340,
            isFollowing: true,
            spotifyConnected: true,
            topGenres: ["Psychedelic Rock", "Conscious Hip-Hop", "Nu-Disco"],
            favoriteTracks: [spotify.mockTracks[0], spotify.mockTracks[2]],
            favoriteAlbums: [spotify.mockAlbums[1], spotify.mockAlbums[0]]
        )
        
        let maya = UserProfile(
            id: "usr-maya",
            username: "mayachen",
            displayName: "Maya Chen",
            avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
            bio: "R&B aficionado | bedroom pop producer | SZA stan account basically",
            followerCount: 890,
            followingCount: 420,
            isFollowing: true,
            spotifyConnected: true,
            topGenres: ["Contemporary R&B", "Bed Pop", "Neo-Soul"],
            favoriteTracks: [spotify.mockTracks[4], spotify.mockTracks[3]],
            favoriteAlbums: [spotify.mockAlbums[3], spotify.mockAlbums[0]]
        )
        
        let liam = UserProfile(
            id: "usr-liam",
            username: "liamtorres",
            displayName: "Liam Torres",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
            bio: "Synthesizers & basslines. If it has a Rhodes piano, I am already sold.",
            followerCount: 310,
            followingCount: 290,
            isFollowing: false,
            spotifyConnected: true,
            topGenres: ["French House", "Post-Punk", "Ambient"],
            favoriteTracks: [spotify.mockTracks[6]],
            favoriteAlbums: [spotify.mockAlbums[5]]
        )
        self.friends = [alex, maya, liam]
        
        // Initial Posts
        self.posts = [
            Post(
                id: "post-1",
                user: alex,
                type: .albumReview,
                album: spotify.mockAlbums[0], // Blonde
                caption: "Still the greatest pop/experimental album of the 2010s. The beat switch on 'Nights' at 3:30 marks the exact midpoint of the record. Pure genius.",
                rating: 5.0,
                likesCount: 64,
                isLiked: true,
                commentsCount: 2,
                comments: [
                    Comment(userId: user.id, username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl, text: "White Ferrari into Seigfried is untouchable."),
                    Comment(userId: maya.id, username: maya.username, displayName: maya.displayName, avatarUrl: maya.avatarUrl, text: "Agreed 1000%! Essential listening.")
                ]
            ),
            Post(
                id: "post-2",
                user: maya,
                type: .listeningNow,
                track: spotify.mockTracks[4], // Snooze
                caption: "Late night vibes hit different with this on repeat. SZA's vocals on this bridge give me chills every single time.",
                likesCount: 38,
                isLiked: false,
                commentsCount: 0
            ),
            Post(
                id: "post-3",
                user: user,
                type: .tierList,
                caption: "Spent my Sunday organizing the essentials. In Rainbows in God Tier was non-negotiable.",
                tiers: [
                    TierItem(tier: "S", album: spotify.mockAlbums[4]),
                    TierItem(tier: "S", album: spotify.mockAlbums[1]),
                    TierItem(tier: "A", album: spotify.mockAlbums[0]),
                    TierItem(tier: "B", album: spotify.mockAlbums[5])
                ],
                rankingTitle: "Radiohead & Kendrick Discography",
                likesCount: 92,
                isLiked: false,
                commentsCount: 1,
                comments: [
                    Comment(userId: liam.id, username: liam.username, displayName: liam.displayName, avatarUrl: liam.avatarUrl, text: "Discovery should be S tier! That guitar solo in Digital Love is legendary.")
                ]
            ),
            Post(
                id: "post-4",
                user: liam,
                type: .songDrop,
                track: spotify.mockTracks[6], // Digital Love
                caption: "If you've never listened to this with good headphones, you're missing out on 4 layers of basslines.",
                likesCount: 45,
                isLiked: true,
                commentsCount: 0
            )
        ]
        
        // Initial Rankings
        self.rankings = [
            RankingList(
                id: "rank-1",
                userId: user.id,
                title: "All-Time Top 10 Albums",
                description: "The records that shaped my musical perspective.",
                isTierList: false,
                items: [
                    RankedItem(spotifyId: spotify.mockAlbums[0].id, title: spotify.mockAlbums[0].name, artist: "Frank Ocean", imageUrl: spotify.mockAlbums[0].imageUrl, rank: 1, score: 9.9, reviewNote: "Peak songwriting and atmosphere."),
                    RankedItem(spotifyId: spotify.mockAlbums[4].id, title: spotify.mockAlbums[4].name, artist: "Radiohead", imageUrl: spotify.mockAlbums[4].imageUrl, rank: 2, score: 9.8, reviewNote: "Warm, textured art rock."),
                    RankedItem(spotifyId: spotify.mockAlbums[1].id, title: spotify.mockAlbums[1].name, artist: "Kendrick Lamar", imageUrl: spotify.mockAlbums[1].imageUrl, rank: 3, score: 9.7, reviewNote: "Cultural milestone."),
                    RankedItem(spotifyId: spotify.mockAlbums[2].id, title: spotify.mockAlbums[2].name, artist: "Tyler, The Creator", imageUrl: spotify.mockAlbums[2].imageUrl, rank: 4, score: 9.4, reviewNote: "Production masterclass.")
                ]
            ),
            RankingList(
                id: "rank-2",
                userId: user.id,
                title: "2020s R&B / Neo-Soul Tier List",
                description: "Evaluating the modern soul landscape.",
                isTierList: true,
                items: [
                    RankedItem(spotifyId: spotify.mockAlbums[3].id, title: spotify.mockAlbums[3].name, artist: "SZA", imageUrl: spotify.mockAlbums[3].imageUrl, tier: "S", score: 9.5, reviewNote: "Genre-defining opus."),
                    RankedItem(spotifyId: spotify.mockTracks[4].id, title: spotify.mockTracks[4].name, artist: "SZA", imageUrl: spotify.mockTracks[4].album.imageUrl, tier: "S", score: 9.6, reviewNote: "Unbeatable melody."),
                    RankedItem(spotifyId: spotify.mockTracks[0].id, title: spotify.mockTracks[0].name, artist: "Frank Ocean", imageUrl: spotify.mockTracks[0].album.imageUrl, tier: "A", score: 9.2, reviewNote: "Transcendent ending.")
                ]
            )
        ]
    }
    
    // MARK: - Post Actions
    public func toggleLike(postId: String) {
        if let idx = posts.firstIndex(where: { $0.id == postId }) {
            posts[idx].isLiked.toggle()
            posts[idx].likesCount += posts[idx].isLiked ? 1 : -1
        }
    }
    
    public func addComment(postId: String, text: String) {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        if let idx = posts.firstIndex(where: { $0.id == postId }) {
            let comment = Comment(
                userId: currentUser.id,
                username: currentUser.username,
                displayName: currentUser.displayName,
                avatarUrl: currentUser.avatarUrl,
                text: text
            )
            posts[idx].comments.append(comment)
            posts[idx].commentsCount += 1
        }
    }
    
    public func createPost(type: PostType, track: SpotifyTrack? = nil, album: SpotifyAlbum? = nil, caption: String, rating: Double? = nil) {
        let newPost = Post(
            user: currentUser,
            type: type,
            track: track,
            album: album,
            caption: caption,
            rating: rating
        )
        posts.insert(newPost, at: 0)
    }
    
    // MARK: - Social Graph
    public func toggleFollow(friendId: String) {
        if let idx = friends.firstIndex(where: { $0.id == friendId }) {
            friends[idx].isFollowing.toggle()
            friends[idx].followerCount += friends[idx].isFollowing ? 1 : -1
        }
    }
    
    // MARK: - Quick Rank While Listening
    public func rankCurrentTrack(track: SpotifyTrack, score: Double, tier: String, note: String) {
        let ranked = RankedItem(
            spotifyId: track.id,
            title: track.name,
            artist: track.artistNames,
            imageUrl: track.album.imageUrl,
            previewUrl: track.previewUrl,
            rank: (rankings.first?.items.count ?? 0) + 1,
            tier: tier,
            score: score,
            reviewNote: note
        )
        
        if !rankings.isEmpty {
            rankings[0].items.append(ranked)
        }
        
        // Auto share to feed
        createPost(
            type: .songDrop,
            track: track,
            caption: note.isEmpty ? "Rated \(String(format: "%.1f", score))/10 on Spotted!" : "Rated \(String(format: "%.1f", score))/10: \"\(note)\"",
            rating: score / 2.0
        )
    }
    
    public func updateFavoriteAlbum(at index: Int, album: SpotifyAlbum) {
        if index < currentUser.favoriteAlbums.count {
            currentUser.favoriteAlbums[index] = album
        } else {
            currentUser.favoriteAlbums.append(album)
        }
    }
    
    public func updateFavoriteTrack(at index: Int, track: SpotifyTrack) {
        if index < currentUser.favoriteTracks.count {
            currentUser.favoriteTracks[index] = track
        } else {
            currentUser.favoriteTracks.append(track)
        }
    }
}
