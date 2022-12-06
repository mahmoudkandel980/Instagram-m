import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import ToggleMode from "../../context/darkMode";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import CurrentStory from "../../context/currentStory-context";

import CaptionInputModel from "../models/CaptionInputModel";
import UploadProfileImage from "../models/uploadProfileImage";
import DocumentetedUsers from "../ui/documentetedUsers";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { BsGearFill, BsFillCameraFill } from "react-icons/bs";

import { PostsInterface } from "../../interfaces/posts-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../interfaces/stories-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const ProfileUpperData = (
    props: UserInterface & PostsInterface & StoriesInterface
): JSX.Element => {
    const { followers, following, fullName, userImg, userName, caption } =
        props.currentUser;
    const { posts, stories } = props;

    const [currentUserStory, setCurrentUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);

    const router = useRouter();
    const pathname = router.pathname;

    const modeCtx = useContext(ToggleMode);
    const currentStoryCtx = useContext(CurrentStory);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const showHideModelsCtx = useContext(ShowHideModels);
    const { setBackPageHandler } = currentStoryCtx;
    const { following: followingCtx, followers: followersCtx } =
        currentUserFollowingCtx;

    const { mode } = modeCtx;
    const {
        setProfileQueryHandler,
        editProfileModelHandler,
        editProfileModel,
    } = showHideModelsCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    const setProfileQueryHandlerFun = () => {
        setProfileQueryHandler("posts");
    };

    // find if current user has a story
    useEffect(() => {
        stories.forEach((story) => {
            if (story.userName === userName) {
                setCurrentUserStory(story);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stories]);

    // change profile data (caption)
    const showEditProfileModelHandler = () => {
        editProfileModelHandler(
            true,
            editProfileModel.caption || caption,
            false,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    // close edit profile model
    const hideEditProfileModelHandler = () => {
        editProfileModelHandler(
            false,
            "",
            false,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    const showCationInputHandler = () => {
        editProfileModelHandler(
            false,
            editProfileModel.caption || caption,
            true,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    // change profile data (profilePic)
    const changeProfilePicHandler = () => {
        editProfileModelHandler(
            false,
            editProfileModel.caption || caption,
            editProfileModel.showCaptionInput,
            editProfileModel.image,
            true
        );
    };

    const onClickInProfilePicHandler = () => {
        setStoryClicked(true);
        setBackPageHandler(router.asPath);

        if (currentUserStory) {
            setTimeout(() => {
                router.push(
                    `/stories?name=${currentUserStory.userName}&story=1`,
                    undefined,
                    {
                        scroll: false,
                    }
                );
            }, 1500);
        }
    };

    return (
        <>
            {/* big screens */}
            <div className=" hidden sm:flex justify-start items-start space-x-24">
                <div className="w-36 h-36 relative group rounded-full">
                    {currentUserStory && (
                        <div key={currentUserStory.userName}>
                            <div
                                className={`${
                                    storyClicked
                                        ? "gradien-lg-animated"
                                        : "grident-lg"
                                }`}
                            ></div>
                            <div
                                className={`${
                                    mode === "dark" ? "bg-dark" : "bg-gray-50"
                                } grident-lg-transparent`}
                            ></div>
                        </div>
                    )}

                    <div className="w-full h-full relative group overflow-hidden rounded-full">
                        {/* username */}
                        <Image
                            onClick={
                                currentUserStory && onClickInProfilePicHandler
                            }
                            src={
                                editProfileModel.image === undefined ||
                                editProfileModel.image === null
                                    ? userImg || getPhotoSrcFun(userName)
                                    : window.URL.createObjectURL(
                                          editProfileModel.image[0]
                                      )
                            }
                            alt={`${fullName} profile photo`}
                            layout="fill"
                            className="cursor-pointer "
                            priority
                        />
                        <div
                            className={`bg-smothDark/10 text-white absolute w-full h-full bottom-0 left-0 translate-y-36 group-hover:translate-y-0 duration-1000 flex justify-center items-center cursor-pointer`}
                        >
                            <div
                                onClick={changeProfilePicHandler}
                                className="cursor-pointer hover:scale-125 duration-200"
                            >
                                <BsFillCameraFill className={` w-8 h-8`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-start space-y-5 min-w-[40%]">
                    <div className="flex justify-start items-center">
                        {/* username */}
                        <h1
                            className={`${
                                userName.length > 15 && "w-40 truncate"
                            } text-2xl font-thin pr-2`}
                        >
                            {userName}
                        </h1>
                        <DocumentetedUsers
                            className="w-5 h-5"
                            userName={userName}
                        />
                        <div
                            onClick={showEditProfileModelHandler}
                            className={`${
                                mode === "dark"
                                    ? "bg-gray-600/20 hover:text-gray-50/50"
                                    : "bg-darkGray/5 hover:text-smothDark/70"
                            } flex justify-start space-x-2 items-center mx-5 mr-2 p-3 py-1 rounded-lg cursor-pointer duration-200 group`}
                        >
                            <span>Edit Profile</span>
                            <span>
                                <BsGearFill
                                    className={`w-5 h-5 group-hover:rotate-180 group-hover:scale-105 duration-500`}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mr-5">
                        {/* posts */}
                        <Link href={`${pathname}`} scroll={false}>
                            <a onClick={setProfileQueryHandlerFun}>
                                <span className="font-bold">
                                    {(posts.length = 0 ? 0 : posts.length)}
                                </span>{" "}
                                <span className="font-thin">posts</span>
                            </a>
                        </Link>
                        {/* followers */}
                        <div>
                            <Link
                                href={`${pathname}?pop=followers`}
                                scroll={false}
                            >
                                <a>
                                    <span className="font-bold">
                                        {
                                            (followersCtx.length! = 0
                                                ? 0
                                                : followersCtx.length!)
                                        }
                                    </span>{" "}
                                    <span className="font-thin">followers</span>
                                </a>
                            </Link>
                        </div>
                        {/* following */}
                        <div>
                            <Link
                                href={`${pathname}?pop=following`}
                                scroll={false}
                            >
                                <a>
                                    <span className="font-bold">
                                        {
                                            (followingCtx.length = 0
                                                ? 0
                                                : followingCtx.length)
                                        }
                                    </span>{" "}
                                    <span className="font-thin">following</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div>
                        {/* username */}
                        <h3
                            className={`${
                                userName.length > 15 && "w-40 truncate"
                            } font-bold capitalize`}
                        >
                            {fullName}
                        </h3>
                        {/* caption */}
                        <p className="font-thin pt-3">
                            {editProfileModel.caption || caption}
                        </p>
                    </div>
                </div>
            </div>

            {/* small screens */}
            <div className="block sm:hidden">
                <div className="flex justify-start items-start mt-5 ml-2">
                    <div className="w-20 h-20 relative rounded-full">
                        {currentUserStory && (
                            <div key={currentUserStory.userName}>
                                <div
                                    className={`${
                                        storyClicked
                                            ? "gradien-animated"
                                            : "gradien"
                                    }`}
                                ></div>
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-dark"
                                            : "bg-gray-50"
                                    } grident-transparent`}
                                ></div>
                            </div>
                        )}
                        <div className="w-full h-full relative overflow-hidden rounded-full">
                            {/* username */}
                            <Image
                                onClick={
                                    currentUserStory &&
                                    onClickInProfilePicHandler
                                }
                                src={
                                    editProfileModel.image === undefined ||
                                    editProfileModel.image === null
                                        ? userImg || getPhotoSrcFun(userName)
                                        : window.URL.createObjectURL(
                                              editProfileModel.image[0]
                                          )
                                }
                                alt={`${fullName} profile photo`}
                                layout="fill"
                                className="rounded-full cursor-pointer"
                                priority
                            />
                            <div
                                className={`bg-smothDark/10 text-white absolute w-full h-[35%] bottom-0 left-0 flex justify-center items-center cursor-pointer`}
                            >
                                <div
                                    onClick={changeProfilePicHandler}
                                    className="cursor-pointer hover:scale-125 duration-200"
                                >
                                    <BsFillCameraFill className={` w-5 h-5`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center space-y-2 ml-6">
                        {/* username */}
                        <div className="flex justify-start items-center">
                            <h1
                                className={`${
                                    userName.length > 15 && "w-40 truncate"
                                } text-xl font-thin pr-2 flex-1 `}
                            >
                                {userName}
                            </h1>
                            <DocumentetedUsers
                                className="w-5 h-5"
                                userName={userName}
                            />
                        </div>
                        <div
                            onClick={showEditProfileModelHandler}
                            className={`${
                                mode === "dark"
                                    ? "bg-gray-600/20 hover:text-gray-50/50"
                                    : "bg-darkGray/5 hover:text-smothDark/70"
                            } flex justify-start items-center p-5 py-1 rounded-lg cursor-pointer duration-200 group`}
                        >
                            <span className={`block mx-5 mr-2`}>
                                Edit Profile
                            </span>
                            <div>
                                <BsGearFill
                                    className={`w-5 h-5 group-hover:rotate-180 group-hover:scale-105 duration-500`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse">
                    <div
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/20"
                                : "border-darkGray/5 "
                        } flex justify-between items-center border-y-[1px] py-2 px-1`}
                    >
                        {/* posts */}
                        <Link href={`${pathname}`} scroll={false}>
                            <a
                                onClick={setProfileQueryHandlerFun}
                                className="flex flex-col justify-center items-center pl-2"
                            >
                                <span className="font-bold">
                                    {(posts.length = 0 ? 0 : posts.length)}
                                </span>
                                <span className="font-thin">posts</span>
                            </a>
                        </Link>
                        {/* followers */}
                        <Link href={`${pathname}?pop=followers`} scroll={false}>
                            <a className="flex flex-col justify-center items-center pl-3">
                                <span className="font-bold">
                                    {
                                        (followersCtx.length = 0
                                            ? 0
                                            : followersCtx.length)
                                    }
                                </span>
                                <span className="font-thin">followers</span>
                            </a>
                        </Link>
                        {/* following */}
                        <Link href={`${pathname}?pop=following`} scroll={false}>
                            <a className="flex flex-col justify-center items-center pr-2">
                                <span className="font-bold">
                                    {
                                        (followingCtx.length = 0
                                            ? 0
                                            : followingCtx.length)
                                    }
                                </span>
                                <span className="font-thin">following</span>
                            </a>
                        </Link>
                    </div>
                    <div className="ml-5 mt-5 mb-5">
                        {/* username */}
                        <h3
                            className={`${
                                userName.length > 15 && "w-40 truncate"
                            } font-bold capitalize`}
                        >
                            {fullName}
                        </h3>
                        {/* caption */}
                        <p className="font-thin pt-1">
                            {editProfileModel.caption || caption}
                        </p>
                    </div>
                </div>
            </div>

            {/* toggle edit profile model */}
            <AnimatePresence>
                {(editProfileModel.state ||
                    editProfileModel.showProfileImageModel ||
                    editProfileModel.showCaptionInput) && (
                    <motion.div
                        className="top-50 left-0 fixed w-full h-full z-[100]"
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
                        {editProfileModel.state && (
                            <div className="absolute z-10 top-0 left-0 w-full h-full">
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-dark/30"
                                            : "bg-dark/30"
                                    } w-full h-full`}
                                    onClick={hideEditProfileModelHandler}
                                ></div>

                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-smothDark text-white"
                                            : "bg-gray-100 text-smothDark"
                                    }  fixed z-[110] top-[50%] left-0 sm:left-[50%] w-[70%] sm:w-96 rounded-md translate-x-[15%] -translate-y-48 sm:-translate-x-48 sm:-translate-y-48`}
                                >
                                    <div className="w-full flex flex-col justify-center items-center">
                                        <div
                                            className={`${
                                                mode === "dark"
                                                    ? "border-gray-600/40"
                                                    : "border-gray-600/10"
                                            }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                                        >
                                            <button
                                                onClick={showCationInputHandler}
                                            >
                                                {caption.length > 0
                                                    ? "Change caption"
                                                    : "Add caption"}
                                            </button>
                                        </div>
                                        <div
                                            className={`flex justify-center items-center py-3 w-full text-sm`}
                                        >
                                            <button
                                                onClick={
                                                    hideEditProfileModelHandler
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {editProfileModel.showCaptionInput && (
                            <CaptionInputModel mode={mode} />
                        )}
                        {editProfileModel.showProfileImageModel && (
                            <UploadProfileImage mode={mode} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfileUpperData;
