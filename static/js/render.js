import { 
    SpotifyTracks, SpotifyPlaylists, 
    YoutubeTracks, YoutubePlaylists, SpotifyLogin, YoutubeLogin,
} from './fetchs.js' 

/**
 * Displays a loading animation in the grid container.
 */
export function renderLoadAnimation() {
    var container = document.querySelector('.grid.container');
    container.innerHTML = '<div class="load-animation"><div class="loader"></div></div>';
}

/**
 * Clears the content of the grid container.
 */
export function clearContent() {
    var container = document.querySelector('.grid.container');
    container.innerHTML = "";
}

/**
 * Clears items from storage (localStorage or sessionStorage) by prefix.
 * 
 * @param {string} prefix - The prefix to match keys.
 * @param {Storage} storageType - The storage type to clear (default: localStorage).
 */
function clearStorageByPrefix(prefix, storageType = localStorage) {
    for (let i = 0; i < storageType.length; i++) {
        const key = storageType.key(i);
        if (key.startsWith(prefix)) {
            storageType.removeItem(key);
            i--; // Ajusta el índice porque sessionStorage se reorganiza dinámicamente después de eliminar un ítem.
        }
    }
}

/**
 * Renders the data requested based on the current URL path.
 * 
 * @param {Object} spotifyAuth - Spotify user authentication status.
 * @param {Object} YouTubeAuth - YouTube user authentication status.
 */
export async function renderDataRequested (spotifyAuth, YouTubeAuth) {

    // Obtener la URL completa de la ruta actual
    const path = location.pathname; 

    // Dividir la URL en segmentos
    const segments = path.split('/');

    if (segments.length >= 5 && segments[3] && segments[4]) {
        
        const service = segments[3]; 
        const playlistId = segments[4];   

        if (service === 'spotify') {  
            if(spotifyAuth.status = 200){            
                SpotifyTracks(playlistId);
            } else {
                SpotifyLogin();
            }

        } else if ( service === 'youtube' ) {  
            if(YouTubeAuth.status == 200){            
                YoutubeTracks(playlistId);
            } else {
                YoutubeLogin();
            }

        } else {
            console.error('Unknown service:', service);
        }
    } else if (segments.length == 2) {             
        renderUserPlaylists(spotifyAuth, YouTubeAuth);
    }
}

/**
 * Renders the user's playlists for both Spotify and YouTube.
 * 
 * @param {Object} spotifyAuth - Spotify user authentication status.
 * @param {Object} YouTubeAuth - YouTube user authentication status.
 */
export async function renderUserPlaylists(spotifyAuth, YouTubeAuth) {  
    clearContent();
    if (spotifyAuth.status == 200) {            
        SpotifyPlaylists();
    } else {
        SpotifyLogin();
    }

    if (YouTubeAuth.status == 200) {            
        YoutubePlaylists();
    } else {
        YoutubeLogin();
    }    
}


