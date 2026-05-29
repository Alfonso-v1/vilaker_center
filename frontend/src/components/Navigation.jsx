import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/VLLC_logo.png"

function Navigation({ backendURL }) {

    const [resetting, setResetting] = useState(false);

    const handleReset = async () => {
        setResetting(true);

        try {
            const res = await fetch(backendURL + '/reset', { method: 'POST' });
            if (!res.ok) throw new Error('Reset failed.');
            window.location.reload();
        } catch (error) {
            alert('Could not reset the database.');
            console.error(error);
            setResetting(false);
        } 
    };

    return (
        <header className="site-header">
            <nav className="main-nav">
                <NavLink to="/" className="logo-link">
                    <img src={logo} alt='Vilaker Lifelong Learning Center Logo' />
                </NavLink>
                <div className="nav-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/members">Members</NavLink>
                    <NavLink to="/member-tiers">Member Tiers</NavLink>
                    <NavLink to="/tools">Tool Library</NavLink>
                    <NavLink to="/classes">Classes</NavLink>
                    <NavLink to="/class-registrations">Class Registrations</NavLink>
                    <NavLink to="/rentals">Rentals</NavLink>
                    
                </div>
                <button className="nav-button" onClick={handleReset} disabled={resetting}>
                    {resetting ? 'Resetting...' : 'Reset Database'}
                </button>
            </nav>
        </header>
    )
}

export default Navigation;