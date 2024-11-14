export async function fetchData(url, cacheKey, useCache = true, method = 'GET') {
    // Verificar si los datos están en caché
    if (useCache) {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            console.log(`Cache hit for ${cacheKey}`);
            return JSON.parse(cachedData);
        }
    }    

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
        });        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error fetching ${url}:`, errorData);
            return null;
        }

        const data = await response.json();

        // Almacenar en caché los datos válidos
        if (data) {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            console.log(`Data cached for ${cacheKey}`);
        }

        return data;
    } catch (error) {
        console.error(`Network or server error for ${url}:`, error);
        return null;
    }
}

export async function YoutubeLogin() {
    const data = await fetchData('/youtube/get_auth_url', 'youtube_auth_url', false);
    if (data && data.auth_url) {
        document.querySelector(".yt-box").innerHTML = `<a href="${data.auth_url}">Login Youtube</a>`;
    } else {
        console.error("Error fetching YouTube login URL.");
    }
}

export async function YoutubeTracks(playlist) {
    const data = await fetchData(`/youtube/playlists/${playlist}`, `youtube_playlist_${playlist}`);

    if (data) {
        console.log(data);
    } else {
        console.error(`Error fetching tracks for playlist ${playlist}.`);
    }
}

export async function YoutubePlaylists() {
    const data = await fetchData('/youtube/playlists', 'youtube_playlists');

    if (data && Array.isArray(data)) {
        const ul = document.createElement("ul");
        data.forEach(item => {
            const li = document.createElement("li");
            li.id = item.id;
            li.innerHTML = `<h4><a href="#youtube/playlist/${item.id}">${item.snippet.title}</a></h4>`;
            li.querySelector("a").addEventListener("click", () => YoutubeTracks(item.id));
            ul.appendChild(li);
        });
        document.querySelector(".yt-box").appendChild(ul);
    } else {
        console.info("No playlists found or error fetching playlists.");
        await YoutubeLogin();
    }
}

export async function SpotifyLogin() {       
    const data = await fetchData('/spotify/get_auth_url', 'spotify_auth_url', false);

    if (data && data.auth_url) {
        document.querySelector(".sp-box").innerHTML = `<a href="${data.auth_url}">Connect with Spotify</a>`;
    } else {
        console.error("Error fetching Spotify login URL.");
    }           
}

export async function SpotifyTracks(playlist) {
    const data = await fetchData(`/spotify/playlists/${playlist}`, `spotify_playlist_${playlist}`);

    if (data) {
        console.log(data);
    } else {
        console.error(`Error fetching tracks for playlist ${playlist}.`);
    }
}

export async function SpotifyPlaylists() {           
    const data = await fetchData('/spotify/playlists', 'spotify_playlists');

    if (data && Array.isArray(data)) { 
           
        var ul = document.createElement("ul");
        data.forEach(item => {
            const li = document.createElement("li");
            li.id = item.id;
            li.innerHTML = `<h4><a href="#spotify/playlist/${item.id}">${item.name}</a></h4>`;
            li.querySelector("a").addEventListener("click", () => SpotifyTracks(item.id));
            ul.appendChild(li);
        }); 
        document.querySelector(".sp-box").appendChild(ul)    
    } else {
        console.info("No playlists found or error fetching playlists.");
        await SpotifyLogin();
    }
}
