import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { auth } from "../../firebase.config";

import SignUp from "../../components/auth/signup/signUp";

import RouterContext from "../../context/router-context";

const isSSR = typeof window === "undefined";

const SignUpPage = () => {
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
                <title>Sign up • Instagram</title>
                <meta
                    name="description"
                    content={"signup to get credentials"}
                />
            </Head>
            {!isSSR && <SignUp />}
        </>
    );
};

export default SignUpPage;
