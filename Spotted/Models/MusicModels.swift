import Foundation

// MARK: - Spotify Core Models

public struct SpotifyArtist: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let imageUrl: String?
    public let genres: [String]?
    
    public init(id: String, name: String, imageUrl: String? = nil, genres: [String]? = nil) {
        self.id = id
        self.name = name
        self.imageUrl = imageUrl
        self.genres = genres
    }
}

public struct SpotifyAlbum: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let artists: [SpotifyArtist]
    public let imageUrl: String
    public let releaseDate: String?
    public let totalTracks: Int?
    public let spotifyUrl: String?
    
    public init(id: String, name: String, artists: [SpotifyArtist], imageUrl: String, releaseDate: String? = nil, totalTracks: Int? = nil, spotifyUrl: String? = nil) {
        self.id = id
        self.name = name
        self.artists = artists
        self.imageUrl = imageUrl
        self.releaseDate = releaseDate
        self.totalTracks = totalTracks
        self.spotifyUrl = spotifyUrl
    }
    
    public var artistNames: String {
        artists.map(\.name).joined(separator: ", ")
    }
}

public struct SpotifyTrack: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let artists: [SpotifyArtist]
    public let album: SpotifyAlbum
    public let durationMs: Int
    public let previewUrl: String?
    public let spotifyUrl: String?
    public let popularity: Int?
    
    public init(id: String, name: String, artists: [SpotifyArtist], album: SpotifyAlbum, durationMs: Int, previewUrl: String? = nil, spotifyUrl: String? = nil, popularity: Int? = nil) {
        self.id = id
        self.name = name
        self.artists = artists
        self.album = album
        self.durationMs = durationMs
        self.previewUrl = previewUrl
        self.spotifyUrl = spotifyUrl
        self.popularity = popularity
    }
    
    public var artistNames: String {
        artists.map(\.name).joined(separator: ", ")
    }
    
    public var formattedDuration: String {
        let minutes = durationMs / 60000
        let seconds = (durationMs % 60000) / 1000
        return String(format: "%d:%02d", minutes, seconds)
    }
}

// MARK: - User & Social Models

public struct UserProfile: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public var username: String
    public var displayName: String
    public var avatarUrl: String
    public var bio: String
    public var followerCount: Int
    public var followingCount: Int
    public var isFollowing: Bool
    public var spotifyConnected: Bool
    public var topGenres: [String]
    public var favoriteTracks: [SpotifyTrack]
    public var favoriteAlbums: [SpotifyAlbum]
    
    public init(id: String, username: String, displayName: String, avatarUrl: String, bio: String, followerCount: Int, followingCount: Int, isFollowing: Bool = false, spotifyConnected: Bool = true, topGenres: [String], favoriteTracks: [SpotifyTrack] = [], favoriteAlbums: [SpotifyAlbum] = []) {
        self.id = id
        self.username = username
        self.displayName = displayName
        self.avatarUrl = avatarUrl
        self.bio = bio
        self.followerCount = followerCount
        self.followingCount = followingCount
        self.isFollowing = isFollowing
        self.spotifyConnected = spotifyConnected
        self.topGenres = topGenres
        self.favoriteTracks = favoriteTracks
        self.favoriteAlbums = favoriteAlbums
    }
}

// MARK: - Posts & Reviews

public enum PostType: String, Codable, CaseIterable, Sendable {
    case songDrop = "SONG_DROP"
    case albumReview = "ALBUM_REVIEW"
    case tierList = "TIER_LIST"
    case listeningNow = "LISTENING_NOW"
    
    public var title: String {
        switch self {
        case .songDrop: return "Song Drop"
        case .albumReview: return "Album Review"
        case .tierList: return "Tier List"
        case .listeningNow: return "Listening Now"
        }
    }
}

public struct Comment: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let userId: String
    public let username: String
    public let displayName: String
    public let avatarUrl: String
    public let text: String
    public let createdAt: Date
    
    public init(id: String = UUID().uuidString, userId: String, username: String, displayName: String, avatarUrl: String, text: String, createdAt: Date = Date()) {
        self.id = id
        self.userId = userId
        self.username = username
        self.displayName = displayName
        self.avatarUrl = avatarUrl
        self.text = text
        self.createdAt = createdAt
    }
}

public struct TierItem: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let tier: String // "S", "A", "B", "C", "D"
    public let track: SpotifyTrack?
    public let album: SpotifyAlbum?
    
    public init(id: String = UUID().uuidString, tier: String, track: SpotifyTrack? = nil, album: SpotifyAlbum? = nil) {
        self.id = id
        self.tier = tier
        self.track = track
        self.album = album
    }
}

public struct Post: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let user: UserProfile
    public let type: PostType
    public let track: SpotifyTrack?
    public let album: SpotifyAlbum?
    public var caption: String
    public var rating: Double? // 0.5 to 5.0
    public var tiers: [TierItem]?
    public var rankingTitle: String?
    public var likesCount: Int
    public var isLiked: Bool
    public var commentsCount: Int
    public var comments: [Comment]
    public let createdAt: Date
    
    public init(id: String = UUID().uuidString, user: UserProfile, type: PostType, track: SpotifyTrack? = nil, album: SpotifyAlbum? = nil, caption: String, rating: Double? = nil, tiers: [TierItem]? = nil, rankingTitle: String? = nil, likesCount: Int = 0, isLiked: Bool = false, commentsCount: Int = 0, comments: [Comment] = [], createdAt: Date = Date()) {
        self.id = id
        self.user = user
        self.type = type
        self.track = track
        self.album = album
        self.caption = caption
        self.rating = rating
        self.tiers = tiers
        self.rankingTitle = rankingTitle
        self.likesCount = likesCount
        self.isLiked = isLiked
        self.commentsCount = commentsCount
        self.comments = comments
        self.createdAt = createdAt
    }
}

// MARK: - Rankings & Tier Lists

public struct RankedItem: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let spotifyId: String
    public let title: String
    public let artist: String
    public let imageUrl: String
    public let previewUrl: String?
    public var rank: Int?
    public var tier: String? // "S", "A", "B", "C", "D"
    public var score: Double? // 1.0 - 10.0
    public var reviewNote: String?
    
    public init(id: String = UUID().uuidString, spotifyId: String, title: String, artist: String, imageUrl: String, previewUrl: String? = nil, rank: Int? = nil, tier: String? = nil, score: Double? = nil, reviewNote: String? = nil) {
        self.id = id
        self.spotifyId = spotifyId
        self.title = title
        self.artist = artist
        self.imageUrl = imageUrl
        self.previewUrl = previewUrl
        self.rank = rank
        self.tier = tier
        self.score = score
        self.reviewNote = reviewNote
    }
}

public struct RankingList: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let userId: String
    public var title: String
    public var description: String
    public var isTierList: Bool
    public var items: [RankedItem]
    public let createdAt: Date
    
    public init(id: String = UUID().uuidString, userId: String, title: String, description: String, isTierList: Bool, items: [RankedItem], createdAt: Date = Date()) {
        self.id = id
        self.userId = userId
        self.title = title
        self.description = description
        self.isTierList = isTierList
        self.items = items
        self.createdAt = createdAt
    }
}
