import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navdata = () => {
    const router = useRouter();

    // const userRoles= localStorage.getItem("userRoles")? localStorage.getItem("userRoles").split(","):[]
    
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isUsers, setIsUsers] = useState(false);
    const [isSysMngt, setIsSysMngt] = useState(false);
    const [isComdMngt, setIsComdMngt] = useState(false);
    const [isApproval, setIsApproval] = useState(false);
    const [isOrderMngt, setIsOrderMngt] = useState(false);
    const [iscurrentState, setIscurrentState] = useState('');

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        //role
        

        //setActive
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Users') {
            setIsUsers(false);
        }
        if (iscurrentState !== 'SysMngt') {
            setIsSysMngt(false);
        }
        if (iscurrentState !== 'ComdMngt') {
            setIsComdMngt(false);
        }
        if (iscurrentState !== 'Approval') {
            setIsApproval(false);
        }
        if (iscurrentState !== 'OrderMngt') {
            setIsOrderMngt(false);
        }
    }, [
        router,
        iscurrentState,
        isDashboard,
        isUsers,
        isSysMngt,
        isComdMngt,
        isApproval,
        isOrderMngt
    ]);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
             id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/",
        },
        // {
        //     id: "profile",
        //     label: "Profile",
        //     icon: "ri-profile-line",
        //     link: "/profile",
        // },
        {
            label: "pages",
            isHeader: true,
        },

        {
            id: "users",
            label: "adminUserManagement",
            icon: "ri-user-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsUsers(!isUsers);
                setIscurrentState('Users');
                updateIconSidebar(e);
            },
            stateVariables: isUsers,
            subItems: [
                // {
                //     id: "userList",
                //     label: "User List",
                //     link: "/users",
                //     parentId: "users",
                // },
                {
                    id: "departmentList",
                    label: "Department List",
                    link: "/adminUserManagement/departments",
                    parentId: "users",
                    // visible: userRoles.includes("GET_DEPARTMENTS")
                },
                {
                    id: "roleList",
                    label: "Role List",
                    link: "/adminUserManagement/roles",
                    parentId: "users",
                    // visible: userRoles.includes("GET_ROLES")
                },
            ],
            // visible: userRoles.includes("GET_DEPARTMENTS") || userRoles.includes("GET_ROLES")
        },
        {
            id: "commodity-management",
            label: "commodityManagement",
            icon: "ri-scales-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsComdMngt(!isComdMngt);
                setIscurrentState('ComdMngt');
                updateIconSidebar(e);
            },
            stateVariables: isComdMngt,
            subItems: [
                {
                    id: "items",
                    label: "Items",
                    link: "/commodityManagement/items",
                    parentId: "items-management",
                },
                {
                    id: "commodity",
                    label: "Commodity",
                    link: "/commodityManagement/commodity",
                    parentId: "commodity-management",
                },
                {
                    id: "contracts",
                    label: "Contracts",
                    link: "/commodityManagement/contracts",
                    parentId: "contracts-management",
                },
                {
                    id: "settings",
                    label: "Settings",
                    link: "/commodityManagement/commoditySettings",
                    parentId: "contracts-management",
                },
            ],
        },
        {
            id: "system-management",
            label: "systemManagement",
            icon: "ri-settings-2-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsSysMngt(!isSysMngt);
                setIscurrentState('SysMngt');
                updateIconSidebar(e);
            },
            stateVariables: isSysMngt,
            subItems: [
                {
                    id: "logStorage",
                    label: "logStorageConfig",
                    link: "/systemManagement/logsStorage",
                    parentId: "system-management",
                },
                {
                    id: "activityHistory",
                    label: "activityHistory",
                    link: "/systemManagement/activity-history",
                    parentId: "system-management",
                },
                {
                    id: "tradingSession",
                    label: "tradingSession",
                    link: "/systemManagement/tradingSession",
                    parentId: "system-management",
                },
                {
                    id: "dayOff",
                    label: "dayOff",
                    link: "/systemManagement/dayOff",
                    parentId: "system-management",
                },
            ],
        },
        {
            id: "approval",
            label: "approval",
            icon: "ri-task-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsApproval(!isApproval);
                setIscurrentState('Approval');
                updateIconSidebar(e);
            },
            stateVariables: isApproval,
            subItems: [
                {
                    id: "authApproval",
                    label: "authApproval",
                    link: "/approval/authApproval",
                    parentId: "approval",
                },
                {
                    id: "comdApproval",
                    label: "comdApproval",
                    link: "/approval/comdApproval",
                    parentId: "approval",
                },
                {
                    id: "sessionApproval",
                    label: "sessionApproval",
                    link: "/approval/sessionApproval",
                    parentId: "approval",
                },
                {
                    id: "dayOffApproval",
                    label: "dayOffApproval",
                    link: "/approval/dayOffApproval",
                    parentId: "approval",
                },
            ],
        },
        
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;