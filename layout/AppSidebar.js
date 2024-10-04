import Link from "next/link";
import AppMenu from "./AppMenu";
import { MenuProvider } from "./context/menucontext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const AppSidebar = () => {
    const { data: session } = useSession();
    
    return (
        <>
            <Link href="/" legacyBehavior>
                <a className="app-logo -mt-3">
                    <Image src={"/image/Ambo.png"} alt="logo" loading="lazy" height="100" width="200" className="mb-3" />
                </a>
            </Link>

            <div className="layout-menu-container" style={{ marginTop: "-60px" }}>
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
        </>
    );
};

export default AppSidebar;
