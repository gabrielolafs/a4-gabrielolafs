import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ onAccountCreated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rePassword !== password) {
            alert('Passwords do not match');
            return;
        }
        if (username.length === 0) {
            alert('Username cannot be empty');
            return;
        }
        if (password.length === 0) {
            alert('Password cannot be empty');
            return;
        }
        try {
            console.log('Checking if username already exists');
            const userCheckResponse = await axios.get('/user-check', { params: { username } });
            if (userCheckResponse.data === 1) {
                alert('Username already exists');
                return;
            }
            const response = await axios.post('/sign-up', { username, password });
            console.log(response.data)
            onAccountCreated();
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Retype Password:</label>
                <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
            </div>
            <button type="submit">Create Account</button>
        </form>
    );
};

export default Signup;