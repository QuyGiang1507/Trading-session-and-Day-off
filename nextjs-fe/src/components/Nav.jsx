import { useState, useEffect } from 'react';

import { NavLink } from '.';
import { authService } from 'services';

export { Nav };

function Nav() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const subscription = authService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        authService.logout();
    }

    // only show nav when logged in
    if (!user) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink href="/" exact className="nav-item nav-link">Home</NavLink>
                <a onClick={logout} className="nav-item nav-link">Logout</a>
            </div>
        </nav>
    );
}