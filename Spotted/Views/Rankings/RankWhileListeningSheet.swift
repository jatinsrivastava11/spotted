import SwiftUI

public struct RankWhileListeningSheet: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var socialStore = SocialStore.shared
    @ObservedObject var audioService = AudioPlayerService.shared
    @ObservedObject var spotify = SpotifyService.shared
    
    @State private var score: Double = 9.4
    @State private var selectedTier: String = "S"
    @State private var reviewNote: String = ""
    
    public init() {}
    
    private var activeTrack: SpotifyTrack {
        audioService.currentTrack ?? spotify.mockTracks[0] // Nights
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Currently Playing Track Card
                    HStack(spacing: 14) {
                        AsyncImage(url: URL(string: activeTrack.album.imageUrl)) { phase in
                            switch phase {
                            case .success(let img): img.resizable().scaledToFill()
                            default: Color.zinc800
                            }
                        }
                        .frame(width: 60, height: 60)
                        .cornerRadius(10)
                        
                        VStack(alignment: .leading, spacing: 3) {
                            HStack(spacing: 6) {
                                Circle().fill(Color.spotifyGreen).frame(width: 6, height: 6)
                                Text("Live on Spotify")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.spotifyGreen)
                            }
                            
                            Text(activeTrack.name)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                            
                            Text(activeTrack.artistNames)
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.6))
                                .lineLimit(1)
                        }
                        
                        Spacer()
                    }
                    .padding(14)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color(red: 20/255, green: 20/255, blue: 26/255))
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
                            )
                    )
                    
                    // Rating Slider
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Text("Song Rating")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                            Spacer()
                            Text(String(format: "%.1f / 10.0", score))
                                .font(.system(size: 18, weight: .black, design: .monospaced))
                                .foregroundColor(.spotifyGreen)
                        }
                        
                        Slider(value: $score, in: 1.0...10.0, step: 0.1)
                            .tint(.spotifyGreen)
                            .onChange(of: score) { _, val in
                                if val >= 9.2 { selectedTier = "S" }
                                else if val >= 8.2 { selectedTier = "A" }
                                else if val >= 7.0 { selectedTier = "B" }
                                else if val >= 5.0 { selectedTier = "C" }
                                else { selectedTier = "D" }
                            }
                    }
                    .padding(16)
                    .background(Color(red: 20/255, green: 20/255, blue: 26/255))
                    .cornerRadius(16)
                    
                    // Tier Buttons
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Assign Tier Level")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        
                        HStack(spacing: 8) {
                            ForEach(["S", "A", "B", "C", "D"], id: \.self) { tierKey in
                                Button(action: { selectedTier = tierKey }) {
                                    VStack(spacing: 2) {
                                        Text(tierKey)
                                            .font(.system(size: 16, weight: .black))
                                        Text(tierSublabel(for: tierKey))
                                            .font(.system(size: 9))
                                            .opacity(0.8)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(selectedTier == tierKey ? tierColor(for: tierKey) : Color.white.opacity(0.05))
                                    .foregroundColor(selectedTier == tierKey ? .black : .white.opacity(0.7))
                                    .cornerRadius(12)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(selectedTier == tierKey ? Color.white : Color.clear, lineWidth: 1)
                                    )
                                }
                            }
                        }
                    }
                    .padding(16)
                    .background(Color(red: 20/255, green: 20/255, blue: 26/255))
                    .cornerRadius(16)
                    
                    // Note / Review
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Quick Observation / Thought")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        
                        TextField("e.g., That guitar bridge at 2:15 is legendary...", text: $reviewNote)
                            .padding(12)
                            .background(Color.zinc800)
                            .cornerRadius(12)
                            .foregroundColor(.white)
                    }
                    .padding(16)
                    .background(Color(red: 20/255, green: 20/255, blue: 26/255))
                    .cornerRadius(16)
                    
                    // Submit
                    Button(action: {
                        socialStore.rankCurrentTrack(
                            track: activeTrack,
                            score: score,
                            tier: selectedTier,
                            note: reviewNote
                        )
                        dismiss()
                    }) {
                        HStack {
                            Image(systemName: "sparkles")
                            Text("Save Rating & Share to Feed")
                        }
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.spotifyGreen)
                        .cornerRadius(16)
                    }
                }
                .padding()
            }
            .background(Color(red: 12/255, green: 12/255, blue: 16/255).ignoresSafeArea())
            .navigationTitle("Rank While Listening")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                        .foregroundColor(.white.opacity(0.6))
                }
            }
        }
    }
    
    private func tierSublabel(for tier: String) -> String {
        switch tier {
        case "S": return "God"
        case "A": return "Essential"
        case "B": return "Great"
        case "C": return "Decent"
        default: return "Skip"
        }
    }
    
    private func tierColor(for tier: String) -> Color {
        switch tier {
        case "S": return Color.red
        case "A": return Color.orange
        case "B": return Color.yellow
        case "C": return Color.blue
        default: return Color.gray
        }
    }
}
