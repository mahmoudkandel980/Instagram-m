import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";

import Spinner from "../../ui/spinner";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { ModeInterFace } from "../../../interfaces/interfaces";
import { SingleUserInterface } from "../../../interfaces/user-interfaces";

const emailValidation: RegExp = new RegExp(
    "[a-z0-9]+@[a-z]+.[a-z]{0,10}.[a-z]"
);

const SigninForm = (props: ModeInterFace) => {
    const { mode } = props;

    // check if there is a email in firebase or not
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [emailInFirebase, setEmailInFirebase] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();
    const [logInClicked, setLogInClicked] = useState(false);

    // email
    const [emailInputValue, setEmailInputValue] = useState<string>("");
    const [focusOnEmailInput, setFocusOnEmailInput] = useState<boolean>(false);
    const [blurOnEmailInput, setBlurOnEmailInput] = useState<boolean>(false);

    // password
    const [passwordInputValue, setPasswordInputValue] = useState<string>("");
    const [focusOnPasswordInput, setFocusOnPasswordInput] =
        useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    // allUsers current user
    useEffect(() => {
        const fetchAllUsersData = async () => {
            try {
                // allUsers current user
                const allUsersRef = collection(db, "allUsers");
                const allUsersQuerySnap = await getDocs(allUsersRef);

                const allUsersFirebaseRef: SingleUserInterface[] = [];
                // @ts-ignore
                allUsersQuerySnap.forEach((doc: any) => {
                    return allUsersFirebaseRef.push({
                        ...doc.data(),
                    });
                });

                setFirebaseAllUsers(
                    allUsersFirebaseRef.filter(
                        (user) =>
                            user.userName !== auth.currentUser?.displayName
                    )
                );
            } catch (error) {
                console.log(error);
            }
        };

        if (!firebaseAllUsers) {
            fetchAllUsersData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    useEffect(() => {
        setEmailInFirebase(false);
        firebaseAllUsers?.forEach((user) => {
            if (user.email === emailInputValue.trim()) {
                setEmailInFirebase(true);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailInputValue]);

    useEffect(() => {
        if (!passwordInputValue) {
            setShowPassword(false);
        }
    }, [focusOnPasswordInput, passwordInputValue]);

    // email
    const focusOnEmailInputHandler = () => {
        setFocusOnEmailInput(true);
        setBlurOnEmailInput(false);
    };

    const blurOnEmailInputHandler = () => {
        setBlurOnEmailInput(true);
        setFocusOnEmailInput(false);
    };

    // password
    const toggleShowHidePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const focusOnPasswordInputHandler = () => {
        setFocusOnPasswordInput(true);
    };

    const changePasswordInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnPasswordInput(true);
        setPasswordInputValue(e.target.value);

        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const changeEmailInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnEmailInput(true);
        setEmailInputValue(e.target.value);
    };

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (
            passwordInputValue.trim().length < 10 ||
            !emailInFirebase ||
            emailInputValue.trim().length < 6
        ) {
            return;
        }

        setLogInClicked(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                emailInputValue,
                passwordInputValue
            );

            // authentication
            if (userCredential.user) {
                router.push(`/`);
            }
        } catch (error) {
            // @ts-ignore
            setErrorMessage(error.message);
            setLogInClicked(false);
        }
    };

    return (
        <form className="flex flex-col justify-start items-center pt-6 w-full space-y-1.5">
            {/* email */}
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${!focusOnEmailInput && !emailInputValue && "hidden"} ${
                        emailInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    Email
                </span>
                <div
                    className={`${
                        !blurOnEmailInput && "opacity-0 -translate-y-1"
                    } absolute top-2 right-3 opacity-100 translate-y-0 duration-300`}
                >
                    <span className="cursor-default select-none">
                        {emailValidation.test(emailInputValue.trim()) &&
                        emailInFirebase ? (
                            <AiOutlineCheckCircle className="w-6 h-6 text-success" />
                        ) : (
                            <AiOutlineCloseCircle className="w-6 h-6 text-darkRed rotate-90" />
                        )}
                    </span>
                </div>
                <input
                    type="email"
                    placeholder="Email"
                    value={emailInputValue}
                    onChange={changeEmailInputHandler}
                    onFocus={focusOnEmailInputHandler}
                    onBlur={blurOnEmailInputHandler}
                    spellCheck={false}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${
                        !focusOnPasswordInput && !passwordInputValue && "hidden"
                    } ${
                        passwordInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    Password
                </span>
                <span
                    onClick={toggleShowHidePassword}
                    className={`${
                        mode === "dark" ? "text-white/90 " : "text-dark/50"
                    } ${
                        !passwordInputValue && "hidden"
                    } absolute right-3 text-[15px] cursor-pointer select-none`}
                >
                    {showPassword ? "Hide" : "Show"}
                </span>
                <input
                    type={showPassword ? "text" : "Password"}
                    placeholder="password"
                    value={passwordInputValue}
                    onChange={changePasswordInputHandler}
                    onFocus={focusOnPasswordInputHandler}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>
            {logInClicked ? (
                <button
                    className={`${
                        passwordInputValue.trim().length >= 10 &&
                        !emailInFirebase &&
                        emailInputValue.trim().length >= 6
                            ? "bg-lightBlue"
                            : "bg-lighertBlue/95 brightness-95 cursor-default"
                    } text-white relative p-3 py-1 w-[70%] rounded-md`}
                >
                    <div className="flex justify-center items-center">
                        <Spinner className="scale-[0.2] mb-1 w-8 h-5" />
                    </div>
                </button>
            ) : (
                <button
                    onClick={submitHandler}
                    className={`${
                        passwordInputValue.trim().length >= 10 &&
                        emailInFirebase &&
                        emailInputValue.trim().length >= 6
                            ? "bg-lightBlue"
                            : "bg-lighertBlue/95 brightness-95 cursor-default"
                    } text-white relative p-3 py-1 w-[70%] rounded-md`}
                >
                    Log In
                </button>
            )}
            {!emailInFirebase && (
                <span
                    className={`${
                        (!blurOnEmailInput ||
                            emailInputValue.trim().length === 0) &&
                        "opacity-0"
                    } text-darkRed text-center text-sm pt-2 w-[70%]`}
                >
                    Email doesn&#39;t exist.
                </span>
            )}
            {errorMessage && (
                <span
                    className={`text-darkRed text-center text-sm pt-2 w-[70%]`}
                >
                    Wrong password.
                </span>
            )}
        </form>
    );
};

export default SigninForm;
