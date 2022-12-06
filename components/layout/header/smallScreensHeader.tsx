import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import RouterContext from "../../../context/router-context";
import ToggleLikeUnfollowModel from "../../../context/removeFollwersUnfollowingModel-context";
import ShowHideModels from "../../../context/showHideModels-context";
import UserContext from "../../../context/user-context";

import { BsCamera } from "react-icons/bs";
import { TbLocation } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";

import { ModeInterFace } from "../../../interfaces/interfaces";

const SmallScreensHeader = (props: ModeInterFace) => {
    const { mode } = props;

    const router = useRouter();
    const pathname = router.pathname;
    const { pop } = router.query;

    const routerCtx = useContext(RouterContext);
    const toggleUnfollowModeCtx = useContext(ToggleLikeUnfollowModel);
    const userCtx = useContext(UserContext);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { showRouterComponentHandler } = routerCtx;
    const { showUnfollowModel } = toggleUnfollowModeCtx;
    const { userData } = userCtx;
    const {
        showStoryModelHandler,
        showStoryModel,
        showPostModel,
        showLikesModel,
        editProfileModel,
    } = showHideModelsCtx;

    const backHandler = () => {
        router.back();
    };

    // routerModel
    const showRouterModelHandler = () => {
        if (router.asPath === "/") {
            return;
        } else {
            showRouterComponentHandler(true);
        }
    };

    const showStoryModelHandlerFun = () => {
        showStoryModelHandler(true, userData.userName);
    };

    return (
        <div
            className={`${
                mode === "dark"
                    ? "bg-dark text-white"
                    : "bg-white text-smothDark border-b-[1px]"
            } ${
                pop ||
                showPostModel.state ||
                showStoryModel.state ||
                editProfileModel.showProfileImageModel ||
                (showLikesModel.state && !showUnfollowModel)
                    ? "hidden"
                    : "flex"
            } select-none w-full items-center justify-between px-3 fixed space-x-5 left-0 top-0 h-12 sm:hidden`}
        >
            <div>
                <span
                    className={`${pathname === "/explore/people" && "hidden"}`}
                    onClick={showStoryModelHandlerFun}
                >
                    <BsCamera
                        className={`w-7 h-7 cursor-pointer hover:scale-110 duration-200`}
                    />
                </span>
                <div onClick={backHandler}>
                    <IoIosArrowBack
                        className={`${
                            pathname !== "/explore/people" && "hidden"
                        } w-7 h-7 cursor-pointer hover:scale-110 duration-200`}
                    />
                </div>
            </div>
            <div className="w-40 h-10 relative cursor-pointer overflow-hidden">
                <Link href={"/"}>
                    <a
                        className="w-40 h-10 relative"
                        onClick={showRouterModelHandler}
                    >
                        <div className="w-40 h-10 relative">
                            <Image
                                src={`/images/Instagram_logo.png`}
                                layout="fill"
                                className={`${
                                    mode === "dark" &&
                                    "invert sepia contrast-200 saturate-200 hue-rotate-90"
                                } object-contain`}
                                alt={"instagram_logo"}
                                priority
                            />
                        </div>
                    </a>
                </Link>
            </div>
            <div>
                <TbLocation className="w-6 h-6 rotate-12 cursor-pointer hover:scale-110 duration-200" />
            </div>
        </div>
    );
};

export default SmallScreensHeader;
