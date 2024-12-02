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
    var spBox = document.createElement("div");
    spBox.className = "sp-box";
    spBox.innerHTML =  `
    <h2 class="encore-text">Spotify playlists</h2>
    <div class="ggf-auth">
        <p>To access your Spotify playlists, please connect to your Spotify account.</p>
        <a href="${data.auth_url}" class="sp-auth-url">
            <p>Connect to Spotify</p>
            <i class="fa-brands fa-spotify"></i>
        </a>
    </div> `;
    document.querySelector(".grid.container").appendChild(spBox);
}   
export async function renderLogoutSpotify () {
    var li = document.createElement("li");
    li.className = "mditc";
    li.innerHTML = `    
        <a href="/spotify/logout" id="auth-spotify">
            <p>Disconnect to Spotify</p>
            <i class="fa-brands fa-spotify"></i>
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
                    <button type="submit"><i class="fa-solid fa-arrow-right-arrow-left"></i></button>
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

    var ytBox = document.createElement("div");
    ytBox.className = "yt-box";
    ytBox.innerHTML =  `
    <h2 class="encore-text">Youtube playlists</h2>
    <div class="ggf-auth">
        <p>To access your Youtube playlists, please connect to your Youtube account.</p>
        <a href="${data.auth_url}" class="yt-auth-url">
            <p>Connect to Youtube</p>
            <i class="fa-brands fa-youtube"></i>
        </a>
    </div> `;

    document.querySelector(".grid.container").appendChild(ytBox);
} 
export async function renderLogoutYoutube () {

    var li = document.createElement("li");
    li.className = "mditc";
    li.innerHTML = `    
        <a href="/youtube/logout" id="auth-youtube">
            <p>Disconnect to Youtube</p>
            <i class="fa-brands fa-youtube"></i>
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
                    <button type="submit"><i class="fa-solid fa-arrow-right-arrow-left"></i></button>
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


   