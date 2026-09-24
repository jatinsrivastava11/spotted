# Spotted — Study Guide for College Sophomores (Python to Swift/iOS)

This guide is designed specifically for a college sophomore who has taken introductory CS courses in **Python** and wants to understand all the concepts used to build **Spotted**.

Every concept below connects a concept you likely already know from Python to how it works in **Swift**, **iOS development**, and **Modern App Architecture**.

---

## 1. Programming Language Foundations: Python vs. Swift

### Concept A: Static Typing vs. Dynamic Typing
- **In Python**: Variables have no fixed type. You can write:
  ```python
  x = "Nights"  # x is a string
  x = 42        # now x is an int (Python allows this at runtime)
  ```
- **In Swift (Used in Spotted)**: Every variable has a known, fixed type at compile-time:
  ```swift
  let trackName: String = "Nights" // Fixed String
  // trackName = 42 // COMPILE ERROR! Xcode won't even let you build this.
  ```
- **Why it matters**: Swift prevents whole categories of bugs (like passing an integer into a string formatter) before the app ever runs on a phone.

---

### Concept B: `let` vs. `var` (Immutability)
- **In Python**: Everything can generally be modified unless you use tuples or frozen dataclasses.
- **In Swift**:
  - `let` = Constant (cannot be changed after assigned).
  - `var` = Variable (can be changed).
- **Rule of thumb**: In Swift, use `let` by default everywhere, and only use `var` if you explicitly plan to change the value (like a like counter: `var likesCount: Int`).

---

### Concept C: Structs (Value Types) vs. Classes (Reference Types)
- **In Python**: Everything is an object passed by **reference**. If you pass a `dict` or class instance into a function and change it, the original changes too:
  ```python
  a = {"title": "Blonde"}
  b = a
  b["title"] = "Channel Orange"
  print(a["title"])  # Prints "Channel Orange"! Both point to same memory.
  ```
- **In Swift**: We use `struct` for our models (`SpotifyTrack`, `Post`, `UserProfile`). Structs are **Value Types** (copied on assignment):
  ```swift
  var a = Post(...)
  var b = a
  b.caption = "New review"
  // 'a' remains unchanged! 'b' is an independent copy.
  ```
- **Why it matters**: Structs make social feed data predictable and thread-safe when multiple tasks are running simultaneously.

---

