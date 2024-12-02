import { fetchData } from './fetchs.js' 

const path = location.pathname; 
const segments = path.split('/');
const from = segments[2].split('-')[0]; 
const playlistId = segments[3];     

const renderTracks = async(tracks) => { 
    
    for (let i = 0; i < (tracks.length - 1); i++) {
        await sleep(2500);
        if (tracks[i + 1]["track"] != undefined) {
            document.querySelector("h4.ctrk span").innerHTML = 
            `"${tracks[i + 1]["track"]["name"]} - ${tracks[i + 1]["track"]["artists"][0]["name"]}"`;
        } else {
            document.querySelector("h4.ctrk span").innerHTML = 
            `"${tracks[i + 1]["snippet"]["title"]} - ${tracks[i + 1]["snippet"]["videoOwnerChannelTitle"]}"`;
        }
    }
}

if (from === 'spotify') { 
    const data = await fetchData(`/spotify/playlists/${playlistId}`, `spotify_playlist_${playlistId}`);

    if (data["status"] != 200) {
        document.querySelector(".container-vignette h1").innerHTML = `Error fetching playlist: ${playlistId}.`;   
        
    } else {

        var playlistTitle = data["data"]["name"];
        var tracks = data["data"]["tracks"]["items"];        
        document.querySelector(".container-vignette h1").innerHTML = `Migrating Playlist "${playlistTitle}" to Youtube.`;
        document.querySelector("h4.ctrk span").innerHTML = `"${tracks[0]["track"]["name"]} - ${tracks[0]["track"]["artists"][0]["name"]}"`;
        
        renderTracks(tracks);
        await migratePlaylistSpotifyToYoutube (playlistId);
        
    }


} else if (from === 'youtube') {  
    const dataPlaylist = await fetchData(`/youtube/playlists/${playlistId}`, `youtube_playlist_${playlistId}`);
    const dataTracks = await fetchData(`/youtube/playlists/${playlistId}/tracks`, `youtube_playlist_${playlistId}_tracks`);

    if (dataPlaylist["status"] == 200 && dataTracks["status"] == 200) {   

        await migratePlaylistYoutubeToSpotify (playlistId);         
        
        var playlistTitle = dataPlaylist["data"]["items"][0]["snippet"]["title"];             
        document.querySelector(".container-vignette h1").innerHTML = `Migrating Playlist "${playlistTitle}" to Spotify.`;

        var tracks = dataTracks["data"]; 
        document.querySelector("h4.ctrk span").innerHTML = 
        `"${tracks[0]["snippet"]["title"]} - ${tracks[0]["snippet"]["videoOwnerChannelTitle"]}"`;

        renderTracks(tracks); 
    }  else {
        document.querySelector(".container-vignette h1").innerHTML = `Error fetching tracks for playlist ${playlistId}.`;    
    }
} 


function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function migratePlaylistSpotifyToYoutube (playlistId) {
    const data = await fetchData(`/migration/migrate-spotify-playlist/${playlistId}`, `migrate_spotify_playlist`, false, "POST");   

    if (data["status"] == 200) {
        await renderYoutubePlaylist(data["data"])
    }
}

async function migratePlaylistYoutubeToSpotify (playlistId) {
    const data = await fetchData(`/migration/migrate-youtube-playlist/${playlistId}`, `migrate_youtube_playlist`, false, "POST");

    if (data["status"] == 200) { 
        await renderSpotifyPlaylist(data["data"])
    }
}

async function renderSpotifyPlaylist(data) {

    var userData = JSON.parse(localStorage.getItem("spotify_user_info"))["data"];    
    var userImage = userData.images[1].url;
    var playlistOwner = userData["display_name"]; 

    var playlist = data["playlist_created"];    
    var playlistDescription = playlist.description;
    var playlistName = playlist.name;   
    
    var playlistImage = data["tracks_migrated"][0]["album"]["images"][0]["url"];

    document.querySelector(".container").innerHTML = `
    <section class="pltexc">
        <h1 class="title">The migration of the "${playlistName}" was successful.</h1>
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
        <div class="ggf-auth">
            <a href="${playlist.external_urls.spotify}" class="sp-auth-url">
                <p>Listen on Spotify</p>
                <i class="fa-brands fa-spotify"></i>
            </a>              
        </div>
        <div class="trksas">
        </div>
    </section>    
    `;
}

async function renderYoutubePlaylist(data) {

    var userData = JSON.parse(localStorage.getItem("youtube_user_info"))["data"];
    var userImage = userData.snippet.thumbnails.default.url;    

    var playlist = data["playlist_created"]; 
    var playlistDescription = playlist.snippet.description;
    var playlistName = playlist.snippet.title; 
    var playlistOwner = playlist.snippet.channelTitle; 

    var playlistImage = data["tracks_migrated"][0].snippet.thumbnails.high.url;

    document.querySelector(".container").innerHTML = `
    <section class="pltexc">
        <h1 class="title">The migration of the "${playlistName}" was successful.</h1>
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
        <div class="ggf-auth">
            <a href="https://www.youtube.com/playlist?list=${playlist.id}" class="yt-auth-url">
                <p>Listen on Youtube</p>
                <i class="fa-brands fa-youtube"></i>
            </a>              
        </div>
        <div class="trksas">
        </div>
    </section>    
    `;
}
