import React, { useEffect, useState } from 'react';
import axios from "axios";

const SignedIn = ({ onSignOutSuccess }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        async function fetchUsername() {
            try {
                const response = await axios.get('/user-info');
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        fetchUsername();
    }, []);

    const handleSignOut = async () => {
        try {
            await axios.post('/sign-out');
            onSignOutSuccess(); // :P
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1>Signed in as {username}</h1>
            <a href="#" onClick={handleSignOut} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Sign Out
            </a>
        </div>
    );
};

export default SignedIn;