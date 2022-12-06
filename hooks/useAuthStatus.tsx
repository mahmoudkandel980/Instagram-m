import { useState, useEffect, useRef } from "react";

import { auth } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";

const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkStatus, setCheckStatus] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedIn(true);
                }
                setCheckStatus(false);
            });
        }

        return () => {
            isMounted.current = false;
        };
    }, [isMounted]);

    return { loggedIn, checkStatus };
};

export default useAuthStatus;
