# Spotted — Architecture & Codebase Guide

This document breaks down every file and code block in the **Spotted** iOS application, explaining how the code functions, how the components communicate, and how the overall architecture is structured.

---

## 1. High-Level Architecture (MVVM Pattern)

Spotted is built using the **Model-View-ViewModel (MVVM)** architectural pattern:

```
[ Spotify Web API / CDN ] 
            │
            ▼
     [ Services ]          <── AVPlayer (Audio) & Spotify Ingestion
            │
            ▼
    [ ViewModels ]         <── Single Source of Truth (SocialStore, AudioService)
            │
            ▼
        [ Views ]          <── Declarative SwiftUI screens & components
```

- **Models** (`Spotted/Models/`): Define the shapes of data (Tracks, Albums, Posts, Rankings).
- **Services** (`Spotted/Services/`): Handle external operations (fetching Spotify data, streaming audio via `AVPlayer`).
- **ViewModels / Stores** (`Spotted/ViewModels/`): Manage reactive application state and business logic (handling likes, comments, creating rankings).
- **Views** (`Spotted/Views/`): Pure SwiftUI views that render data from the stores and trigger actions.

---

## 2. File-by-File Breakdown

### `Spotted/App/SpottedApp.swift`
- **What it does**: The entry point of the iOS app marked with the `@main` attribute.
- **Key Code**:
  - Initializes `UIView.appearance().overrideUserInterfaceStyle = .dark` to ensure an obsidian dark aesthetic.
  - Mounts `MainTabView()` inside a `WindowGroup`.

---

### `Spotted/Models/MusicModels.swift`
- **What it does**: Contains all core data structures conforming to `Identifiable`, `Codable`, and `Hashable`.
- **Key Structs**:
  - `SpotifyTrack`: Holds track ID, title, artist list, album info, duration, and audio preview URL. Includes computed property `formattedDuration` (e.g. `4:12`).
  - `SpotifyAlbum`: Holds album title, cover artwork URL, total tracks, and release year.
  - `UserProfile`: Contains username, displayName, bio, follower count, top genres list, and curated favorite lists (`favoriteTracks`, `favoriteAlbums`).
  - `Post`: Represents a social feed item with `PostType` (`.songDrop`, `.albumReview`, `.tierList`, `.listeningNow`), caption, ratings (0.5 - 5.0), and comments.
  - `RankedItem` & `RankingList`: Models for tier lists (S/A/B/C/D) and numbered 1-to-N music rankings.

---

### `Spotted/Services/AudioPlayerService.swift`
- **What it does**: Controls audio streaming for 30-second previews using Apple's `AVFoundation`.
- **How it works**:
  - Sets the audio session to `.playback` so sound continues even when the device is on silent mode.
  - Maintains `currentTrack`, `isPlaying`, `progress` (0.0 to 1.0), and `currentTime`.
  - Uses `addPeriodicTimeObserver` on `AVPlayer` to update the scrub bar every 0.1 seconds.
  - When the audio completes or `pause()` is called, state updates and the rotating vinyl disk stops spinning.

---

### `Spotted/Services/SpotifyService.swift`
- **What it does**: The data provider for Spotify information.
- **How it works**:
  - Provides sample and live Spotify data for testing out of the box (Blonde, To Pimp A Butterfly, IGOR, SOS, etc.).
  - `getTopTracks(for: timeframe)`: Delivers different track sets depending on whether the user selects "4_weeks", "6_months", or "all_time".
  - `search(query:)`: Performs case-insensitive matching across track names, artist names, and album titles to power the review creation autocomplete.

---

### `Spotted/ViewModels/SocialStore.swift`
- **What it does**: The central state engine for social actions, user data, posts, and rankings.
- **How it works**:
  - Marked with `@MainActor` to guarantee UI updates remain thread-safe.
  - `toggleLike(postId:)`: Optimistically flips `isLiked` and increments/decrements `likesCount`.
  - `addComment(postId:text:)`: Appends a new `Comment` struct to the post's comment array.
  - `rankCurrentTrack(track:score:tier:note:)`:
    1. Adds the track into the user's active `RankingList`.
    2. Automatically creates and drops a new `Post` onto the social feed so friends can immediately see the score.
  - `toggleFollow(friendId:)`: Updates following state and increments friend follower numbers.

