import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { APIClient } from "../../helpers/api_helper";
import defaultAvatar from "../../assets/images/default-avatar.jpg"
import Link from 'next/link';
import { authService } from 'services';
import Image from 'next/future/image';
import { userService } from 'services';
import { MicrosoftSignOut } from './MicrosoftSignOut';
import {useTranslation} from "react-i18next";
const ProfileDropdown = () => {
    const api = new APIClient();
    const {t} = useTranslation();

    const [avatar, setAvatar] = useState("")
    const user = localStorage.getItem("user")
    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <Image width="100" height="100" className="rounded-circle header-profile-user" src={defaultAvatar}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{JSON.parse(user)?.email}</span>
                        </span>

                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">{JSON.parse(user).email}!</h6>
                    <Link href="/profile"><DropdownItem><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">{t("Profile")}</span></DropdownItem></Link>
                    <Link href="/account/accountSecurity"><DropdownItem><i className="mdi mdi-account-lock text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">{t("Account Security")}</span></DropdownItem></Link>
                    <Link href="/lockscreen"><DropdownItem><i className="mdi mdi-lock-open text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">{t("Lock Screen")}</span></DropdownItem></Link>
                    <Link href="/logout"><DropdownItem><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">{t("Logout")}</span></DropdownItem></Link>
                    {/* <DropdownItem><MicrosoftSignOut/></DropdownItem> */}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;