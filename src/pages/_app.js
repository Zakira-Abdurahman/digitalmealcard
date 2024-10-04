import React from "react";
import PrimeReact from "primereact/api";
import { appWithTranslation } from "next-i18next";

import Layout from "layout/layout";
import { LayoutProvider } from "layout/context/layoutcontext";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "etcalendar-datepicker/lib/DatePicker.css";
import "styles/layout/layout.scss";
import "styles/flags/flags.css";
import "styles/custom.css";

import { Provider } from "react-redux";
import store from "src/store";

import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    PrimeReact.ripple = true;

    if (Component.getLayout) {
        return (
            <SessionProvider session={session} refetchInterval={60}>
                <Provider store={store}>
                    <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>
                </Provider>
            </SessionProvider>
        );
    } else {
        return (
            <SessionProvider session={session}>
                <Provider store={store}>
                    <LayoutProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LayoutProvider>
                </Provider>
            </SessionProvider>
        );
    }
}

export default appWithTranslation(MyApp);
