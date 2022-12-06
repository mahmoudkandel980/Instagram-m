import React, { useContext } from "react";
import Image from "next/image";

import SignUpForm from "../form/signupForm";
import SigninSignupFormFooter from "../form/signinSignupFormFooter";
import FacebookBtn from "../form/facebook/facebookBtn";

import ToggleMode from "../../../context/darkMode";

const SignUp = () => {
    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;
    return (
        <div className="flex justify-center items-start w-full h-full">
            <div className="flex flex-col justify-start items-center w-96 h-full sm:pt-10">
                <div
                    className={`${
                        mode === "dark"
                            ? "bg-dark border-gray-500/50"
                            : "bg-gray-50 border-gray-300"
                    } w-full border-[1px] flex flex-col justify-center items-center pt-6 pb-5 rounded-sm`}
                >
                    <div className="w-48 h-20 relative">
                        <Image
                            src={`/images/Instagram_logo.png`}
                            layout="fill"
                            className={`${
                                mode === "dark" &&
                                "invert sepia contrast-200 saturate-200 hue-rotate-90"
                            } w-full h-full static object-contain`}
                            alt={"instagram_logo"}
                            priority
                        />
                    </div>
                    <p
                        className={`${
                            mode === "dark" ? "text-white/50 " : "text-gray-400"
                        } w-[80%] text-center text-[17px] font-semibold`}
                    >
                        Sign up to see photos and videos from your friends.
                    </p>
                    <div className="flex justify-center items-center w-[80%] py-3.5 pb-0">
                        <FacebookBtn mode={mode} />
                    </div>
                    <div className="flex justify-start items-center py-4 w-[70%] space-x-5">
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
                            } text-[12px] font-semibold`}
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
                    <SignUpForm mode={mode} />
                </div>
                <div></div>
                <SigninSignupFormFooter mode={mode} />
            </div>
        </div>
    );
};

export default SignUp;
