import React, { Component } from 'react';

// idk why this doesn't work
class NavBar extends Component {
    render() { 
        return (
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Navbar{" "}
                        <span className="badge bg-pill bg-secondary">
                            { "Smiley :D" }
                        </span>
                    </a>
                </div>
            </nav>
        );
    }
}
 
export default NavBar;