---

### `Spotted/Views/MainTabView.swift`
- **What it does**: The root navigation coordinator.
- **How it works**:
  - Uses SwiftUI `TabView` to switch between the 5 tabs: **Feed**, **Explore**, **Stats**, **Rankings**, and **Profile**.
  - **Persistent Audio Mini-Player**: Uses an overlay ZStack to float `NowPlayingBarView` at the bottom right above the tab bar whenever `audioService.currentTrack != nil`.

---

### `Spotted/Views/Components/NowPlayingBarView.swift`
- **What it does**: The floating audio preview pill at the bottom of the screen.
- **Key Visual Elements**:
  - **Mini Waveform/Progress Bar**: Visualizes track progress using a `GeometryReader` bar.
  - **Rotating Vinyl Record**: Renders a dark vinyl disk with a centered album cover and green spindle hole. When `audioService.isPlaying == true`, a continuous `rotationEffect` animation spins the record smoothly.
  - **Play/Pause Toggle Button**: Inverts state on `AudioPlayerService.shared`.

---

### `Spotted/Views/Feed/FeedView.swift` & `PostCardView.swift`
- **What it does**: The Instagram/Letterboxd-style social feed.
- **Key Features**:
  - **Filter Chips**: Allows filtering between "All Activity", "Album Reviews", "Song Drops", and "Tier Lists".
  - **Vinyl Slide-Out Animation**: In `PostCardView.swift`, when a track starts playing, the vinyl disk offsets outward by 18 points to simulate sliding out of its sleeve.
  - **Star Rating Badges**: Formats review scores into filled/unfilled yellow stars.
  - **Comments Sheet**: Taps on the bubble icon open a native modal sheet displaying comment threads with user avatars and a comment submission field.

---

### `Spotted/Views/Feed/CreatePostSheet.swift`
- **What it does**: The review and song drop composer.
- **How it works**:
  - Segmented picker toggles between **Song Drop** and **Album Review**.
  - As the user types into the search box, `spotify.search(query:)` updates matching songs/albums with thumbnails.
  - For album reviews, a star rating selector allows scoring from 1 to 5 stars.
  - Tapping "Share" calls `socialStore.createPost()` and dismisses the sheet.

---

### `Spotted/Views/MusicStats/SpotifyStatsView.swift` & `CuratedFavoritesView.swift`
- **What it does**: Displays the user's Spotify listening stats and curated favorites.
- **How it works**:
  - `CuratedFavoritesView`: A 4-column `LazyVGrid` displaying the user's **Top 4 Favorite Albums** and **Top 4 Favorite Songs** (Letterboxd centerpiece).
  - Timeframe selector buttons switch between **4 Weeks**, **6 Months**, and **All Time**, recalculating the top tracks and albums automatically.

---

### `Spotted/Views/Rankings/RankingsHubView.swift` & `RankWhileListeningSheet.swift`
- **What it does**: Powers the custom tier lists and live rating while listening.
- **How it works**:
  - `RankingsHubView`: Renders S/A/B/C/D tiers with color coding (S = Red, A = Orange, B = Yellow, C = Blue, D = Gray).
  - `RankWhileListeningSheet`: Pulls the track currently streaming. A continuous `Slider` lets the user rate the song from `1.0` to `10.0`. It automatically predicts the tier (e.g. `9.2+` = S Tier, `8.2+` = A Tier) while allowing manual overrides.

---

### `Spotted/Views/Explore/ExploreFriendsView.swift`
- **What it does**: Friend discovery and musical compatibility analysis.
- **How it works**:
  - `compatibilityInfo(for:)`: Calculates music overlap percentage and gives a textual reason (e.g., *"94% Match — Shared top artists: Frank Ocean & Kendrick Lamar"*).
  - Visualizes compatibility with a purple-to-green gradient progress bar.
  - Includes a direct audio preview button on the friend's most-played song.

---

### `Spotted/Views/Profile/ProfileView.swift`
- **What it does**: Personal user profile.
- **Key Features**:
  - Verified Spotify badge checkmark.
  - Follower and review counters.
  - Scrollable genre pill list (e.g., *"Neo-Soul"*, *"Conscious Hip-Hop"*).
  - Embeds `CuratedFavoritesView` and lists all reviews authored by this user.