export async function renderAuthSpotify (data) {
    const spotifyIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>
    `;
    var spBox = document.createElement("div");
    spBox.className = "sp-box";
    spBox.innerHTML =  `
    <h2 class="encore-text">Spotify playlists</h2>
    <div class="ggf-auth">
        <p>To access your Spotify playlists, please connect to your Spotify account.</p>
        <a href="${data.auth_url}" class="sp-auth-url">
            <p>Connect to Spotify</p>
            ${spotifyIconSVG}
        </a>
    </div> `;
    document.querySelector(".grid.container").appendChild(spBox);
}   
export async function renderLogoutSpotify () {
    const spotifyIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>
    `;
    var li = document.createElement("li");
    li.className = "mditc";
    li.innerHTML = `    
        <a href="/spotify/logout" id="auth-spotify">
            <p>Disconnect to Spotify</p>
            ${spotifyIconSVG}
        </a>
    `;    
    document.querySelector("ul.mdltc").appendChild(li);   
    
    document.querySelector("#auth-spotify").addEventListener("click",(event) => {
        event.preventDefault();
        clearStorageByPrefix("spotify_");
        window.location.href = '/spotify/logout';
    })

} 
export async function renderSpotifyPlaylists (data) {

    var spBox = document.createElement("div");
    spBox.className = "sp-box";
    spBox.innerHTML =  `<h2 class="encore-text">Spotify playlists</h2>`;   

    var ul = document.createElement("ul");
    ul.className = "lfpfa";
    ul.id = "splp";       
    data.forEach(item => { 
        const li = document.createElement("li");
        li.id = item.id;
        li.innerHTML = `
        <a href="/dashboard/playlist/spotify/${item.id}" data-playlist="${item.id}" class="playlist-link">
            <div class="playlist-picture">
                <img src="${item.images[0]["url"]}" alt="${item.name}">
            </div>                 
            <h4>${item.name}</h4>
        </a>`;
        li.querySelector("a").addEventListener("click", () => SpotifyTracks(item.id));
        ul.appendChild(li);
    }); 
    spBox.appendChild(ul);  
    
    document.querySelector(".grid.container").appendChild(spBox);

    document.querySelector(".lfpfa").querySelectorAll('.playlist-link').forEach(link => {
        link.addEventListener('click', async function(event) {
            event.preventDefault();            
            const playlistId = event.target.getAttribute('data-playlist');
            if (playlistId) {
                await SpotifyTracks(playlistId);
            }
        });
    })
}  
export async function renderSpotifyTracks(data) { 
    clearContent();

    const migrateIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"/></svg>
    `;

    var userData = JSON.parse(localStorage.getItem("spotify_user_info"))["data"];    
    var userImage = userData.images[1].url;

    var playlistImage = data.images[0]["url"];
    var playlistDescription = data.description;
    var playlistName = data.name; 
    var playlistOwner = data.owner.display_name; 
    var playlistDuration = 0

    document.querySelector(".grid.container").innerHTML = `
        <section class="pltexc">
            <div class="maplat">
                <div class="imgrt">
                    <img src="${playlistImage}" alt="${playlistName}">
                </div>
                <div class="plytdesc">
                    <span class="sibti"><p>Playlist</p></span>
                    <div class="pltitlgy"><h1>${playlistName}</h1></div>
                    <span class="pldesc"><p>${playlistDescription}</p></span>
                </div>
            </div>
            <div class="plytde">
            <span class="sibti"><img src="${userImage}" alt="${playlistOwner}" width=50 height=50></span>
            <span class="sibti"><p>${playlistOwner}</p></span>
            <span class="sibti" id="duhs"><p></p></span>
            </div>
            <div class="migrplay">
                <form action="/migration/spotify-to-youtube/${data.id}" method="post">
                    <button type="submit">${migrateIconSVG}</button>
                </form>                
            </div>
            <div class="trksas">
            </div>
        </section>    
        `;

    var tracks = data.tracks.items;

    var ul = document.createElement("ul");    

    tracks.forEach((item)=>{        
        var trackName = item.track.name;
        var trackArtits = item.track.artists[0].name;        
        var trackImage = item.track.album.images[2].url;    
        var trackDuration = item.track.duration_ms;

        playlistDuration += trackDuration;        

        var li = document.createElement("li");        
        li.className = "trck";
        li.innerHTML = `           
            <span class="gfrt">
            <div class="traimg">
                <img src="${trackImage}" alt="${trackArtits}" width=64 height=64>
            </div>
            <div class="tratex">
                <h4>${trackName}</h4>
                <p>${trackArtits}</p>
            </div>            
            </span>        
        `
        ul.appendChild(li)
    }); 

    document.querySelector(".trksas").appendChild(ul); 

    document.querySelector("#duhs p").innerHTML = new Date(playlistDuration).toISOString().slice(11,19) + "min";         
}  


export async function renderAuthYoutube (data) {    
    const youtubeIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
    `;

    var ytBox = document.createElement("div");
    ytBox.className = "yt-box";
    ytBox.innerHTML =  `
    <h2 class="encore-text">Youtube playlists</h2>
    <div class="ggf-auth">
        <p>To access your Youtube playlists, please connect to your Youtube account.</p>
        <a href="${data.auth_url}" class="yt-auth-url">
            <p>Connect to Youtube</p>
            ${youtubeIconSVG}
        </a>
    </div> `;

    document.querySelector(".grid.container").appendChild(ytBox);
} 
export async function renderLogoutYoutube () {
    const youtubeIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
    `;

    var li = document.createElement("li");
    li.className = "mditc";
    li.innerHTML = `    
        <a href="/youtube/logout" id="auth-youtube">
            <p>Disconnect to Youtube</p>
            ${youtubeIconSVG}
        </a>
    `;
    document.querySelector("ul.mdltc").appendChild(li);
    document.querySelector("#auth-youtube").addEventListener("click",(event) => {
        event.preventDefault();
        clearStorageByPrefix("youtube_");
        window.location.href = '/youtube/logout';
    })
} 
export function renderYoutubePlaylists (data) { 

    var ytBox = document.createElement("div");
    ytBox.className = "yt-box";
    ytBox.innerHTML =  `<h2 class="encore-text">Youtube playlists</h2> `;   


    const ul = document.createElement("ul");
    ul.className = "lfpfa";
    ul.id = "ytlp";      
    data.forEach(item => {                  
        const li = document.createElement("li");
        li.id = item.id;     
        var image = item.snippet.thumbnails.medium;        
        li.innerHTML = `
        <a href="/playlist/youtube/${item.id}" data-playlist="${item.id}" class="playlist-link">
            <div class="playlist-picture">                    
                <img src="${image.url}" width=${image.width} height=${image.height}  alt="${item.snippet.title}">
            </div>  
            <h4>${item.snippet.title}</h4>
        </a>`;            
        li.querySelector("a").addEventListener("click", () => YoutubeTracks(item.id));
        ul.appendChild(li)
    })         
    ytBox.appendChild(ul);

    document.querySelector(".grid.container").appendChild(ytBox);

    document.querySelector("#ytlp").querySelectorAll('.playlist-link').forEach(link => {
        link.addEventListener('click', async function(event) {
            event.preventDefault();            
            const playlistId = event.target.getAttribute('data-playlist');
            if (playlistId) {
                await YoutubeTracks(playlistId);
            }
        });
    })
 
}  
export async function renderYoutubePlaylistData(data) {  
    clearContent();

    const migrateIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"/></svg>
    `;

    var userData = JSON.parse(localStorage.getItem("youtube_user_info"))["data"];
    var userImage = userData.snippet.thumbnails.default.url;    
    
    var playlistImage = data.items[0].snippet.thumbnails.medium.url;
    var playlistDescription = data.items[0].snippet.description;
    var playlistName = data.items[0].snippet.title; 
    var playlistOwner = data.items[0].snippet.channelTitle; 

    document.querySelector(".grid.container").innerHTML = `
        <section class="pltexc">
            <div class="maplat">
                <div class="imgrt">
                    <img src="${playlistImage}" alt="${playlistName}">
                </div>
                <div class="plytdesc">
                    <span class="sibti"><p>Playlist</p></span>
                    <div class="pltitlgy"><h1>${playlistName}</h1></div>
                    <span class="pldesc"><p>${playlistDescription}</p></span>
                </div>
            </div>
            <div class="plytde">
            <span class="sibti"><img src="${userImage}" alt="${playlistOwner}" width=50 height=50></span>
            <span class="sibti"><p>${playlistOwner}</p></span>
            </div>
            <div class="migrplay">  
                <form action="/migration/youtube-to-spotify/${data.items[0].id}" method="post">
                    <button type="submit">
                        ${migrateIconSVG}
                    </button>
                </form>     
            </div>
            <div class="trksas">
            </div>
        </section>    
    `;  

    return true
} 
export async function renderYoutubeTracks(data) {
    var tracks = data;

    var ul = document.createElement("ul");    

    tracks.forEach((item)=>{        
        var trackName = item.snippet.title;
        var trackArtits = item.snippet.videoOwnerChannelTitle;        
        var trackImage = item.snippet.thumbnails.default.url;   

        var li = document.createElement("li");        
        li.className = "trck";
        li.innerHTML = `           
            <span class="gfrt">
            <div class="traimg">
                <img src="${trackImage}" alt="${trackArtits}" width=64 height=64>
            </div>
            <div class="tratex">
                <h4>${trackName}</h4>
                <p>${trackArtits}</p>
            </div>            
            </span>        
        `
        ul.appendChild(li)
    }); 

    document.querySelector(".trksas").appendChild(ul); 
}


   