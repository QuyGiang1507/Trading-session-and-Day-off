import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { get, map } from "lodash";
import dynamic from 'next/dynamic'
import Image from "next/future/image";

//i18n
import i18n from "../../i18n";
import languages from "../../common/languages";


const LanguageDropdown = () => {
    // Declare a new state variable, which we'll call "menu"
    const [selectedLang, setSelectedLang] = useState("");
    useEffect(() => {
        const currentLanguage = sessionStorage.getItem("I18N_LANGUAGE");
        setSelectedLang(currentLanguage);
    }, []);

    const changeLanguageAction = lang => {
        //set language as i18n
        i18n.changeLanguage(lang);
        sessionStorage.setItem("I18N_LANGUAGE", lang);
        setSelectedLang(lang);
    };


    const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
    const toggleLanguageDropdown = () => {
        setIsLanguageDropdown(!isLanguageDropdown);
    };
    return (
        
        <React.Fragment>
            {selectedLang&&
            <Dropdown isOpen={isLanguageDropdown} toggle={toggleLanguageDropdown} className="ms-1 topbar-head-dropdown header-item">
                <DropdownToggle className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" tag="button">
                    <Image
                        src={get(languages, `${selectedLang}.flag`)}
                        alt="Header Language"
                        height="20"
                        width="20"
                        className="rounded"
                    />
                </DropdownToggle>
                <DropdownMenu className="notify-item language py-2">
                    {Object.keys(languages).map(key => (
                        <DropdownItem
                            key={key}
                            onClick={() => changeLanguageAction(key)}
                            className={`notify-item ${selectedLang === key ? "active" : "none"
                                }`}
                        >
                            <Image
                                src={get(languages, `${key}.flag`)}
                                alt="Skote"
                                className="me-2 rounded"
                                height="20"
                                width="20"
                            />
                            <span className="align-middle">
                                {get(languages, `${key}.label`)}
                            </span>
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>}
        </React.Fragment>
    );
};

export default LanguageDropdown