import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "authConfig";
import { Button } from "reactstrap";
import Router from 'next/router';
import loadingGif from "assets/images/loading.gif"
import { alertService, authService } from "services";
import Image from "next/image";
/**
 * Renders a button which, when selected, will open a popup for login
 */
export const MicrosoftSignIn = () => {
  const { instance } = useMsal();
  const [loading,setLoading] = useState(false)
  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).then((res)=>{
        setLoading(true)
        authService.microsoftLogin(res.accessToken)
        .then(() => {
          // get return url from query parameters or default to '/'
          setLoading(false)
          console.log("OK");
          Router.push("/");
        })
        .catch(alertService.error)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e);
      });
    }
  };
  return (
    <div className="mt-4 text-center">
      <div className="signin-other-title">
        <h5 className="fs-13 title">Sign In with</h5>
      </div>
      <div id="wpo365OpenIdRedirect" className="wpo365-mssignin-wrapper">
        <div className="wpo365-mssignin-spacearound">
          <div
            className="wpo365-mssignin-button"
            onClick={() => handleLogin("popup")}
          >
            {loading && <Image alt="" src={loadingGif} width="21" height="21"/>}
            {!loading &&
            <div className="wpo365-mssignin-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
              >
                <title>MS-SymbolLockup</title>
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
            </div>
            }
            <div className="wpo365-mssignin-label">Sign in with Microsoft</div>
          </div>
        </div>
      </div>
    </div>
  );
};
