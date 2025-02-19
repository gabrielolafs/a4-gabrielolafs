async function login(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const response = await fetch('/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        alert('Login successful');
        window.location.href = '/';
    } else {
        alert('Login failed');
    }
}

document.querySelector('#loginForm').addEventListener('submit', login);