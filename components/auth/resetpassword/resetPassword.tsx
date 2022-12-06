import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useContext } from "react";
import Link from "next/link";

import { auth } from "../../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";

import Spinner from "../../ui/spinner";

import ToggleMode from "../../../context/darkMode";

import { FiLock } from "react-icons/fi";

const emailValidation: RegExp = new RegExp(
    "[a-z0-9]+@[a-z]+.[a-z]{0,10}.[a-z]"
);

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const ResetPassword = () => {
    const [resetPasswordClicked, setResetPasswordClicked] = useState(false);

    // email
    const [emailInputValue, setEmailInputValue] = useState<string>("");
    const [focusOnEmailInput, setFocusOnEmailInput] = useState<boolean>(false);

    const [showmodel, setShowmodel] = useState<boolean>(false);

    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;

    const focusOnEmailInputHandler = () => {
        setFocusOnEmailInput(true);
    };

    const changeEmailInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnEmailInput(true);
        setEmailInputValue(e.target.value);
    };

    const hideModelHandler = () => {
        setShowmodel(false);
    };

    // reset password
    const forgotPasswordHandler = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        setResetPasswordClicked(true);
        setResetPasswordClicked(true);

        if (!emailValidation.test(emailInputValue.trim())) {
            return;
        }

        // firebase
        try {
            await sendPasswordResetEmail(auth, emailInputValue);
            console.log(emailInputValue);

            setShowmodel(true);
        } catch (error) {
            console.log(error);
        }
        setResetPasswordClicked(false);
    };
    return (
        <div className="flex justify-center items-start sm:pt-24 sm:pb-24 h-full">
            <div className="flex flex-col justify-start w-96 sm:pt-14 items-center h-full ">
                <div
                    className={`${
                        mode === "dark"
                            ? "bg-dark border-gray-500/50"
                            : "bg-gray-50 border-gray-300"
                    } w-full border-[1px] flex flex-col justify-center items-center pt-6 rounded-sm`}
                >
                    <div className="flex justify-center items-center w-48 h-20 relative">
                        <span
                            className={`${
                                mode === "dark"
                                    ? "border-white/80"
                                    : "border-darkGray/70 "
                            } border-[2.5px] rounded-full p-3`}
                        >
                            <span>
                                <FiLock
                                    className={`${
                                        mode === "dark"
                                            ? "text-white/80"
                                            : "text-darkGray/70 "
                                    } w-16 h-16 `}
                                    style={{ strokeWidth: "1" }}
                                />
                            </span>
                        </span>
                    </div>
                    <h2 className="py-3 pt-6 font-semibold">
                        Trouble Logging In?
                    </h2>
                    <p
                        className={`${
                            mode === "dark"
                                ? "text-white/60 "
                                : "text-gray-600/50"
                        } text-xs w-[75%] text-center`}
                    >
                        Enter your email, phone, or username and we&#39;ll send
                        you a link to get back into your account.
                    </p>
                    <form className="flex flex-col justify-start items-center pt-6 w-full space-y-3">
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
                                    mode === "dark"
                                        ? "text-white/50 "
                                        : "text-gray-400"
                                } ${
                                    !focusOnEmailInput &&
                                    !emailInputValue &&
                                    "hidden"
                                } ${
                                    emailInputValue
                                        ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                                        : "opacity-0"
                                } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                            >
                                Email
                            </span>

                            <input
                                type="email"
                                placeholder="Email"
                                value={emailInputValue}
                                onChange={changeEmailInputHandler}
                                onFocus={focusOnEmailInputHandler}
                                spellCheck={false}
                                className={`${
                                    mode === "dark"
                                        ? "bg-dark placeholder:text-white/50 "
                                        : "bg-gray-50 placeholder:text-gray-400"
                                } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                            />
                        </div>

                        {resetPasswordClicked ? (
                            <button
                                className={`${
                                    emailValidation.test(emailInputValue.trim())
                                        ? "bg-lightBlue"
                                        : "bg-lighertBlue/95 brightness-95 cursor-default"
                                } text-sm font-semibold text-white relative p-3 py-1.5 w-[70%] rounded-md`}
                            >
                                <div className="flex justify-center items-center">
                                    <Spinner className="scale-[0.2] mb-1 w-8 h-5" />
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={forgotPasswordHandler}
                                className={`${
                                    emailValidation.test(emailInputValue.trim())
                                        ? "bg-lightBlue"
                                        : "bg-lighertBlue/95 brightness-95 cursor-default"
                                } text-sm font-semibold text-white relative p-3 py-2 w-[70%] rounded-md`}
                            >
                                Send Login Link
                            </button>
                        )}
                    </form>
                    <div className="flex justify-start items-center py-3 w-[70%] space-x-5">
                        <span
                            className={`${
                                mode === "dark"
                                    ? "bg-gray-500/50 "
                                    : "bg-gray-300"
                            }  flex-1 w-full h-[1px] `}
                        ></span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-500/50 "
                                    : "text-gray-600/50"
                            } text-[12px] py-6 font-semibold`}
                        >
                            OR
                        </span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "bg-gray-500/50 "
                                    : "bg-gray-300"
                            }  flex-1 w-full h-[1px] `}
                        ></span>
                    </div>
                    <Link href={`/signup`}>
                        <a className="text-[14px] font-semibold">
                            Create New Account
                        </a>
                    </Link>
                    <Link href={`/signin`}>
                        <a
                            className={`${
                                mode === "dark"
                                    ? "bg-dark border-gray-500/50"
                                    : "bg-gray-50 border-gray-300"
                            } flex justify-center items-center border-t-[1px] w-full h-full mt-16 py-2`}
                        >
                            Back To Login
                        </a>
                    </Link>
                </div>
            </div>
            {/* Model */}
            <AnimatePresence>
                {showmodel && (
                    <motion.div
                        className=" top-0 left-0 fixed w-full h-full z-[100]"
                        initial={{
                            opacity: 0,
                            transform: "scale(1.5)",
                            top: "5px",
                        }}
                        animate={{
                            opacity: 1,
                            transform: "scale(1)",
                            top: "5px",
                        }}
                        exit={{
                            opacity: 0,
                            transform: "scale(1.1)",
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        {showmodel && (
                            <div className="fixed z-[1000] -top-1.5 left-0 w-screen h-full">
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-dark/30"
                                            : "bg-dark/30"
                                    } w-full h-full`}
                                    onClick={hideModelHandler}
                                ></div>
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-smothDark text-white"
                                            : "bg-gray-100 text-smothDark"
                                    } fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-lg -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] sm:-translate-y-48`}
                                >
                                    <h2 className="text-center font-semibold text-lg pt-2">
                                        SMS Sent
                                    </h2>
                                    <p
                                        className={`${
                                            mode === "dark"
                                                ? "text-white/60 "
                                                : "text-gray-600/50"
                                        } text-[13px] text-center px-6 py-2 pb-6`}
                                    >
                                        We sent an SMS to {emailInputValue} with
                                        a link to get back into your account.
                                    </p>
                                    <div
                                        onClick={hideModelHandler}
                                        className={`${
                                            mode === "dark"
                                                ? "border-gray-600/40"
                                                : "border-gray-600/10"
                                        } text-lightBlue cursor-pointer border-t-[1px] py-2 w-full flex flex-col justify-center items-center`}
                                    >
                                        ok
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResetPassword;
