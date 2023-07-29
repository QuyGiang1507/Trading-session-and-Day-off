import { Link } from 'components';
import React, { useEffect } from 'react';
import { authService } from 'services';
export default Logout;

function Logout() {
    useEffect(()=>{
        authService.logout()
    },[])
    return (
        <></>
    );
}
