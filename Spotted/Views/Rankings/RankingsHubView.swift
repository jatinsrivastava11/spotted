import SwiftUI

public struct RankingsHubView: View {
    @ObservedObject var socialStore = SocialStore.shared
    @State private var selectedListId: String = ""
    @State private var showRankWhileListening = false
    
    public init() {}
    
    private var currentList: RankingList? {
        if let found = socialStore.rankings.first(where: { $0.id == selectedListId }) {
            return found
        }
        return socialStore.rankings.first
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 20) {
                    // Header & Rank While Listening Shortcut
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                HStack(spacing: 6) {
                                    Image(systemName: "slider.horizontal.3")
                                        .foregroundColor(.spotifyGreen)
                                    Text("Music Rankings & Tiers")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(.white)
                                }
                                Text("Tier matrices, discography ranks, and live song ratings.")
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                            }
                            Spacer()
                        }
                        
                        Button(action: { showRankWhileListening = true }) {
                            HStack {
                                Image(systemName: "headphones")
                                Text("Rank Song While Listening")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.spotifyGreen)
                            .cornerRadius(12)
                        }
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
                    
                    // List selector chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(socialStore.rankings) { list in
                                let isSelected = (currentList?.id == list.id)
                                Button(action: { selectedListId = list.id }) {
                                    HStack(spacing: 6) {
                                        Text(list.title)
                                            .font(.system(size: 12, weight: .bold))
                                        Text("(\(list.items.count))")
                                            .font(.system(size: 10))
                                            .foregroundColor(.white.opacity(0.5))
                                    }
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(isSelected ? Color.white.opacity(0.15) : Color(red: 22/255, green: 22/255, blue: 26/255))
                                    .foregroundColor(isSelected ? .white : .white.opacity(0.6))
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(isSelected ? Color.spotifyGreen.opacity(0.4) : Color.white.opacity(0.06), lineWidth: 1)
                                    )
                                }
                            }
                        }
                    }
                    
                    // List Content
                    if let list = currentList {
                        if list.isTierList {
                            tierListMatrixView(list: list)
                        } else {
                            numberedRankingView(list: list)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 80)
            }
            .background(Color(red: 9/255, green: 9/255, blue: 11/255).ignoresSafeArea())
            .navigationTitle("Rankings")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showRankWhileListening) {
                RankWhileListeningSheet()
            }
        }
    }
    
    private func tierListMatrixView(list: RankingList) -> some View {
        VStack(spacing: 12) {
            ForEach(["S", "A", "B", "C", "D"], id: \.self) { tierKey in
                let items = list.items.filter { $0.tier == tierKey }
                
                HStack(spacing: 12) {
                    Text(tierKey)
                        .font(.system(size: 20, weight: .black))
                        .frame(width: 44, height: 50)
                        .background(tierColor(for: tierKey).opacity(0.2))
                        .foregroundColor(tierColor(for: tierKey))
                        .cornerRadius(10)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(tierColor(for: tierKey).opacity(0.4), lineWidth: 1)
                        )
                    
                    if items.isEmpty {
                        Text("No entries in \(tierKey) Tier")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.3))
                            .italic()
                        Spacer()
                    } else {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(items) { item in
                                    VStack(alignment: .leading, spacing: 3) {
                                        AsyncImage(url: URL(string: item.imageUrl)) { phase in
                                            switch phase {
                                            case .success(let img): img.resizable().scaledToFill()
                                            default: Color.zinc800
                                            }
                                        }
                                        .frame(width: 50, height: 50)
                                        .cornerRadius(8)
                                        
                                        Text(item.title)
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                            .lineLimit(1)
                                            .frame(width: 50)
                                    }
                                }
                            }
                        }
                    }
                }
                .padding(10)
                .background(Color(red: 18/255, green: 18/255, blue: 22/255))
                .cornerRadius(14)
            }
        }
    }
    
    private func numberedRankingView(list: RankingList) -> some View {
        VStack(spacing: 8) {
            ForEach(Array(list.items.enumerated()), id: \.element.id) { index, item in
                HStack(spacing: 12) {
                    Text("#\(index + 1)")
                        .font(.system(size: 14, weight: .bold, design: .monospaced))
                        .foregroundColor(.spotifyGreen)
                        .frame(width: 28)
                    
                    AsyncImage(url: URL(string: item.imageUrl)) { phase in
                        switch phase {
                        case .success(let img): img.resizable().scaledToFill()
                        default: Color.zinc800
                        }
                    }
                    .frame(width: 44, height: 44)
                    .cornerRadius(8)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 6) {
                            Text(item.title)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                            
                            if let score = item.score {
                                Text(String(format: "%.1f", score))
                                    .font(.system(size: 10, weight: .black, design: .monospaced))
                                    .padding(.horizontal, 4)
                                    .padding(.vertical, 1)
                                    .background(Color.yellow.opacity(0.15))
                                    .foregroundColor(.yellow)
                                    .cornerRadius(4)
                            }
                        }
                        
                        Text(item.artist)
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.5))
                            .lineLimit(1)
                        
                        if let note = item.reviewNote, !note.isEmpty {
                            Text("\"\(note)\"")
                                .font(.system(size: 11))
                                .foregroundColor(.white.opacity(0.7))
                                .italic()
                                .lineLimit(1)
                        }
                    }
                    Spacer()
                }
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color(red: 18/255, green: 18/255, blue: 22/255))
                )
            }
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
