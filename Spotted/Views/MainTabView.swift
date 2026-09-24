import SwiftUI

public struct MainTabView: View {
    @State private var selectedTab = 0
    @ObservedObject var audioService = AudioPlayerService.shared
    
    public init() {}
    
    public var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $selectedTab) {
                FeedView()
                    .tabItem {
                        Label("Feed", systemImage: "flame.fill")
                    }
                    .tag(0)
                
                ExploreFriendsView()
                    .tabItem {
                        Label("Explore", systemImage: "person.2.fill")
                    }
                    .tag(1)
                
                SpotifyStatsView()
                    .tabItem {
                        Label("Stats", systemImage: "chart.bar.fill")
                    }
                    .tag(2)
                
                RankingsHubView()
                    .tabItem {
                        Label("Rankings", systemImage: "slider.horizontal.3")
                    }
                    .tag(3)
                
                ProfileView()
                    .tabItem {
                        Label("Profile", systemImage: "person.crop.circle.fill")
                    }
                    .tag(4)
            }
            .tint(.spotifyGreen)
            
            // Persistent Audio Mini-Player Bar
            if audioService.currentTrack != nil {
                NowPlayingBarView()
                    .padding(.bottom, 54) // Positioned nicely right above the native tab bar
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
    }
}
