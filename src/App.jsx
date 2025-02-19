import React, { useEffect, useState } from 'react';
import SigninOptions from './components/SigninOptions';
import AddAssignment from "./components/AddAssignment";
import ShowAssignments from "./components/ShowAssignments";
import SignedIn from "./components/SignedIn";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const userCheckResponse = await axios.get('/signed-in-check');
            setIsAuthenticated(userCheckResponse.data);
        };

        checkAuth();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleSignOutSuccess = () => {
        setIsAuthenticated(false);
    };

    return (
        <div className="App container px-3">
            {isAuthenticated ? (
                <>
                    <SignedIn onSignOutSuccess={handleSignOutSuccess} />
                    <AddAssignment fetchTasks={fetchTasks} />
                    <ShowAssignments tasks={tasks} fetchTasks={fetchTasks} />
                </>
            ) : (
                <SigninOptions onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;