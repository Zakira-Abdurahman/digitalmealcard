import { useContext, useEffect, useRef, useState } from "react";

import { Tooltip } from "primereact/tooltip";

import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppSubMenu = (props) => {
    const { layoutState, setBreadcrumbs } = useContext(LayoutContext);
    const tooltipRef = useRef(null);
    const modelChanges = useRef(0);

    useEffect(() => {
        if (tooltipRef.current) {
            tooltipRef.current.hide();
            tooltipRef.current.updateTargetEvents();
        }
    }, [layoutState.overlaySubmenuActive]);

    useEffect(() => {
        if (modelChanges.current < 50) {
            generateBreadcrumbs(props.model);
            modelChanges.current += 1;
        }
    }, [props.model]);

    const generateBreadcrumbs = (model) => {
        let breadcrumbs = [];

        const getBreadcrumb = (item, labels = []) => {
            const { label, to, items } = item;

            label && labels.push(label);
            items &&
                items.forEach((_item) => {
                    getBreadcrumb(_item, labels.slice());
                });

            to && breadcrumbs.push({ labels, to });
        };

        model.forEach((item) => {
            getBreadcrumb(item);
        });
        setBreadcrumbs(breadcrumbs);
    };

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {props.model.map((item, i) => {
                    return !item.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}
            </ul>
            <Tooltip ref={tooltipRef} target="li:not(.active-menuitem)>.tooltip-target" />
        </MenuProvider>
    );
};

export default AppSubMenu;
