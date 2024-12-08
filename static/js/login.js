document.querySelector("#auth-button").addEventListener("click", async(event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),                
    });

    const data = await response.json();

    if (response.ok) {                             
        window.location.href = "/dashboard";                
    } else {
        alert(data.message);
    }
})

document.querySelector("#googlelogin").addEventListener("click", ()=>  {
    window.location.href = "/auth/google";
})