import Head from "next/head";
import {useState, useEffect} from "react";
import {useRouter} from "next/router";

// import 'styles/globals.css';
import "assets/scss/themes.scss";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import {authService} from "services";
import {setAuthorization} from "helpers/api_helper";
import Layouts from "Layouts";
import {ToastContainer} from "react-toastify";
import ParticlesAuth from "components/AuthenticationInner/ParticlesAuth";
import {NonAuthLayout} from "components/account";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from "@azure/msal-react";
import {msalConfig} from "authConfig";
import logoMxvSmall from "../assets/images/mxv-logo-small.png";
import "font-awesome/css/font-awesome.min.css";



export default App;

const msalInstance = new PublicClientApplication(msalConfig);

function App({Component, pageProps}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  

  useEffect(() => {
    //set style
    document.documentElement.setAttribute("data-layout", "vertical");
    document.documentElement.setAttribute("data-sidebar", "dark");
    document.documentElement.setAttribute("data-sidebar-size", "lg");
    // on initial load - run auth check
    authCheck(router.asPath);
    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = [
      "/account/login",
      "/account/register",
      "/account/forgotpwd",
      "/lockscreen",
      "/account/verification",
    ];
    const path = url.split("?")[0];
    if (
      !authService.userValue &&
      !publicPaths.includes(path) &&
      !localStorage.getItem("lockUser")
    ) {
      setAuthorized(false);
      router.push({
        pathname: "/account/login",
      });
    } else if (
      !authService.userValue &&
      !publicPaths.includes(path) &&
      localStorage.getItem("lockUser")
    ) {
      setAuthorized(false);
      router.push({
        pathname: "/lockscreen",
      });
    } else if (authService.userValue && publicPaths.includes(path)) {
      setAuthorized(true);
      router.push({
        pathname: "/",
      });
    } else {
      setAuthorized(true);
    }
  }
 
  return (
    <MsalProvider instance={msalInstance}>
      <Head>
        <title>MXV</title>
        <link rel="icon" type="image/x-icon" href={logoMxvSmall.src}></link>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
      </Head>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
      {authorized && !authService.userValue && (
        <ParticlesAuth>
          <NonAuthLayout>
            <Component {...pageProps} />
          </NonAuthLayout>
        </ParticlesAuth>
      )}
      {authService.userValue && (
        <Layouts>{authorized ? <Component {...pageProps} /> : null}</Layouts>
      )}
    </MsalProvider>
  );
}
