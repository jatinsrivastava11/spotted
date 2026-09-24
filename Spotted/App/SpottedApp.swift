import SwiftUI

@main
struct SpottedApp: App {
    init() {
        // Force dark mode aesthetic
        UIView.appearance().overrideUserInterfaceStyle = .dark
    }
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .preferredColorScheme(.dark)
                .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
        }
    }
}
