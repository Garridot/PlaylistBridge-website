import { 
    renderAuthYoutube,
    renderAuthSpotify, 
    renderSpotifyPlaylists, renderSpotifyTracks,
    renderYoutubePlaylists, renderYoutubeTracks, 
    renderLoadAnimation,
} from './render.js' 

/**
 * Fetches data from the provided URL. Uses localStorage as a cache layer if enabled.
 * 
 * @param {string} url - The endpoint URL.
 * @param {string} cacheKey - The key for storing/retrieving data from localStorage.
 * @param {boolean} useCache - Whether to use localStorage for caching data.
 * @param {string} method - HTTP method for the request (default: GET).
 * @returns {Promise<Object|null>} - The fetched data or null if an error occurs.
 */
export async function fetchData(url, cacheKey, useCache = true, method = 'GET') {    
    
    if (useCache) {        
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {                
            return JSON.parse(cachedData);
        }
    }    

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
        });        
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error fetching ${url}:`, errorData);
            return null;
        }
        const data = await response.json();

        if (data["status"] == 200 && useCache == true ) {
            localStorage.setItem(cacheKey, JSON.stringify(data));  
        }

        return data;
    } catch (error) {
        console.error(`Network or server error for ${url}:`, error);
        return null;
    }
}

/**
 * Fetches user information from the YouTube API.
 * @returns {Promise<Object>} - The YouTube user data.
 */
export async function YoutubeUserData() {
    const data = await fetchData('/youtube/user_info', 'youtube_user_info',  true, "GET");
    return data
}
/**
 * Fetches the YouTube authentication URL and renders it.
 */
export async function YoutubeLogin() {
    const data = await fetchData('/youtube/get_auth_url', 'youtube_auth_url', false);
    if (data) {
        renderAuthYoutube(data["data"]);
    } else {
        console.error("Error fetching YouTube login URL.");
    }
}
/**
 * Fetches tracks from a specific YouTube playlist and renders them.
 * @param {string} playlist - The playlist ID.
 */
export async function YoutubeTracks(playlist) {    
    renderLoadAnimation();

    history.pushState({ playlist }, null, `/dashboard/playlist/youtube/${playlist}`);
    const data = await fetchData(`/youtube/playlists/${playlist}`, `youtube_playlist_${playlist}`);

    if (data["status"] == 200) {
        renderYoutubeTracks(data["data"])
    } else {
        console.error(`Error fetching tracks for playlist ${playlist}.`);
    }
}
/**
 * Fetches the user's YouTube playlists and renders them.
 */
export async function YoutubePlaylists() {
    const data = await fetchData('http://localhost:8000/youtube/get_playlists', 'youtube_playlists', true, "GET");


    if (data["status"] == 200) {
        renderYoutubePlaylists(data["data"]);        
    } else {
        console.info("No playlists found or error fetching playlists.");
        await YoutubeLogin();
    }
}


/**
 * Fetches user information from the Spotify API.
 * @returns {Promise<Object>} - The Spotify user data.
 */
export async function SpotifyUserData() {
    const data = await fetchData('/spotify/user_info', 'spotify_user_info', true, "GET");  
    return data   
}
/**
 * Fetches the Spotify authentication URL and renders it.
 */
export async function SpotifyLogin() {       
    const data = await fetchData('/spotify/get_auth_url', 'spotify_auth_url', false);
    if (data["status"] == 200) {
        renderAuthSpotify(data["data"]);
    } else {
        console.error("Error fetching Spotify login URL.");
    }           
}
/**
 * Fetches the user's Spotify playlists and renders them.
 */
export async function SpotifyPlaylists() {           
    const data = await fetchData('/spotify/playlists', 'spotify_playlists',  true, "GET");

    if (data["status"] == 200) {  
        renderSpotifyPlaylists(data["data"]);
    } else {
        console.info("No playlists found or error fetching playlists.");
        await SpotifyLogin();
    }
}
/**
 * Fetches tracks from a specific Spotify playlist and renders them.
 * @param {string} playlist - The playlist ID.
 */
export async function SpotifyTracks(playlist) {

    renderLoadAnimation();

    history.pushState({ playlist }, null, `/dashboard/playlist/spotify/${playlist}`);
    const data = await fetchData(`/spotify/playlists/${playlist}`, `spotify_playlist_${playlist}`);

    if (data["status"] == 200) {
        renderSpotifyTracks(data["data"]);
    } else {
        console.error(`Error fetching tracks for playlist ${playlist}.`);
    }
}