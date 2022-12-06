import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuthStatus from "../../hooks/useAuthStatus";

import Header from "./header/header";
import Footer from "./footer/footer";
import UploadImage from "../models/uploadImage";
import UploadStoryImage from "../models/uploadStoryImage";
import RouterUi from "../ui/routerUi";

import ToggleMode from "../../context/darkMode";
import RouterContext from "../../context/router-context";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";

import { ChildrenInterface } from "../../interfaces/interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const Layout = (props: ChildrenInterface) => {
    const { children } = props;

    const { loggedIn, checkStatus } = useAuthStatus();
    const [scrollIsHidden, SetScrollIsHidden] = useState(false);

    const router = useRouter();
    const { postId, pop } = router.query;

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const showHideModels = useContext(ShowHideModels);

    const { mode } = modeCtx;
    const { showRouterComponent } = routerCtx;
    const { unfollowingModel } = currentUserFollowingCtx;
    const {
        showStoryModel,
        showPostModel,
        showLikesModel,
        showPostSettingsModel,
        editProfileModel,
    } = showHideModels;

    // change scroll color when change mode
    useEffect(() => {
        if (mode === "dark") {
            // scroll track
            document
                // @ts-ignore
                .getElementById("body", "::-webkit-scrollbar-track")
                ?.classList.add("bg-smothDark");
            document
                // @ts-ignore
                .getElementById("body", "::-webkit-scrollbar-track")
                ?.classList.remove("bg-white");
        } else {
            // scroll track
            document
                // @ts-ignore
                .getElementById("body", "::-webkit-scrollbar-track")
                ?.classList.remove("bg-smothDark");
            document
                // @ts-ignore
                .getElementById("body", "::-webkit-scrollbar-track")
                ?.classList.add("bg-white");
        }
    }, [mode]);

    // navigate to signin if not has a creditials
    useEffect(() => {
        if (!loggedIn) {
            router.push("/signin");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);

    // remove scroll when any model popup
    useEffect(() => {
        if (
            postId ||
            showLikesModel.state ||
            showPostSettingsModel.state ||
            pop === "followers" ||
            pop === "following" ||
            showPostModel.state ||
            showStoryModel.state ||
            editProfileModel.showProfileImageModel ||
            editProfileModel.showCaptionInput ||
            editProfileModel.state ||
            unfollowingModel.showUnfollowingModel
        ) {
            SetScrollIsHidden(true);
            document.getElementById("html")?.classList.add("overflow-y-hidden");
        } else {
            SetScrollIsHidden(false);
            document
                .getElementById("html")
                ?.classList.remove("overflow-y-hidden");
        }
    }, [
        postId,
        showLikesModel.state,
        showPostSettingsModel.state,
        pop,
        showPostModel.state,
        showStoryModel.state,
        editProfileModel.showProfileImageModel,
        editProfileModel.showCaptionInput,
        editProfileModel.state,
        unfollowingModel.showUnfollowingModel,
    ]);

    if (checkStatus) {
        return <RouterUi />;
    }

    return (
        <div
            className={`${
                mode === "dark"
                    ? "bg-smothDark text-white"
                    : "bg-gray-100 text-smothDark"
            } ${scrollIsHidden && "sm:pr-[10px] xl:pr-[12px]"} ${
                (router.pathname.includes("signin") ||
                    router.pathname.includes("/accounts/password/reset") ||
                    router.pathname.includes("signup")) &&
                "h-screen"
            } relative scroll-smooth min-h-screen `}
        >
            <Header
                className={`${scrollIsHidden && "sm:pr-[10px] xl:pr-[12px]"} ${
                    (router.pathname.includes("signin") ||
                        router.pathname.includes("/accounts/password/reset") ||
                        router.pathname.includes("signup")) &&
                    "hidden"
                }`}
            />
            <div
                className={`${
                    mode === "dark"
                        ? "bg-smothDark text-white"
                        : "bg-gray-100 text-smothDark"
                } ${
                    router.pathname === "/explore/people"
                        ? "sm:pb-10"
                        : router.asPath.includes("stories")
                        ? ""
                        : "pb-10"
                }`}
            >
                {/* RouterUi */}
                <RouterUi />

                <div className={`${showRouterComponent && "hidden"} `}>
                    {children}
                </div>

                <AnimatePresence>
                    {(showPostModel.state || showStoryModel.state) && (
                        <motion.div
                            className="fixed left-0 top-0 w-full h-full z-[100]"
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
                            {showPostModel.state && <UploadImage mode={mode} />}
                            {showStoryModel.state && (
                                <UploadStoryImage mode={mode} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {!showRouterComponent && <Footer />}
        </div>
    );
};

export default Layout;
