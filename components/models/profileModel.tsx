import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { auth } from "../../firebase.config";
import { signOut } from "firebase/auth";

import RouterContext from "../../context/router-context";
import ShowHideModels from "../../context/showHideModels-context";

import { CgProfile } from "react-icons/cg";
import { BsBookmark, BsMoon, BsSun } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { TiArrowRepeat } from "react-icons/ti";

import { ProfileModelInterface } from "../../interfaces/interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const ProfileModel = (props: ProfileModelInterface): JSX.Element => {
    const { showModel, mode, showModelHandler, toggleCurrentModeHandler } =
        props;

    const router = useRouter();

    const routerCtx = useContext(RouterContext);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { showRouterComponentHandler } = routerCtx;
    const { setProfileQueryHandler } = showHideModelsCtx;

    // routerModel
    const showRouterModelHandler = () => {
        if (router.asPath.includes("profile")) {
            return;
        } else {
            showRouterComponentHandler(true);
        }
    };

    // logout
    const logoutHandler = () => {
        signOut(auth);
        showRouterComponentHandler(true);
        router.push("/signin");
    };

    // set query=saved to query to saved posts
    const setProfileQueryHandlerFun = () => {
        setProfileQueryHandler("saved");
    };

    return (
        <div>
            <AnimatePresence>
                {showModel && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transform: `translateY(0)`,
                        }}
                        exit={{
                            opacity: 0,
                            transform: `translateY(0)`,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <div
                            className={`${
                                mode === "dark"
                                    ? "bg-inputColor"
                                    : "bg-[#ebebeb]"
                            } rotate-180 sm:rotate-0 absolute -top-6 sm:top-5 -right-2 w-3 h-3`}
                            style={{
                                clipPath:
                                    "polygon(51% 49%, 0% 100%, 100% 100%)",
                            }}
                        ></div>
                        <div
                            onClick={showModelHandler}
                            className={`${
                                mode === "dark"
                                    ? "bg-inputColor text-white "
                                    : "bg-white  border-[1px] border-darkGray/10 text-smothDark"
                            } flex py-3 rounded-md flex-col justify-center items-start -top-[268px] sm:top-8 -left-48 md:-left-44 lg:-left-24 w-52 absolute space-y-1`}
                        >
                            <Link href={`/profile`}>
                                <a
                                    onClick={showRouterModelHandler}
                                    className={`${
                                        mode === "dark"
                                            ? "hover:bg-smothDark"
                                            : "hover:bg-[#ebebeb]"
                                    } flex items-center justify-start space-x-1.5 pl-4  w-full py-1 duration-100`}
                                >
                                    <CgProfile />
                                    <span>Profile</span>
                                </a>
                            </Link>
                            <Link href={`/profile`}>
                                <a
                                    onClick={setProfileQueryHandlerFun}
                                    className={`${
                                        mode == "dark"
                                            ? "hover:bg-smothDark"
                                            : "hover:bg-[#ebebeb]"
                                    } flex items-center justify-start space-x-1.5 pl-4 w-full py-1 duration-100`}
                                >
                                    <BsBookmark />
                                    <span>Saved</span>
                                </a>
                            </Link>
                            <div
                                onClick={toggleCurrentModeHandler}
                                className={`${
                                    mode == "dark"
                                        ? "hover:bg-smothDark"
                                        : "hover:bg-[#ebebeb]"
                                } flex items-center justify-start space-x-1.5 pl-4 w-full py-1 duration-100`}
                            >
                                {mode === "dark" ? <BsSun /> : <BsMoon />}
                                <span>
                                    {" "}
                                    {mode === "dark" ? (
                                        <span>Light Mode</span>
                                    ) : (
                                        <span>Dark Mode</span>
                                    )}
                                </span>
                            </div>
                            <div
                                className={`${
                                    mode == "dark"
                                        ? "hover:bg-smothDark"
                                        : "hover:bg-[#ebebeb]"
                                } flex items-center justify-start space-x-1.5 pl-4 w-full py-1 duration-100`}
                            >
                                <AiOutlineSetting />
                                <span>Settings</span>
                            </div>

                            <div
                                onClick={logoutHandler}
                                className={`${
                                    mode == "dark"
                                        ? "hover:bg-smothDark"
                                        : "hover:bg-[#ebebeb]"
                                } pb-3 flex items-center justify-start space-x-1.5 pl-4 w-full py-1 duration-100`}
                            >
                                <TiArrowRepeat />
                                <span>Switch acount</span>
                            </div>

                            <div
                                onClick={logoutHandler}
                                className={`${
                                    mode == "dark"
                                        ? "hover:bg-smothDark border-gray-600/40"
                                        : "hover:bg-[#ebebeb] border-gray-400/25"
                                } pt-1 border-t-[1px] flex items-center justify-start space-x-1.5 pl-4 w-full py-1 duration-100`}
                            >
                                <span>Log Out</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileModel;
