import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { auth } from "../../firebase.config";

import SignIn from "../../components/auth/signIn/signIn";

import RouterContext from "../../context/router-context";

const isSSR = typeof window === "undefined";

const SignInPage = () => {
    const [isSSR, setIsSSR] = useState(true);

    const routerCtx = useContext(RouterContext);
    const { showRouterComponentHandler } = routerCtx;

    const router = useRouter();

    useEffect(() => {
        showRouterComponentHandler(true);
        setTimeout(() => {
            setIsSSR(false);
        }, 300);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isSSR && auth.currentUser?.displayName) {
            router.push(`/`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSSR]);

    return (
        <>
            <Head>
                <title>Login • Instagram</title>
                <meta name="description" content={"login to get credentials"} />
            </Head>
            <div>{!isSSR && <SignIn />}</div>
        </>
    );
};

export default SignInPage;
