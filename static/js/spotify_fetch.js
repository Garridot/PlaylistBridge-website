async function SpotifyLogin() {           
    const response = await fetch('/spotify/get_auth_url', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {      
        document.querySelector(".sp-box").innerHTML = `<a href="${data['auth_url']}">Login Spotify</a>`           
    } else {
        console.log(data);
    }
}

async function SpotifyTracks(playlist) {
    const response = await fetch(`/spotify/playlists/${playlist}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {                      
        console.log(data);                   
    } else {
        console.log(data);
    }
}

async function SpotifyPlaylists() {           
    const response = await fetch('/spotify/playlists', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {   
           
        var ul = document.createElement("ul");
        for(let i = 0; i < data.length; i++){
            var li = document.createElement("li");
            li.id = data[i]["id"]            
            li.innerHTML = `<h4><a href="#spotify/playlist/${data[i]['id']}" onclick='SpotifyTracks("${data[i]["id"]}")' >${data[i]["name"]}</a></h4>`
            ul.appendChild(li)
        }      
        document.querySelector(".sp-box").appendChild(ul)    
    } else {
        SpotifyLogin();
    }
}

SpotifyPlaylists();