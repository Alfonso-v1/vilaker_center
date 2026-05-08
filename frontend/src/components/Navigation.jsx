import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav>
            <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/members">Members</NavLink>
                <NavLink to="/member-tiers">Member Tiers</NavLink>
                <NavLink to="/tools">Tools</NavLink>
                <NavLink to="/rentals">Rentals</NavLink>
                <NavLink to="/class-registrations">Class Registrations</NavLink>
                <NavLink to="/classes">Classes</NavLink>
            </div>
        </nav>
    )
} export default Navigation;