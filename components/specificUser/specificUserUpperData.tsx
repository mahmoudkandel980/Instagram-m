import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import ToggleMode from "../../context/darkMode";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import CurrentStory from "../../context/currentStory-context";

import SuggestedPeople from "./suggestions/suggestedPeople";
import Spinner from "../ui/spinner";
import DocumentetedUsers from "../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { FaUserCheck } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

import { PostsInterface } from "../../interfaces/posts-interfaces";
import { SpecificUserInterface } from "../../interfaces/specificUser-interface";
import {
    StoriesInterface,
    StoryInterface,
} from "../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../interfaces/user-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SpecificUserUpperData = (
    props: SpecificUserInterface &
        PostsInterface &
        UserInterface &
        AllUsersInterface &
        StoriesInterface
): JSX.Element => {
    const { posts, currentUser, allUsers, stories } = props;
    const { followers, following, fullName, userImg, userName, caption } =
        props.user;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);
    const [showSuggessedPeopleModel, setShowSuggessedPeopleModel] =
        useState(false);
    const [buttonState, setButtonState] = useState("follow");

    const router = useRouter();
    const aspath = router.asPath;

    const modeCtx = useContext(ToggleMode);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentStoryCtx = useContext(CurrentStory);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { mode } = modeCtx;
    const { setSpecificUserQueryHandler } = showHideModelsCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const {
        following: followingCtx,
        unfollowingModel,
        addToFollowing,
        removeFromFollowing,
        unfollowingModelHandler,
    } = currentUserFollowingCtx;

    // when hide unfollowing model need to render following
    //  again to remove spinner button state and get following or follow
    useEffect(() => {
        if (!unfollowingModel.showUnfollowingModel) {
            setTimeout(() => {
                setButtonState("follow");
                followingCtx.forEach((singleFollowing) => {
                    if (singleFollowing.userName === userName) {
                        setButtonState("following");
                        return;
                    }
                });
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unfollowingModel.showUnfollowingModel]);

    // make suggestion people hidden when routing
    useEffect(() => {
        if (showSuggessedPeopleModel === false) {
            setShowSuggessedPeopleModel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aspath]);

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    // check if user in the follwing of current user or not
    useEffect(() => {
        setButtonState("follow");
        followingCtx.forEach((singleFollowing) => {
            if (singleFollowing.userName === userName) {
                setButtonState("following");
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingCtx]);

    const setSpecificUserQueryHandlerFun = () => {
        setSpecificUserQueryHandler("posts");
    };

    // find if user has a story
    useEffect(() => {
        stories.forEach((story) => {
            if (story.userName === userName) {
                setUserStory(story);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stories]);

    const imageClickHandler = (userName: string) => {
        setStoryClicked(true);
        setBackPageHandler(router.asPath);

        setTimeout(() => {
            router.push(`/stories/${userName}?story=1`, undefined, {
                scroll: false,
            });
        }, 1500);
    };

    const toggleSuggestedPeopleHandler = () => {
        setShowSuggessedPeopleModel((prevState) => !prevState);
    };

    const toggleFollowFollowing = async (
        userName: string,
        fullName: string,
        userImg: string
    ) => {
        if (buttonState === "follow") {
            // firebase follow
            setButtonState("pending");
            setTimeout(() => {
                addToFollowing(
                    userName,
                    fullName,
                    userImg || getPhotoSrcFun(userName),
                    currentUser.userName,
                    currentUser.fullName,
                    currentUser.userImg
                );
                setButtonState("following");
            }, 1500);
        } else if (buttonState === "following") {
            // firebase unfollow
            setButtonState("pending");
            unfollowingModelHandler(
                true,
                userName,
                fullName,
                userImg || getPhotoSrcFun(userName),
                currentUser.userName,
                currentUser.fullName,
                currentUser.userImg
            );
        }
    };

    return (
        <>
            {/* big screens */}
            <div className="z-10 lg:px-[70px] xl:px-[70px] 2xl:px-[70px] hidden sm:flex justify-start items-start space-x-24">
                <div className="w-36 h-36 relative group rounded-full">
                    {userStory && (
                        <div key={userStory.userName}>
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
                    {/* username */}
                    <Image
                        onClick={
                            userStory && imageClickHandler.bind(null, userName)
                        }
                        src={userImg || getPhotoSrcFun(userName)}
                        alt={`${fullName} profile photo`}
                        layout="fill"
                        className="cursor-pointer rounded-full"
                        priority
                    />
                </div>
                <div className="flex flex-col justify-start space-y-5">
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
                        <span
                            className={` ${
                                mode === "dark"
                                    ? "border-white/30"
                                    : "border-smothDark/30"
                            } border-[1px] block mx-5 mr-2 p-3 py-1 rounded-lg`}
                        >
                            Message
                        </span>
                        <span
                            className={`${
                                mode === "dark" && buttonState === "following"
                                    ? "bg-gray-600/20 p-3 py-[7px]"
                                    : buttonState === "follow"
                                    ? "bg-lightBlue p-3 py-1"
                                    : buttonState === "pending"
                                    ? mode === "dark"
                                        ? "border-white/20 p-1 pb-2 border-[1px] py-2"
                                        : "border-dark/20 p-1 pb-2 border-[1px] py-2"
                                    : "bg-darkGray/5 p-3 py-2"
                            }  block ml-2 mr-2 rounded-lg`}
                        >
                            {buttonState === "following" ? (
                                <span
                                    onClick={toggleFollowFollowing.bind(
                                        null,
                                        userName,
                                        fullName,
                                        userImg
                                    )}
                                    className="cursor-pointer"
                                >
                                    <FaUserCheck className="w-5 h-5 " />
                                </span>
                            ) : buttonState === "follow" ? (
                                <span
                                    onClick={toggleFollowFollowing.bind(
                                        null,
                                        userName,
                                        fullName,
                                        userImg
                                    )}
                                    className={`text-white font-semibold cursor-pointer`}
                                >
                                    Follow
                                </span>
                            ) : (
                                <Spinner className="scale-[0.2] pl-6 mr-2 mb-[5px] w-6 h-3" />
                            )}
                        </span>
                        {/* arrow */}
                        <span
                            onClick={toggleSuggestedPeopleHandler}
                            className={` ${
                                mode === "dark"
                                    ? "border-white/30"
                                    : "border-smothDark/30"
                            } border-[1px] block ml-2 p-1.5 rounded-lg cursor-pointer`}
                        >
                            <IoIosArrowDown
                                className={`${
                                    showSuggessedPeopleModel
                                        ? "-rotate-180"
                                        : "rotate-0"
                                } w-5 h-5 duration-300`}
                            />
                        </span>
                    </div>
                    <div className="flex justify-start space-x-16 items-center mr-5">
                        {/* posts */}
                        <div
                            onClick={setSpecificUserQueryHandlerFun}
                            className="cursor-pointer"
                        >
                            <span className="font-bold">
                                {(posts.length = 0 ? 0 : posts.length)}
                            </span>{" "}
                            <span className="font-thin">posts</span>
                        </div>
                        {/* followers */}
                        <div>
                            <Link
                                href={`${userName}?pop=followers`}
                                scroll={false}
                            >
                                <a>
                                    <span className="font-bold">
                                        {
                                            (followers.length = 0
                                                ? 0
                                                : followers.length)
                                        }
                                    </span>{" "}
                                    <span className="font-thin">followers</span>
                                </a>
                            </Link>
                        </div>
                        {/* following */}
                        <div>
                            <Link
                                href={`${userName}?pop=following`}
                                scroll={false}
                            >
                                <a>
                                    <span className="font-bold">
                                        {
                                            (following.length = 0
                                                ? 0
                                                : following.length)
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
                        <p className="font-thin pt-3">{caption}</p>
                    </div>
                </div>
            </div>

            {/* small screens */}
            <div className="z-10 lg:px-[70px] xl:px-[70px] 2xl:px-[70px] block sm:hidden">
                <div className="flex justify-start items-start mt-5 ml-2">
                    <div className="w-20 h-20 relative rounded-full">
                        {/* username */}

                        {userStory && (
                            <div key={userStory.userName}>
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
                        <Image
                            onClick={
                                userStory &&
                                imageClickHandler.bind(null, userName)
                            }
                            src={userImg || getPhotoSrcFun(userName)}
                            alt={`${fullName} profile photo`}
                            layout="fill"
                            className="rounded-full cursor-pointer"
                            priority
                        />
                    </div>

                    <div className="flex flex-col justify-center items-start space-y-2 ml-6">
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
                            className={` flex justify-start items-center pl-0 p-5 py-1 rounded-lg`}
                        >
                            <span
                                className={`${
                                    mode === "dark"
                                        ? "border-white/30"
                                        : "border-smothDark/30"
                                } border-[1px] text-sm block mr-1.5 p-2 py-1 rounded-lg`}
                            >
                                Message
                            </span>
                            <span
                                className={`${
                                    mode === "dark" &&
                                    buttonState === "following"
                                        ? "bg-gray-600/20 p-3 py-[6px]"
                                        : buttonState === "follow"
                                        ? "bg-lightBlue p-3 py-[3px]"
                                        : buttonState === "pending"
                                        ? mode === "dark"
                                            ? "border-white/20  border-[1px] p-0 py-[2px]"
                                            : "border-dark/20 border-[1px] p-0 py-[2px]"
                                        : "bg-darkGray/5 p-3 py-[3px]"
                                } block p-2 rounded-lg`}
                            >
                                {buttonState === "following" ? (
                                    <span
                                        onClick={toggleFollowFollowing.bind(
                                            null,
                                            userName,
                                            fullName,
                                            userImg
                                        )}
                                        className="cursor-pointer"
                                    >
                                        <FaUserCheck className="w-5 h-5" />
                                    </span>
                                ) : buttonState === "follow" ? (
                                    <span
                                        onClick={toggleFollowFollowing.bind(
                                            null,
                                            userName,
                                            fullName,
                                            userImg
                                        )}
                                        className={`text-white text-sm font-semibold cursor-pointer`}
                                    >
                                        Follow
                                    </span>
                                ) : (
                                    <Spinner className="scale-[0.2] mb-2 pl-10 mr-[3px] w-6 h-4" />
                                )}
                            </span>{" "}
                            <span
                                onClick={toggleSuggestedPeopleHandler}
                                className={` ${
                                    mode === "dark"
                                        ? "border-white/30"
                                        : "border-smothDark/30"
                                } border-[1px] block ml-2 p-[3px] rounded-lg cursor-pointer`}
                            >
                                <IoIosArrowDown
                                    className={`${
                                        showSuggessedPeopleModel
                                            ? "-rotate-180"
                                            : "rotate-0"
                                    } w-5 h-5 duration-300`}
                                />
                            </span>
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
                        <div
                            onClick={setSpecificUserQueryHandlerFun}
                            className="flex flex-col justify-center items-center pl-2 cursor-pointer"
                        >
                            <span className="font-bold">
                                {(posts.length = 0 ? 0 : posts.length)}
                            </span>
                            <span className="font-thin">posts</span>
                        </div>
                        {/* followers */}
                        <Link href={`${userName}?pop=followers`} scroll={false}>
                            <a className="flex flex-col justify-center items-center pl-3">
                                <span className="font-bold">
                                    {
                                        (followers.length = 0
                                            ? 0
                                            : followers.length)
                                    }
                                </span>
                                <span className="font-thin">followers</span>
                            </a>
                        </Link>
                        {/* following */}
                        <Link href={`${userName}?pop=following`} scroll={false}>
                            <a className="flex flex-col justify-center items-center pr-2">
                                <span className="font-bold">
                                    {
                                        (following.length = 0
                                            ? 0
                                            : following.length)
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
                        <p className="font-thin pt-1">{caption}</p>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showSuggessedPeopleModel && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            transform: "scale(0.5)",
                            top: "50px",
                        }}
                        animate={{
                            opacity: 1,
                            transform: "scale(1)",
                            top: "5px",
                        }}
                        exit={{
                            opacity: 0,
                            transform: "scale(0.5)",
                            top: "0px",
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                    >
                        {showSuggessedPeopleModel && (
                            <SuggestedPeople
                                allUsers={allUsers}
                                currentUser={currentUser}
                                posts={posts}
                                stories={stories}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SpecificUserUpperData;
