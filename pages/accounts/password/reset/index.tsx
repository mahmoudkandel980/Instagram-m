import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { auth } from "../../../../firebase.config";

import ResetPassword from "../../../../components/auth/resetpassword/resetPassword";

import RouterContext from "../../../../context/router-context";

const isSSR = typeof window === "undefined";

const ResetPasswordPage = () => {
    const [isSSR, setIsSSR] = useState(true);

    const router = useRouter();

    const routerCtx = useContext(RouterContext);
    const { showRouterComponentHandler } = routerCtx;

    useEffect(() => {
        showRouterComponentHandler(true);
        setTimeout(() => {
            setIsSSR(false);
        }, 300);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (auth.currentUser?.displayName) {
            router.back();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSSR]);

    return (
        <>
            <Head>
                <title>Reset Password • Instagram</title>
                <meta
                    name="description"
                    content={
                        "Reset your paaword by write your email and you will have a message contains your password"
                    }
                />
            </Head>
            {!isSSR && <ResetPassword />}
        </>
    );
};

export default ResetPasswordPage;
