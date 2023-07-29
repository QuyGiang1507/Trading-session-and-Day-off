import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "authConfig";
import { Button } from "reactstrap";
import Router from 'next/router';
import loadingGif from "assets/images/loading.gif"
import { alertService, authService } from "services";
/**
 * Renders a button which, when selected, will open a popup for login
 */
 export const MicrosoftSignOut = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/" // redirects the top level app after logout
            }).then(authService.logout());
        }
    }

    return (
        <div className="ml-auto" onClick={() => handleLogout("popup")}>Sign out Microsoft</div>
    );
}
