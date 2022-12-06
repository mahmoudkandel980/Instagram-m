import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import ProfileModel from "../../models/profileModel";
import SearchInput from "./searchInput";
import SmallScreensHeader from "./smallScreensHeader";

import ToggleMode from "../../../context/darkMode";
import HideModel from "../../../context/hideModels";
import RouterContext from "../../../context/router-context";
import UserContext from "../../../context/user-context";
import ShowHideModels from "../../../context/showHideModels-context";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { FiSearch } from "react-icons/fi";
import { TbLocation } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { MdAddBox } from "react-icons/md";
import { ImCompass2 } from "react-icons/im";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";

import { ClassNameInterface } from "../../../interfaces/interfaces";

const Header = (props: ClassNameInterface): JSX.Element => {
    const { className } = props;
    const [showHideProfileModel, setShowHideProfileModel] = useState(true);
    const [showModel, setShowModel] = useState(false);
    const [showSearchInputsm, setShowSearchInputsm] = useState(false);

    const router = useRouter();
    const { asPath } = router;
    const { postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const userCtx = useContext(UserContext);
    const hideModelCtx = useContext(HideModel);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { mode, toggleMode } = modeCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { userData } = userCtx;
    const { showPostModel, showPostModelHandler, editProfileModel } =
        showHideModelsCtx;
    const {
        toggleProfileModel,
        toggleProfileModelHandler,
        toggleShowHideAllModels,
        //
        toggleShowHideAllModelsHandler,
    } = hideModelCtx;

    useEffect(() => {
        if (showModel && !toggleProfileModel) {
            setShowModel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleShowHideAllModels]);

    const showModelHandler = () => {
        toggleProfileModelHandler(true);
        setShowModel((prevState) => !prevState);
    };

    const toggleCurrentModeHandler = () => {
        if (mode === "dark") {
            toggleMode("light");
        } else {
            toggleMode("dark");
        }
    };

    useEffect(() => {
        toggleShowHideAllModelsHandler(showHideProfileModel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showHideProfileModel]);

    const hideModelHandler = () => {
        setShowHideProfileModel((prevState) => !prevState);
        toggleShowHideAllModelsHandler(showHideProfileModel);
        if (toggleProfileModel) {
            toggleProfileModelHandler(false);
        }
    };

    const toggleSearchInputsm = () => {
        setShowSearchInputsm((prevState) => !prevState);
    };

    // routerModel
    const showRouterModelHandler = () => {
        if (router.asPath === "/") {
            return;
        } else {
            showRouterComponentHandler(true);
        }
    };

    // toggle post model
    const showHidePostHandlerFun = () => {
        if (showPostModel.state) {
            showPostModelHandler(false, "");
        } else {
            showPostModelHandler(true, userData.userName);
        }
    };

    return (
        <div
            onClick={hideModelHandler}
            className={`${mode === "dark" ? "bg-dark" : "bg-white"} ${
                postId && "hidden sm:block"
            } ${
                asPath.includes("/stories") && "hidden"
            } ${className} shadow-md z-[1000] fixed bottom-0 sm:top-0 h-10 sm:h-12 w-full bg-opacity-90 select-none`}
        >
            <div className="container sm:mx-auto sm:px-0 md:px-5 lg:px-20 xl:px-40 2xl:px-60 ">
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-between px-5 sm:px-0 sm:justify-center sm:gap-x-5 lg:gap-x-10 xl:gap-x-20 2xl:gap-x-32 py-1">
                    {/* Small Screens */}
                    <SmallScreensHeader mode={mode} />

                    {/* Left Logo*/}
                    <div className="hidden sm:block">
                        <div className="w-36 h-10 cursor-pointer flex">
                            <Link href={`/`}>
                                <a
                                    className="relative w-36 h-10 cursor-pointer overflow-hidden"
                                    onClick={showRouterModelHandler}
                                >
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
                                </a>
                            </Link>
                        </div>
                    </div>

                    {/* search */}
                    <div className="hidden sm:block">
                        <SearchInput mode={mode} />
                    </div>

                    {/* Right Icons */}
                    <div
                        className={`${
                            mode === "dark" ? "text-white" : "text-dark"
                        } w-full flex justify-between sm:justify-start  items-center  space-x-3 lg:space-x-4 2xl:space-x-6`}
                    >
                        <div
                            className={`${
                                showSearchInputsm && "hidden sm:block"
                            }`}
                        >
                            <Link href={`/`}>
                                <a onClick={showRouterModelHandler}>
                                    <IoHomeOutline
                                        className={`${
                                            asPath === "/" && "hidden"
                                        } w-6 h-6 cursor-pointer hover:scale-110 duration-200`}
                                    />
                                    <IoHomeSharp
                                        className={` ${
                                            asPath !== "/" && "hidden"
                                        } w-6 h-6 cursor-pointer hover:scale-110 duration-200`}
                                    />
                                </a>
                            </Link>
                        </div>
                        <span
                            onClick={toggleSearchInputsm}
                            className=" block sm:hidden"
                        >
                            <FiSearch className="w-6 h-6 cursor-pointer hover:scale-110 duration-200" />
                        </span>

                        <div
                            className={`${
                                !showSearchInputsm && "hidden"
                            } sm:hidden`}
                        >
                            <SearchInput mode={mode} />
                        </div>

                        <span className="hidden sm:block">
                            <TbLocation className="w-6 h-6 rotate-12 cursor-pointer hover:scale-110 duration-200" />
                        </span>
                        <div
                            className={`${
                                showSearchInputsm && "hidden sm:block"
                            } w-6 h-6`}
                        >
                            <span
                                onClick={showHidePostHandlerFun}
                                className="w-6 h-6 rounded-sm overflow-hidden"
                            >
                                <CgAddR
                                    className={`${
                                        showPostModel.state && "hidden"
                                    } w-full h-full cursor-pointer hover:scale-110 duration-200`}
                                />
                                <MdAddBox
                                    className={`${
                                        !showPostModel.state && "hidden"
                                    } w-full h-full cursor-pointer hover:scale-110 duration-200`}
                                />
                            </span>
                        </div>
                        <div className="hidden sm:block">
                            <ImCompass2 className="w-6 h-6 rotate-180 cursor-pointer hover:scale-110 duration-200" />
                        </div>
                        <div
                            className={`${
                                showSearchInputsm && "hidden sm:block"
                            }`}
                        >
                            <AiOutlineHeart className="w-7 h-7 cursor-pointer hover:scale-110 duration-200" />
                        </div>
                        <div
                            className={`${
                                showSearchInputsm && "hidden sm:block"
                            } relative w-7 h-7 flex items-center justify-center rounded-full cursor-pointer`}
                        >
                            <div
                                className={`${
                                    showModel || router.pathname === "/profile"
                                        ? mode === "dark"
                                            ? " ring-white/90"
                                            : " ring-smothDark/90"
                                        : "ring-transparent"
                                } absolute ring-[1px] rounded-full w-[110%] h-[110%]`}
                            ></div>
                            {userData && (
                                <Image
                                    onClick={showModelHandler}
                                    src={
                                        asPath === "/profile"
                                            ? editProfileModel.image ===
                                                  undefined ||
                                              editProfileModel.image === null
                                                ? userData.userImg ||
                                                  getPhotoSrcFun(
                                                      userData.userName
                                                  )
                                                : window.URL.createObjectURL(
                                                      editProfileModel.image[0]
                                                  )
                                            : userData.userImg ||
                                              getPhotoSrcFun(userData.userName)
                                    }
                                    layout="fill"
                                    className="rounded-full"
                                    alt={"profile photo"}
                                    priority
                                />
                            )}
                            <div>
                                <ProfileModel
                                    mode={mode}
                                    showModel={showModel}
                                    showModelHandler={showModelHandler}
                                    toggleCurrentModeHandler={
                                        toggleCurrentModeHandler
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
