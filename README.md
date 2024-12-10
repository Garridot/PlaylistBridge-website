# PlaylistBridge Website

The project's goal is to **create a web-based platform** that allows users to connect their Spotify and YouTube accounts via the [**PlaylistBridge API**](https://github.com/Garridot/PlaylistBridge-backend) to **manage playlists** efficiently. The platform offers the following features:

1. **Log in to Spotify and YouTube** to authenticate users through the PlaylistBridge API.
2. **View playlists and their contents** retrieved by PlaylistBridge from Spotify and YouTube.
3. **Migrate playlists** between Spotify and YouTube.
4. **Log out** from services as needed.

The primary focus is to provide a centralized experience for managing playlists across these services without requiring users to interact directly with Spotify or YouTube applications.

---

## **Workflow**

### **1. Login**
- Users can:
  - **Log in to Spotify.**
  - **Log in to YouTube.**
- The web app interacts with the **PlaylistBridge API**, which handles the OAuth 2.0 process:
  - The user is redirected to the authentication page of the selected service.
  - PlaylistBridge retrieves and manages **access tokens** and **refresh tokens** securely.

### **2. Playlist Viewing**
- Once authenticated:
  - The PlaylistBridge API fetches the user's playlists from Spotify and YouTube.
  - The web app dynamically renders the playlists retrieved by PlaylistBridge.

### **3. Playlist Details**
- When a playlist is selected:
  - The PlaylistBridge API retrieves detailed playlist information, including:
    - Title, description, owner, and images.
    - List of songs with details such as title and artists.
  - The web app dynamically displays this information and updates the URL without reloading the page.

### **4. Playlist Migration**
- Users can select a playlist from Spotify or YouTube and request migration to the other service.
- The PlaylistBridge API:
  - Searches for songs in the destination service.
  - Creates a new playlist on the destination service with the matched songs.

### **5. Logout**
- Users can disconnect their Spotify and YouTube accounts:
  - PlaylistBridge revokes the tokens.
  - The web app clears the user's session and redirects to the login page.

---

## **Architecture and Components**

### **1. Backend: [PlaylistBridge API](https://github.com/Garridot/PlaylistBridge-backend)**
- Built with Flask.
- Manages authentication with Spotify and YouTube using OAuth 2.0.
- Handles playlist retrieval, song matching, and playlist migration.

### **2. Web Application**
- Interacts with PlaylistBridge to retrieve user data and playlists.
- Dynamically renders playlists and tracks using **JavaScript**.
- Includes custom CSS for styling and animations.
- Utilizes browser history events (`history.pushState` and `popstate`) for seamless navigation.

### **3. Interaction with External APIs**
- The PlaylistBridge API connects to:
  - **Spotify API**: To authenticate, retrieve playlists, and create playlists during migration.
  - **YouTube Data API**: To authenticate, retrieve playlists, and create playlists during migration.

### **4. Data Storage**
- **PlaylistBridge API**:
  - Uses **PostgreSQL** for structured long-term data (e.g., playlists, user data).
  - Uses **Redis** for temporary data (e.g., access tokens).
- **Web App**:
  - Caches temporary user data in `localStorage` or `sessionStorage` for performance optimization.

---

## **Key Features**

1. **Dynamic Loading:**
   - Playlists and tracks are fetched dynamically from the PlaylistBridge API and rendered without reloading the page.

2. **Playlist Migration:**
   - Playlists are seamlessly transferred between services using the PlaylistBridge API's song matching and playlist creation logic.

3. **Intuitive Navigation:**
   - URL paths (`/dashboard/playlist/{service}/{playlist_id}`) and browser history events ensure a smooth user experience.

4. **Secure Authentication:**
   - Tokens are securely managed by the PlaylistBridge API.
   - The web app adheres to a strict **Content Security Policy (CSP)** to prevent unauthorized resource loading.

---

## **Final Objective**

The project aims to provide users with a **centralized, efficient, and secure tool** to manage playlists across Spotify and YouTube through the **PlaylistBridge API**, simplifying the interaction with both services.
