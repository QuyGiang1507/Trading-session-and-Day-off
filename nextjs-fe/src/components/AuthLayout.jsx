import { useEffect } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { authService } from 'services';
import Footer from './Footer';
import { Nav } from './Nav';
import Header from './Header';
export { AuthLayout };

function AuthLayout({ children }) {

    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header/>
                <Nav/>
                <div className="main-content">
                    {children}
                    <Footer />
                </div>
            </div>
        </React.Fragment>
    );
}