import Foundation
import AVFoundation

@MainActor
public final class AudioPlayerService: ObservableObject {
    public static let shared = AudioPlayerService()
    
    @Published public var currentTrack: SpotifyTrack?
    @Published public var isPlaying: Bool = false
    @Published public var progress: Double = 0.0 // 0.0 to 1.0
    @Published public var currentTime: Double = 0.0
    @Published public var duration: Double = 30.0
    
    private var player: AVPlayer?
    private var timeObserver: Any?
    
    private init() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
    }
    
    public func play(track: SpotifyTrack) {
        if currentTrack?.id == track.id, let player = player {
            if isPlaying {
                pause()
            } else {
                player.play()
                isPlaying = true
            }
            return
        }
        
        currentTrack = track
        progress = 0
        currentTime = 0
        
        guard let urlString = track.previewUrl, let url = URL(string: urlString) else {
            isPlaying = false
            return
        }
        
        if let observer = timeObserver {
            player?.removeTimeObserver(observer)
            timeObserver = nil
        }
        
        let playerItem = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: playerItem)
        player?.play()
        isPlaying = true
        
        // Track time updates
        let interval = CMTime(seconds: 0.1, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        timeObserver = player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }
            let current = time.seconds
            self.currentTime = current
            self.progress = min(1.0, current / self.duration)
            
            if current >= self.duration {
                self.pause()
                self.progress = 0
                self.currentTime = 0
            }
        }
    }
    
    public func pause() {
        player?.pause()
        isPlaying = false
    }
    
    public func togglePlay() {
        if let current = currentTrack {
            play(track: current)
        }
    }
}
