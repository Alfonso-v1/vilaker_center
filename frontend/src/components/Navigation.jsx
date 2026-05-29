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
        <nav>
            <img src={logo} alt='Vilaker Lifelong Learning Center Logo' />
            <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/members">Members</NavLink>
                <NavLink to="/member-tiers">Member Tiers</NavLink>
                <NavLink to="/tools">Tools</NavLink>
                <NavLink to="/rentals">Rentals</NavLink>
                <NavLink to="/class-registrations">Class Registrations</NavLink>
                <NavLink to="/classes">Classes</NavLink>
                <button onClick={handleReset} disabled={resetting}>
                    {resetting ? 'Resetting...' : 'Reset Database'}
                </button>
            </div>
        </nav>
    )
} export default Navigation;