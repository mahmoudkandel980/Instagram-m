import Image from "next/image";
import Link from "next/link";

import SigninForm from "../form/signinForm";
import SigninSignupFormFooter from "../form/signinSignupFormFooter";
import FacebookBtn from "../form/facebook/facebookBtn";

import { ClassNameInterface } from "../../../interfaces/interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";

const RightSide = (props: ClassNameInterface & ModeInterFace) => {
    const { className, mode } = props;

    return (
        <div className={`${className} h-full `}>
            <div className="flex flex-col justify-start w-96 sm:pt-14 items-center h-full ">
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
                    <SigninForm mode={mode} />
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
                    <FacebookBtn mode={mode} />
                    <div
                        className={`${
                            mode === "dark" ? "text-lightBlue" : "text-facebook"
                        } text-xs font-light pt-5`}
                    >
                        <Link href={`/accounts/password/reset`}>
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <SigninSignupFormFooter mode={mode} />
            </div>
        </div>
    );
};

export default RightSide;