### Concept D: Optionals (`?`) and `nil` vs. Python `None`
- **In Python**: If a function doesn't return something, it returns `None`. If you try to do `None.split()`, your program crashes with `AttributeError: 'NoneType' object has no attribute 'split'`.
- **In Swift**: A normal variable can **NEVER** be empty. If a variable might be missing (like a review rating on a post that isn't a review), you must declare it as an **Optional** with a question mark:
  ```swift
  var rating: Double? // Might be a Double (e.g., 4.5) OR might be nil
  ```
- **Unwrapping Optionals**:
  ```swift
  if let safeRating = post.rating {
      print("User rated this \(safeRating) stars")
  } else {
      print("No rating provided")
  }
  ```
  Xcode forces you to check for `nil` before using the variable, which completely eliminates `NullPointerException` crashes.

---

### Concept E: Protocols vs. Python Duck Typing
- **In Python**: "If it walks like a duck, it's a duck." You can call `.id` on anything, and Python just hopes the attribute exists.
- **In Swift**: We use **Protocols** (similar to Python's Abstract Base Classes or Interfaces). Notice how our models look:
  ```swift
  struct SpotifyTrack: Identifiable, Codable, Hashable { ... }
  ```
  - `Identifiable`: Guarantees the struct has a unique `.id` property (required so SwiftUI lists know how to animate items).
  - `Codable`: Automatically converts JSON from Spotify's API into a Swift struct.
  - `Hashable`: Allows items to be used in sets or compared for equality.

---

## 2. User Interface Concepts: Declarative UI (SwiftUI)

### Concept F: Declarative UI vs. Imperative UI
- **Imperative (Old way / Tkinter / Vanilla JS)**: You write step-by-step instructions telling the computer how to construct UI elements:
  *"Create a button -> set background to green -> when clicked, find the label with ID 5 and change text to 'Liked'"*.
- **Declarative (SwiftUI / React)**: You declare **what the screen should look like based on state**:
  ```swift
  Button(action: { isLiked.toggle() }) {
      Image(systemName: isLiked ? "heart.fill" : "heart")
          .foregroundColor(isLiked ? .red : .gray)
  }
  ```
  You never manually edit the button's color. You change `isLiked = true`, and SwiftUI automatically redraws the screen!

---

### Concept G: Layout Stacks (`VStack`, `HStack`, `ZStack`)
SwiftUI builds screens using 3 basic container boxes:
- **`VStack`** (Vertical Stack): Places views on top of each other (like paragraphs in a Word document).
- **`HStack`** (Horizontal Stack): Places views side-by-side (like an album thumbnail next to track text).
- **`ZStack`** (Depth Stack): Places views on top of each other along the z-axis (like text placed over an album cover image).

---

## 3. Reactive State Management

### Concept H: Single Source of Truth & Property Wrappers
In iOS apps, the screen must always match the internal data. Swift uses **Property Wrappers** (variables starting with `@`):
- **`@State`**: Used inside a view for local UI temporary data (e.g. `showCommentSheet`, `searchQuery`).
- **`@Published`**: Placed inside a ViewModel/Store (`SocialStore`). Whenever this variable changes (like a new post is added), any view observing it automatically updates.
- **`@ObservedObject`**: Connects a SwiftUI view to a shared store so it listens for updates.

---

## 4. Networking, APIs & Audio

### Concept I: Client-Server Architecture & REST APIs
- **Client**: The Spotted iOS app running on your iPhone.
- **Server**: Spotify's API servers.
- **HTTP Methods**:
  - `GET`: Asking the server for data (e.g. `GET /v1/me/top/tracks` to get your top songs).
  - `POST`: Sending new data to the server (e.g. publishing a post or creating a playlist).
- **Headers & Bearer Tokens**: An HTTP header like `Authorization: Bearer <token>` acts like a temporary digital passport proving the user is logged into Spotify.

---

### Concept J: JSON Parsing (Swift `Codable` vs. Python `json.loads`)
- In Python, you do `data = json.loads(response_text)` and access fields via `data["tracks"]["items"][0]["name"]`.
- In Swift, we create structs matching the JSON keys, and `JSONDecoder().decode(SpotifyTrack.self, from: data)` automatically validates and parses the data into a strongly-typed object.

---

### Concept K: OAuth 2.0 (PKCE)
- **Problem**: You don't want users typing their Spotify passwords directly into Spotted (security risk).
- **Solution (OAuth 2.0)**:
  1. Spotted opens Spotify's official login page in Safari.
  2. The user taps "Agree" to grant permissions (read listening history, view top tracks).
  3. Spotify redirects back to Spotted via a custom URL scheme (`spotted://callback`) with an authorization code.
  4. Spotted exchanges that code for an **Access Token** without ever seeing the user's password.

---

### Concept L: Audio Streaming with `AVPlayer`
- Instead of downloading an entire MP3 file before playing, **streaming** plays small chunks of audio as they arrive over Wi-Fi.
- In `AudioPlayerService.swift`, Apple's `AVPlayer` handles this buffering pipeline in the background so audio starts within milliseconds.

---

## 5. Software Engineering Patterns

### Concept M: The MVVM Design Pattern
```
  [ Model ] <──────> [ ViewModel / Store ] <──────> [ View ]
(Data Structs)       (Business Logic/State)         (SwiftUI UI)
```
- **Why we separate them**: If you put network calls, audio streaming, and UI layout code all in one giant file, the code becomes unmaintainable. Separating them into Models, Services, Stores, and Views makes each piece testable, modular, and easy to debug.

---

## Summary Checklist to Practice
1. **Swift Basics**: Try writing small Swift scripts in an Xcode Playground focusing on `struct`, `let/var`, and `if let`.
2. **SwiftUI Stacks**: Experiment with modifying `FeedView.swift` or `PostCardView.swift` by adding a new button or color.
3. **API Exploration**: Look at [developer.spotify.com/documentation/web-api](https://developer.spotify.com/documentation/web-api) to see all the endpoints Spotify offers.
4. **State Experiments**: Look at `SocialStore.swift` and see how calling `toggleLike()` causes the heart icon to instantly change color.
