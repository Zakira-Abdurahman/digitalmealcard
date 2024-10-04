import axios from "axios";
import { signOut } from "next-auth/react";

const service = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_SERVICE_BASE_URL
});

service.interceptors.request.use(
    (config) => {
        // config.headers[ACCESS_TOKEN] = localStorage.getItem(ACCESS_TOKEN) || null;
        // config.headers[ID_TOKEN] = localStorage.getItem(ID_TOKEN) || null;
        // config.headers[TENANT] = localStorage.getItem(TENANT) || null;

        return config;
    },
    (error) => {
        // Do something with request error here
        Promise.reject(error);
    }
);

export const refreashIdToken = async () => {
    window.location.reload();
};

service.interceptors.response.use(
    (response) =>
        new Promise((resolve, reject) => {
            resolve(response);
        }),
    async (error) => {
        if (!error.response) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }
        if (error.response.data.message === "101") {
            
        } else if (error.response.data.message === "103") {
            refreashIdToken();
        } else if (error.response.data.message === "102" || error.response.data.message === "104") {
            navigateTo("/auth/access");
        } else if (error.response.data.message === "105") {
            // Not authorized to access this tenant
            await signOut();
          
        } else if (parseInt(error.response.status) === 401) {
            await signOut({ callbackUrl: "/auth/login" });
        }
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
);

// navigate to access denied page
function navigateTo(pathname) {
    window.location.href = pathname;
}

export default service;
