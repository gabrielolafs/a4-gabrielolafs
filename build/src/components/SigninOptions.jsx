import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

const SigninOptions = ({ onLoginSuccess }) => {
    const [newUserFlag, setNewUserFlag] = useState(false);

    const toggleUserFlag = () => {
        setNewUserFlag(!newUserFlag);
    };

    const handleAccountCreated = () => {
        setNewUserFlag(false);
    };

    return (
        <div className="container text-center mt-5">
            <h1>Task Manager</h1>
            <div className="mt-3">
                {newUserFlag ? <Signup onAccountCreated={handleAccountCreated} /> : <Login onLoginSuccess={onLoginSuccess} />}
                <button className="btn btn-primary mt-3" onClick={toggleUserFlag}>
                    {newUserFlag ? 'Switch to Login' : 'Switch to Signup'}
                </button>
            </div>
        </div>
    );
};

export default SigninOptions;