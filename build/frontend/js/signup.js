async function signUp(event) {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const response = await fetch('/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        alert('User registered successfully');
        window.location.href = '/login';
    } else {
        alert('Sign-up failed');
    }
}

document.querySelector('#signUpForm').addEventListener('submit', signUp);