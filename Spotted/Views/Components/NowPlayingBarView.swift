import SwiftUI

public struct NowPlayingBarView: View {
    @ObservedObject var audioService = AudioPlayerService.shared
    @State private var rotationDegrees: Double = 0
    
    public init() {}
    
    public var body: some View {
        if let track = audioService.currentTrack {
            VStack(spacing: 0) {
                // Mini Progress Bar
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Rectangle()
                            .fill(Color(white: 0.2))
                            .frame(height: 2)
                        
                        Rectangle()
                            .fill(Color(red: 30/255, green: 215/255, blue: 96/255))
                            .frame(width: geo.size.width * CGFloat(audioService.progress), height: 2)
                    }
                }
                .frame(height: 2)
                
                HStack(spacing: 12) {
                    // Rotating Vinyl Disc Artwork
                    ZStack {
                        // Vinyl disc
                        Circle()
                            .fill(Color.black)
                            .frame(width: 44, height: 44)
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.15), lineWidth: 1)
                            )
                        
                        // Center label
                        AsyncImage(url: URL(string: track.album.imageUrl)) { phase in
                            switch phase {
                            case .success(let image):
                                image.resizable()
                                    .scaledToFill()
                                    .clipShape(Circle())
                            default:
                                Circle().fill(Color.zinc800)
                            }
                        }
                        .frame(width: 40, height: 40)
                        
                        // Center hole
                        Circle()
                            .fill(Color(red: 30/255, green: 215/255, blue: 96/255))
                            .frame(width: 6, height: 6)
                    }
                    .rotationEffect(.degrees(rotationDegrees))
                    .onAppear {
                        if audioService.isPlaying {
                            startSpinning()
                        }
                    }
                    .onChange(of: audioService.isPlaying) { _, isPlaying in
                        if isPlaying {
                            startSpinning()
                        }
                    }
                    
                    // Track details
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 6) {
                            Text(track.name)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                            
                            Text("PREVIEW")
                                .font(.system(size: 9, weight: .bold))
                                .padding(.horizontal, 4)
                                .padding(.vertical, 1)
                                .background(Color.white.opacity(0.15))
                                .foregroundColor(.white.opacity(0.8))
                                .cornerRadius(3)
                        }
                        
                        Text(track.artistNames)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.6))
                            .lineLimit(1)
                    }
                    
                    Spacer()
                    
                    // Play/Pause Action
                    Button(action: {
                        audioService.togglePlay()
                    }) {
                        Image(systemName: audioService.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.black)
                            .frame(width: 36, height: 36)
                            .background(Color.white)
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(red: 18/255, green: 18/255, blue: 22/255).opacity(0.95))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                        .shadow(color: Color.black.opacity(0.4), radius: 10, y: 5)
                )
                .padding(.horizontal, 12)
            }
        }
    }
    
    private func startSpinning() {
        withAnimation(.linear(duration: 10).repeatForever(autoreverses: false)) {
            rotationDegrees += 360
        }
    }
}

extension Color {
    static let zinc800 = Color(red: 39/255, green: 39/255, blue: 42/255)
    static let spotifyGreen = Color(red: 30/255, green: 215/255, blue: 96/255)
}
