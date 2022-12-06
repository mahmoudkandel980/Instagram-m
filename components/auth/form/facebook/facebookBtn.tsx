import React from "react";
import { useRouter } from "next/router";

import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../../firebase.config";

import { AiFillFacebook } from "react-icons/ai";

import { ModeInterFace } from "../../../../interfaces/interfaces";

const FacebookBtn = (props: ModeInterFace) => {
    const { mode } = props;

    const router = useRouter();
    const pathname = router.pathname;

    const facebookSignInUpHandler = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check for user
            const docRef = doc(db, "allUsers", `${user?.displayName}`);
            const docSnap = await getDoc(docRef);

            //if user dosent exist
            if (!docSnap.exists()) {
                let userName: string;

                const trimedFullNameValue = user
                    ?.displayName!.trim()
                    .replace(/\s/g, "_");
                const timeInMilliSecond = new Date().getMilliseconds();
                const randomNumber = +timeInMilliSecond.toString().slice(2);

                if (randomNumber >= 4) {
                    userName = `${trimedFullNameValue}${timeInMilliSecond
                        .toString()
                        .slice(0, 3)}`;
                } else {
                    userName = `${trimedFullNameValue}${timeInMilliSecond
                        .toString()
                        .slice(0, 2)}`;
                }

                await setDoc(
                    doc(db, "allUsers", userName.toLocaleLowerCase()),
                    {
                        email: user.email,
                        userName: userName.toLocaleLowerCase(),
                        fullName: user.displayName,
                        timestamp: serverTimestamp(),
                        userImg: "",
                        caption: "",
                        followers: [],
                        following: [],
                        search: [],
                    }
                );
            }

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {pathname === "/signin" ? (
                <button
                    onClick={facebookSignInUpHandler}
                    className="flex justify-center items-center space-x-2"
                >
                    <AiFillFacebook
                        className={`${
                            mode === "dark" ? "text-lightBlue" : "text-facebook"
                        } w-4 h-4`}
                    />
                    <span
                        className={`${
                            mode === "dark" ? "text-lightBlue" : "text-facebook"
                        } text-sm font-semibold`}
                    >
                        Log in with Facebook
                    </span>
                </button>
            ) : (
                <button
                    onClick={facebookSignInUpHandler}
                    className="flex text-white justify-center items-center space-x-2 w-full py-1.5 rounded-md bg-lightBlue"
                >
                    <AiFillFacebook className={`w-5 h-5`} />
                    <span className={` text-sm font-semibold`}>
                        Log in with Facebook
                    </span>
                </button>
            )}
        </>
    );
};

export default FacebookBtn;
