import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Members from './pages/Members';
import MemberTiers from './pages/MemberTiers';
import Tools from './pages/Tools';
import Rentals from './pages/Rentals';
import ClassRegistrations from './pages/ClassRegistrations';
import Classes from './pages/Classes';

// Components
import Navigation from './components/Navigation';

// Define the backend port and URL for API requests
const backendPort = 4292;  // Use the port you assigned to the backend server, this would normally go in a .env file
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<Members backendURL={backendURL} />} />
                <Route path="/member-tiers" element={<MemberTiers backendURL={backendURL} />} />
                <Route path="/tools" element={<Tools backendURL={backendURL} />} />
                <Route path="/rentals" element={<Rentals backendURL={backendURL} />} />
                <Route path="/class-registrations" element={<ClassRegistrations backendURL={backendURL} />} />
                <Route path="/classes" element={<Classes backendURL={backendURL} />} />
            </Routes>
        </>
    );

} export default App;