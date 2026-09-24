import SwiftUI

public struct CreatePostSheet: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var socialStore = SocialStore.shared
    @ObservedObject var spotify = SpotifyService.shared
    
    @State private var postType: PostType = .songDrop
    @State private var searchQuery = ""
    @State private var selectedTrack: SpotifyTrack?
    @State private var selectedAlbum: SpotifyAlbum?
    @State private var caption = ""
    @State private var rating: Double = 4.5
    
    public init() {}
    
    private var searchResults: (tracks: [SpotifyTrack], albums: [SpotifyAlbum]) {
        spotify.search(query: searchQuery)
    }
    
    public var body: some View {
        NavigationStack {
            Form {
                // Post Type
                Section {
                    Picker("Post Type", selection: $postType) {
                        ForEach(PostType.allCases, id: \.self) { type in
                            if type != .tierList {
                                Text(type.title).tag(type)
                            }
                        }
                    }
                    .pickerStyle(.segmented)
                    .listRowBackground(Color.clear)
                }
                
                // Spotify Selection
                Section("Select Music from Spotify") {
                    if let track = selectedTrack {
                        HStack(spacing: 12) {
                            AsyncImage(url: URL(string: track.album.imageUrl)) { phase in
                                switch phase {
                                case .success(let img): img.resizable().scaledToFill()
                                default: Color.zinc800
                                }
                            }
                            .frame(width: 44, height: 44)
                            .cornerRadius(8)
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(track.name).font(.system(size: 14, weight: .bold)).foregroundColor(.white)
                                Text(track.artistNames).font(.system(size: 12)).foregroundColor(.white.opacity(0.6))
                            }
                            
                            Spacer()
                            
                            Button("Change") {
                                selectedTrack = nil
                            }
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.spotifyGreen)
                        }
                    } else if let album = selectedAlbum {
                        HStack(spacing: 12) {
                            AsyncImage(url: URL(string: album.imageUrl)) { phase in
                                switch phase {
                                case .success(let img): img.resizable().scaledToFill()
                                default: Color.zinc800
                                }
                            }
                            .frame(width: 44, height: 44)
                            .cornerRadius(8)
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text(album.name).font(.system(size: 14, weight: .bold)).foregroundColor(.white)
                                Text(album.artistNames).font(.system(size: 12)).foregroundColor(.white.opacity(0.6))
                            }
                            
                            Spacer()
                            
                            Button("Change") {
                                selectedAlbum = nil
                            }
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.spotifyGreen)
                        }
                    } else {
                        TextField("Search track or album...", text: $searchQuery)
                            .foregroundColor(.white)
                        
                        if !searchQuery.isEmpty {
                            if postType == .albumReview {
                                ForEach(searchResults.albums) { album in
                                    Button(action: {
                                        selectedAlbum = album
                                        searchQuery = ""
                                    }) {
                                        HStack(spacing: 10) {
                                            AsyncImage(url: URL(string: album.imageUrl)) { phase in
                                                switch phase {
                                                case .success(let img): img.resizable().scaledToFill()
                                                default: Color.zinc800
                                                }
                                            }
                                            .frame(width: 36, height: 36)
                                            .cornerRadius(6)
                                            
                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(album.name).font(.system(size: 13, weight: .bold)).foregroundColor(.white)
                                                Text(album.artistNames).font(.system(size: 11)).foregroundColor(.white.opacity(0.5))
                                            }
                                        }
                                    }
                                }
                            } else {
                                ForEach(searchResults.tracks) { track in
                                    Button(action: {
                                        selectedTrack = track
                                        searchQuery = ""
                                    }) {
                                        HStack(spacing: 10) {
                                            AsyncImage(url: URL(string: track.album.imageUrl)) { phase in
                                                switch phase {
                                                case .success(let img): img.resizable().scaledToFill()
                                                default: Color.zinc800
                                                }
                                            }
                                            .frame(width: 36, height: 36)
                                            .cornerRadius(6)
                                            
                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(track.name).font(.system(size: 13, weight: .bold)).foregroundColor(.white)
                                                Text(track.artistNames).font(.system(size: 11)).foregroundColor(.white.opacity(0.5))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .listRowBackground(Color(red: 24/255, green: 24/255, blue: 28/255))
                
                // Rating for reviews
                if postType == .albumReview {
                    Section("Rating") {
                        HStack {
                            Text(String(format: "%.1f Stars", rating))
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.yellow)
                            
                            Spacer()
                            
                            HStack(spacing: 4) {
                                ForEach(1...5, id: \.self) { star in
                                    Image(systemName: Double(star) <= rating ? "star.fill" : "star")
                                        .foregroundColor(.yellow)
                                        .onTapGesture {
                                            rating = Double(star)
                                        }
                                }
                            }
                        }
                    }
                    .listRowBackground(Color(red: 24/255, green: 24/255, blue: 28/255))
                }
                
                // Caption
                Section("Thoughts / Review") {
                    TextEditor(text: $caption)
                        .frame(minHeight: 100)
                        .foregroundColor(.white)
                }
                .listRowBackground(Color(red: 24/255, green: 24/255, blue: 28/255))
            }
            .scrollContentBackground(.hidden)
            .background(Color(red: 12/255, green: 12/255, blue: 16/255).ignoresSafeArea())
            .navigationTitle("Create Post")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundColor(.white.opacity(0.6))
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Share") {
                        socialStore.createPost(
                            type: postType,
                            track: selectedTrack,
                            album: selectedAlbum,
                            caption: caption,
                            rating: postType == .albumReview ? rating : nil
                        )
                        dismiss()
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.spotifyGreen)
                    .disabled(caption.isEmpty && selectedTrack == nil && selectedAlbum == nil)
                }
            }
        }
    }
}
