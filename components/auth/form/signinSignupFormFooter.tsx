import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { ModeInterFace } from "../../../interfaces/interfaces";

const SigninSignupFormFooter = (props: ModeInterFace) => {
    const { mode } = props;

    const router = useRouter();
    const { pathname } = router;

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } flex justify-center items-center space-x-1 py-6 my-3 border-[1px] w-full rounded-sm`}
            >
                <span className="text-sm">
                    {pathname === "/signup"
                        ? "Have an account?"
                        : `Don't have an account?`}
                </span>

                <button className="text-sm text-lightBlue font-semibold">
                    <Link href={pathname === "/signup" ? "/signin" : "/signup"}>
                        {pathname === "/signup" ? "Log in" : `Sign up`}
                    </Link>
                </button>
            </div>
            <span className="text-sm py-1">Get the app.</span>
            <div className="flex justify-center items-center space-x-3">
                <div className="w-32 h-16 relative">
                    <Link
                        href={
                            "https://apps.apple.com/app/instagram/id389801252?vt=lo"
                        }
                    >
                        <a target="_blank" className="w-full h-full relative">
                            <button className="w-32 h-16 relative">
                                <Image
                                    src={`/images/signin/app_store.png`}
                                    layout="fill"
                                    className={`object-contain`}
                                    alt={"app_store"}
                                    priority
                                />
                            </button>
                        </a>
                    </Link>
                </div>
                <div className="w-32 h-16 relative">
                    <Link
                        href={
                            "https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3DE50A11D7-8863-423A-85AD-328B4F00B622%26utm_content%3Dlo%26utm_medium%3Dbadge"
                        }
                    >
                        <a target="_blank" className="w-full h-full relative">
                            <button className="w-32 h-16 relative">
                                <Image
                                    src={`/images/signin/google_play.png`}
                                    layout="fill"
                                    className={`object-contain`}
                                    alt={"app_store"}
                                    priority
                                />
                            </button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SigninSignupFormFooter;
