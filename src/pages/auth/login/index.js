import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import AppConfig from "layout/AppConfig";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";
import axios from "axios";

function Login({ identityServiceBaseUrl }) {
    const router = useRouter();
    const toast = useRef(null);

    const [orgin, setOrigin] = useState();
    const schema = z.object({
        username: z.string().min(1, {
            message: "Username is required."
        }),
        password: z.string().min(1, {
            message: "Password is required."
        })
    });
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const submit = async (data) => {
        setLoading(true);
        const res = await signIn("credentials", {
            username: data?.username,
            password: data?.password,
            redirect: false,
            callbackUrl: `/`
        });

        if (res?.error) showError();
        if (res?.url) router.push(res?.url);
    };

    const showError = () => {
        toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: "Invalid Username or Password",
            life: 3000
        });
        reset({ password: "" });
        setLoading(false);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(ID_TOKEN);
        localStorage.removeItem(TENANT);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="px-5 min-h-screen flex justify-content-center align-items-center">
                <div className="border-1 surface-border surface-card border-round py-5 px-3 md:px-7 z-1">
                    <div className="text-center mb-6">
                        <img src="/image/Ambo.png" alt="Logo" className="w-24 mx-auto" />
                    </div>

                    <div className="mb-4">
                        <div className="text-900 text-xl font-bold mb-2">
                            Log in to Ambo University Weliso campus Digital MealCard System
                        </div>
                        <span className="text-600 font-medium">Please enter your details</span>
                    </div>
                    <div
                        className="flex flex-column"
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                handleSubmit(submit)();
                            }
                        }}
                    >
                        <div className="p-fluid field col-12">
                            <span>Username</span>
                            <span className=" p-input-icon-left">
                                <i className="pi pi-user"></i>
                                <InputText
                                    id="username"
                                    type="text"
                                    className="w-full "
                                    placeholder="Username"
                                    {...register("username")}
                                />
                            </span>
                            {errors.username?.message && <small className="p-error">{errors.username?.message}</small>}
                        </div>
                        <div className="p-fluid field col-12">
                            <span>Password</span>
                            <span className=" p-input-icon-left">
                                <i className="pi pi-lock"></i>
                                <InputText
                                    id="password"
                                    type="password"
                                    className="w-full "
                                    placeholder="Password"
                                    {...register("password")}
                                />
                            </span>
                            {errors.password?.message && <small className="p-error">{errors.password?.message}</small>}
                        </div>
                        <div className="mb-4 flex flex-wrap gap-3">
                            <div></div>
                            <a
                                className="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300"
                                href={`${identityServiceBaseUrl}resetpassword?origin=${encodeURIComponent(orgin)}`}
                            >
                                Forgot password?
                            </a>
                        </div>
                        {loading ? (
                            <Button icon="pi pi-spin pi-spinner" className="p-button-raised w-full" disabled></Button>
                        ) : (
                            <Button
                                label="Log In"
                                className="w-full"
                                onClick={handleSubmit(submit)}
                                onKeyDown={() => submit()}
                            ></Button>
                        )}{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

Login.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal />
        </React.Fragment>
    );
};
export async function getServerSideProps(context) {
    const identityServiceBaseUrl = process.env.NEXT_PUBLIC_IDENTITY_UI_SERVICE_BASE_URL || "";
    return {
        props: {
            identityServiceBaseUrl
        }
    };
}

export default Login;
