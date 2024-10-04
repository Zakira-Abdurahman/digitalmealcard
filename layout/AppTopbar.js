import getConfig from "next/config";
import { useRouter } from "next/router";
import { forwardRef, useContext, useEffect, useImperativeHandle, useState, useRef } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import AppBreadcrumb from "./AppBreadCrumb";
import { LayoutContext } from "./context/layoutcontext";

import { signOut, useSession } from "next-auth/react";

import { Sidebar } from "primereact/sidebar";
import { CascadeSelect } from "primereact/cascadeselect";
import { useDispatch, useSelector } from "react-redux";

import { Divider } from "primereact/divider";
import { useTranslation } from "next-i18next";



const AppTopbar = forwardRef((props, ref) => {
    const { onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const { pathname, asPath, query } = router;
    const [selectedYear, setSelectedYear] = useState();
    const [selectedLabel, setSelectedLabel] = useState();
    const { t: translateCommon } = useTranslation("common");
    const { t: translateRoutes } = useTranslation("routes");

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));
    const dispatch = useDispatch();
 

    const { data: session } = useSession();
    const [selectedTenant, setSelectedTenant] = useState();

  

  


  

    

    const [selectedLang, setSelectedLang] = useState();
    const languages = [
        { name: "አማርኛ", code: "ET", locale: "am" },
        { name: "English", code: "UK", locale: "en" }
    ];



   

  
 
    

    return (
        <div className="layout-topbar">
            <div className="topbar-start">
                <button
                    ref={menubuttonRef}
                    type="button"
                    className="topbar-menubutton p-link p-trigger"
                    onClick={onMenuToggle}
                >
                    <i className="pi pi-bars"></i>
                </button>
                <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
            </div>

            <div className="topbar-end">
                <ul className="topbar-menu">
                    <li className="topbar-search">
                        <span className="p-input-icon-left"></span>
                    </li>
                    <li className="topbar-profile">
                    

                       
                        
                        <button
                            type="button"
                            className="p-link"
                            onClick={(e) => {
                                setVisible(true);
                            }}
                        >
                            <img src={`${contextPath}/image/avatar.png`} alt="Profile" />
                        </button>

                        <Sidebar position="right" visible={visible} onHide={() => setVisible(false)}>
                            <div className="flex flex-column " style={{ height: "100%" }}>
                                <span className="flex flex-column align-self-center card">
                                    <img
                                        src="/image/profile.png"
                                        height={80}
                                        width={80}
                                        className="align-self-center"
                                    ></img>
                                    <h4 className="align-self-center">{translateCommon("welcome")} &#128075;</h4>
                                    <p className="align-self-center">
                                        {session?.user?.firstName} {session?.user?.lastName}{" "}
                                    </p>
                                </span>

                                {/* <img src="/image/profile.png" height={80} width={80}></img> */}
                                <Divider />

                                <span className="mt-auto flex flex-column gap-2">
                                  
                                    <Button
                                        label={translateCommon("change password")}
                                        icon="pi pi-key"
                                        // onClick={redirectToIAM}
                                    ></Button>

                                    <Button
                                        label={translateCommon("logout")}
                                        icon="pi pi-power-off"
                                        onClick={() => {
                                            signOut();
                                            localStorage.clear();
                                        }}
                                    ></Button>
                                </span>
                            </div>
                        </Sidebar>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export { AppTopbar };
