async function YoutubeLogin() {           
    const response = await fetch('/youtube/get_auth_url', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok) {      
        document.querySelector(".yt-box").innerHTML = `<a href="${data['auth_url']}">Login Youtube</a>`           
    } else {
        console.log(data);
    }
}

async function YoutubeTracks(playlist) {
    const response = await fetch(`/youtube/playlists/${playlist}`, {
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

async function YoutubePlaylists() {           
    const response = await fetch('/youtube/playlists', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    console.log(data, response.status)

    if (response.status == 200) {            
        var ul = document.createElement("ul");
        for(let i = 0; i < data.length; i++){
            var li = document.createElement("li");
            li.id = data[i]["id"]            
            li.innerHTML = `<h4><a href="#youtube/playlist/${data[i]['id']}" onclick='YoutubeTracks("${data[i]["id"]}")' >${data[i]["snippet"]["title"]}</a></h4>`
            ul.appendChild(li)
        }      
        document.querySelector(".yt-box").appendChild(ul)    
    } else {
        YoutubeLogin();
    }
}

YoutubePlaylists();