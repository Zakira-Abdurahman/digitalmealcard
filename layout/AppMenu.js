import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
    const model = [

        {
            label: "Authentication",
            icon: "pi pi-th-large",
            items: [
                {
                    label: "User",
                    icon: "pi pi-fw pi-user",
                    to: "/authentication/user"
                },
               
            ].filter(Boolean)
        },
        {
            label: "masterdata",
            icon: "pi pi-th-large",
            items: [
                {
                    label: "Student",
                    icon: "pi pi-fw pi-user",
                    to: "/masterdata/Student"
                },
                {
                    label: "Meal",
                    icon: "pi pi-fw pi-user",
                    to: "/masterdata/Meal"
                }
            ].filter(Boolean)
        },
        {
            label: "operational",
            icon: "pi pi-cog",
            items: [


                {
                    label: "Transaction",
                    icon: "pi pi-fw pi-money-bill",
                    to: "/operational/Transaction"
                },
                {
                    label: "Payment",
                    icon: "pi pi-fw pi-credit-card",
                    to: "/operational/Payment"
                }
            ].filter(Boolean)
        },


        {
            label: "Report",
            icon: "pi pi-cog",
            items: [


                {
                    label: "StudentMealHistory",
                    icon: "pi pi-fw pi-chart-bar",
                    to: "/Report/StudentMealHistory"
                },
               
            ].filter(Boolean)
        }


    ];

    const filteredModel = model.filter((item) => item.items && item.items.length > 0);

    return <AppSubMenu model={filteredModel} />;
};

export default AppMenu;
