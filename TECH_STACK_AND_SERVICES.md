# Spotted — Complete Technology Stack & Services Catalog

This document provides a comprehensive, non-concise breakdown of every tool, library, API, framework, audio system, and architectural layer used to build **Spotted**.

---

## 1. Native iOS Architecture (Xcode & Swift)

### Language & Runtime
- **Swift 6.3**: The latest iteration of Apple's safe, fast, and modern programming language.
  - Features used: Strict concurrency checking, `async`/`await`, structured concurrency, value types (`struct`), protocol-oriented programming (`Identifiable`, `Codable`, `Hashable`, `Sendable`).
- **Target OS**: iOS 17.0+ (compatible with iOS 17, iOS 18, and future versions).
- **Target Devices**: iPhone & iPad (`TARGETED_DEVICE_FAMILY = "1,2"`).

### User Interface Framework
- **SwiftUI**: Apple's modern declarative UI framework.
  - **Dynamic Stacks**: `VStack`, `HStack`, `ZStack` with precise alignment and spacing.
  - **Lazy Collections**: `LazyVStack` and `LazyVGrid` for performant, memory-efficient scrolling through large feeds.
  - **Sheets & Navigation**: `NavigationStack`, `.sheet(isPresented:)` for comment drawers, creation modals, and tier sliders.
  - **Animations**: Fluid spring animations (`.spring(response:dampingFraction:)`) for like buttons and vinyl disk reveals; linear looping rotations for vinyl record playback.

### Audio & Media Framework
- **AVFoundation**:
  - `AVPlayer`: Streams remote audio files directly from CDNs over HTTP/HTTPS.
  - `AVPlayerItem`: Manages individual audio stream lifecycle, buffering states, and error handling.
  - `AVAudioSession`: Configures system-level audio categories (`.playback`), ensuring audio can play smoothly and respect device mute switches.
  - Periodic Time Observers (`CMTime`): Polls playback progress at 10Hz (every 0.1s) to drive continuous waveform and slider updates.

### Reactive State Management
- **Combine & Observable State**:
  - `@MainActor`: Guarantees all UI-driving state updates happen on the main dispatch thread to eliminate UI glitches.
  - `ObservableObject` & `@Published`: Implements reactive single-source-of-truth patterns (`SocialStore`, `AudioPlayerService`, `SpotifyService`).
  - `@State` & `@ObservedObject`: Local view state vs. global injected shared store.

---

## 2. API & External Services Layer

### Spotify Web API
Spotted is architected to interface with Spotify's REST endpoints:
1. **User's Top Tracks (`GET https://api.spotify.com/v1/me/top/tracks`)**:
   - Query Parameters: `time_range` (`short_term` = ~4 weeks, `medium_term` = ~6 months, `long_term` = several years) and `limit` (up to 50).
   - Ingestion: Extracts track titles, artists, album artwork URLs, duration, preview audio URLs, and Spotify URI links.
2. **Currently Playing Track (`GET https://api.spotify.com/v1/me/player/currently-playing`)**:
   - Detects the live track playing on the user's active Spotify device in real time, driving the live pulse indicator and the "Rank While Listening" drawer.
3. **Music Search Autocomplete (`GET https://api.spotify.com/v1/search`)**:
   - Query Parameters: `q={query}&type=track,album&limit=10`.
   - Used by the Review Composer and Rankings Editor to search any artist, song, or album in Spotify's entire catalog.

### Authentication & Authorization (OAuth 2.0 PKCE)
- **Spotify OAuth 2.0 with PKCE (Proof Key for Code Exchange)**:
  - Designed specifically for native mobile applications without requiring a client secret to be bundled in the app binary.
  - Requested Scopes:
    - `user-read-currently-playing`
    - `user-read-playback-state`
    - `user-top-read`
    - `user-read-recently-played`
  - Custom URL Scheme: `spotted://callback` to return authentication codes from Safari back to the native app.

### Audio Preview Delivery
- **CDN Preview Streaming**:
  - Spotify provides 30-second high-fidelity MP3/OGG preview streams for millions of tracks.
  - Spotted's audio engine streams these directly with fallback audio buffers so previews never stall.

---

## 3. Data & Storage Architecture

### Current Layer: In-Memory Reactive Store
- Located in `Spotted/ViewModels/SocialStore.swift`.
- Stores users, posts, ratings, comments, and rankings as in-memory Swift data structures.
- **Advantage**: Zero configuration required to open and test immediately in Xcode. Instant responsiveness with no database network latency during local development.

### Production Layer: Relational Schema (PostgreSQL / Supabase)
- The relational model is fully mapped out for multi-user cloud deployment:
  - `users`: ID, Spotify ID, username, displayName, avatarUrl, bio.
  - `posts`: ID, author_id, type (review/drop/tier), track_id, album_id, caption, rating, timestamps.
  - `comments`: ID, post_id, author_id, text, timestamp.
  - `follows`: follower_id, following_id (social graph).
  - `rankings`: list_id, user_id, title, is_tier_list.
  - `ranked_items`: item_id, list_id, spotify_id, rank, tier, score (1-10), personal notes.

---

## 4. Build System & Xcode Configuration

- **Xcode Project (`Spotted.xcodeproj`)**:
  - Generated using programmatic PBXProject generation (`generate_xcodeproj.py`).
  - Build System: Modern Xcode Build System with automatic Info.plist generation (`GENERATE_INFOPLIST_FILE = YES`).
  - Compiler: Apple Clang & Swift Compiler (version 6.3+).
  - Code Signing: Set to Automatic (`CODE_SIGN_STYLE = Automatic`), allowing anyone with a free Apple ID to deploy to their personal iPhone without a paid developer membership.

---

## 5. Web Companion Stack (Also in Repo)

In addition to the native iOS app, the repository includes a complete full-stack web companion:
- **Framework**: Next.js 16 (App Router, Turbopack, React 19).
- **Styling**: Tailwind CSS v4 with custom dark mode obsidian theme and keyframe animations.
- **State**: Zustand (global audio preview player) and Canvas Confetti for social post celebrations.
- **Icons**: Lucide React.
