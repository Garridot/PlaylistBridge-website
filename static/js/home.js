/**
 * Renders the loading animation and fetches user data for Spotify and YouTube.
 * Based on the authentication status, renders logout options for the services.
 */

import { SpotifyUserData, YoutubeUserData } from './fetchs.js' 
import { renderDataRequested, renderLogoutSpotify, renderLogoutYoutube, renderLoadAnimation } from './render.js'

renderLoadAnimation();

const spotifyUser = await SpotifyUserData();  
const youtubeUser = await YoutubeUserData(); 

if (spotifyUser.status == 200 ){        
    renderLogoutSpotify();
} 

if (youtubeUser.status == 200 ){        
    renderLogoutYoutube();    
} 

await renderDataRequested(spotifyUser, youtubeUser);

document.addEventListener('DOMContentLoaded', () => {    
    /**
     * Toggles the menu visibility when the button is clicked.
     */
    document.querySelector(".menu-mubrne button").addEventListener("click", () => {
        document.querySelector(".menu-mvqca").classList.toggle("click")
    })
    
});

window.addEventListener('popstate', () => {
    /**
     * Handles the browser back/forward navigation by re-rendering requested data.
     */
    renderDataRequested(spotifyUser, youtubeUser);    
});

