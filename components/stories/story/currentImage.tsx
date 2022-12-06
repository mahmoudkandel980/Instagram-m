/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import RouterContext from "../../../context/router-context";
import CurrentStory from "../../../context/currentStory-context";
import ShowHideModels from "../../../context/showHideModels-context";

import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { FaPause, FaPlay, FaVolumeMute } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { TbLocation } from "react-icons/tb";

import timestampCommentsReplaysFun from "../../../helpers/timestampCommentsReplaysFun";
import classes from "./currentImage.module.css";

import { StoryInterface } from "../../../interfaces/stories-interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";

const CurrentImage = (
    props: StoryInterface & ModeInterFace & UserInterface
) => {
    const { imgs, timestamp, userImg, userName, fullName, mode, currentUser } =
        props;

    const [storyIsPlay, setStoryIsPlay] = useState(true);
    const [storyIsLiked, setStoryIsLiked] = useState(false);
    const [replyValue, setReplyValue] = useState("");
    const [width, setWidth] = useState<number>(0);

    const router = useRouter();
    const { story, name, userName: userNameRouter } = router.query;

    const routerCtx = useContext(RouterContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentStoryCtx = useContext(CurrentStory);

    const { showRouterComponentHandler } = routerCtx;
    const { showStorySettingsModelHandler, showStorySettingsModel } =
        showHideModelsCtx;
    const {
        addCurrentStoryHandler,
        buttonClicked,
        buttonClickedHandler,
        getNextStoryHandler,
        getNextStory,
    } = currentStoryCtx;

    // when hide story settings model return play story
    useEffect(() => {
        if (!showStorySettingsModel.state) {
            setStoryIsPlay(true);
        }
    }, [showStorySettingsModel.state]);

    // make sure set this state for false when you arrive to the last story it still with true
    // so we need made it by false when load stories again
    useEffect(() => {
        getNextStoryHandler(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setWidth(0);
        setStoryIsPlay(true);
    }, [userNameRouter, name, story, buttonClicked]);

    // nav story line and route to all stories to all
    useEffect(() => {
        if (storyIsPlay) {
            const widthTimer = setTimeout(() => {
                setWidth((prevState) =>
                    prevState + 1 > 100 ? 100 : prevState + 1
                );
            }, 60);

            if (buttonClicked) {
                clearTimeout(widthTimer);
                buttonClickedHandler(false);
            }

            if (width >= 100) {
                clearTimeout(widthTimer);
                setWidth(99.9999);

                // individual story
                if (userNameRouter && imgs.length > Number(story)) {
                    setWidth(0);

                    router.push(
                        `/stories/${userName}?story=${Number(story) + 1}`,
                        undefined,
                        { scroll: false }
                    );
                }

                // for stories page that has alot of stories
                if (name) {
                    // if user has more than one story
                    if (imgs.length > Number(story)) {
                        setWidth(0);
                        router.push(
                            `stories?name=${name}&story=${Number(story) + 1}`,
                            undefined,
                            { scroll: false }
                        );
                    }

                    // navigate to next user
                    if (imgs.length === Number(story) && !getNextStory) {
                        getNextStoryHandler(true);
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, story, storyIsPlay]);

    useEffect(() => {
        addCurrentStoryHandler(userName, imgs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, userNameRouter]);

    const showRouterCtxHandler = () => {
        showRouterComponentHandler(true);
    };

    const toggleIsliked = () => {
        setStoryIsLiked((prevState) => !prevState);
    };

    const stopStoryHanderl = () => {
        setStoryIsPlay(false);
    };
    const playStoryHandler = () => {
        setStoryIsPlay(true);
    };

    const showStoryModelHandler = () => {
        setStoryIsPlay(false);
        showStorySettingsModelHandler(true, userName);
    };

    const togglePlayStory = () => {
        setStoryIsPlay((prevState) => !prevState);
    };

    const updateReplyValueHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReplyValue(e.target.value);
    };

    // send reply to story user will not doing it in firebase
    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setReplyValue("");
        playStoryHandler();
    };

    return (
        <div className="inline w-full h-full cursor-default">
            {/* stop play story layer */}
            <div
                onClick={togglePlayStory}
                className="absolute top-0 left-0 z-[1] w-full h-full bg-transparent"
            ></div>
            <img
                src={imgs[Number(story) - 1]}
                alt={userName}
                // layout="fill"
                className={`md:rounded-lg select-none h-full w-full object-contain sm:object-contain `}
            />
            {/* story top section */}
            <div
                className={`${classes.currentPhoto} absolute top-0 left-0 w-full h-full`}
            ></div>
            <div
                className={`${classes.fullOpacit} absolute top-0 left-0 z-10 w-full px-3 pt-5 bg-gradient-to-b from-smothDark/50 to-smothDark/[0.02] py-3`}
            >
                {/* story line */}
                <div className="relative w-full h-[2px]">
                    <div className="absolute flex justify-start items-center space-x-0.5 sm:space-x-1 w-full">
                        {imgs.map((img, index) => (
                            <span
                                key={index}
                                className="w-full top-[3px] h-[1.5px] bg-white/30 rounded-full relative"
                            >
                                <span
                                    className={`${
                                        index !== Number(story) - 1 && "hidden"
                                    } absolute -top-[1px]  left-0  h-[3px] bg-white rounded-full duration-75`}
                                    style={{ width: `${width}%` }}
                                ></span>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                    <div className="flex justify-start space-x-2 items-center">
                        {/* profile image */}
                        <div className="rounded-full w-7 h-7 relative cursor-pointer">
                            <Link href={`${userName}`}>
                                <a
                                    className="w-full h-full relative"
                                    onClick={showRouterCtxHandler}
                                >
                                    <div className="w-full h-full relative">
                                        <Image
                                            src={
                                                userImg ||
                                                getPhotoSrcFun(userName)
                                            }
                                            layout="fill"
                                            className="object-cover rounded-full"
                                            alt={"instagram_logo"}
                                            priority
                                        />
                                    </div>
                                </a>
                            </Link>
                        </div>
                        {/* user name */}
                        <div
                            className={`${
                                userName.length > 20 ? "w-32" : "min-w-max"
                            } flex flex-col justify-center -space-y-0.5 flex-wrap`}
                        >
                            <div className="flex justify-start space-x-1.5 items-center w-full">
                                <Link href={`${userName}`}>
                                    <a
                                        onClick={showRouterCtxHandler}
                                        className="text-xs lg:text-[14px] cursor-pointer w-full truncate"
                                    >
                                        {userName}
                                    </a>
                                </Link>
                                <DocumentetedUsers
                                    className="w-3 h-3"
                                    userName={userName}
                                />
                            </div>
                        </div>
                        <div>
                            <span
                                className={`text-gray-100/70 text-xs lg:text-[14px] font-thin lg:pl-1`}
                            >
                                {timestampCommentsReplaysFun(timestamp.seconds)}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-start items-center space-x-3">
                        <span className="cursor-pointer">
                            {storyIsPlay ? (
                                <span onClick={stopStoryHanderl}>
                                    <FaPause className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                                </span>
                            ) : (
                                <span onClick={playStoryHandler}>
                                    <FaPlay className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                                </span>
                            )}
                        </span>
                        <span className="cursor-pointer">
                            <FaVolumeMute className="w-4 lg:w-5 h-4 lg:h-5 text-white" />
                        </span>
                        <span
                            onClick={showStoryModelHandler}
                            className="cursor-pointer"
                        >
                            <BiDotsHorizontalRounded className="w-6 lg:w-7 h-6 lg:h-7 text-white mr-1 lg:mr-2" />
                        </span>
                    </div>
                </div>
            </div>

            {/* story bottom section */}

            <div className="absolute bottom-0 left-0 z-10 w-full px-3 pb-5 bg-gradient-to-t from-smothDark/50 to-smothDark/[0.02] py-3">
                {currentUser.userName !== userName && (
                    <div className="flex justify-start items-center space-x-3">
                        {/* input */}
                        <form className="flex-1 w-20" onSubmit={submitHandler}>
                            <input
                                className=" w-full h-8 lg:h-10 rounded-full pl-4 lg:pl-5 text-white bg-transparent focus:outline-none border-[1px] border-white/90 placeholder:text-white/90 text-[14px]"
                                value={replyValue}
                                onChange={updateReplyValueHandler}
                                onFocus={stopStoryHanderl}
                                onBlur={playStoryHandler}
                                type="text"
                                placeholder={`Reply to ${userName}...`}
                            />
                        </form>

                        {/* heart */}
                        <div onClick={toggleIsliked}>
                            {storyIsLiked ? (
                                <span>
                                    <BsHeartFill className="footerheart text-darkRed w-7 sm:w-6 lg:w-7 h-7 sm:h-6 lg:h-7 cursor-pointer hover:scale-105 duration-200" />
                                </span>
                            ) : (
                                <span>
                                    <AiOutlineHeart
                                        className={`${
                                            mode === "dark"
                                                ? "hover:text-gray-50/50"
                                                : "hover:text-smothDark/70"
                                        } footerheart w-7 sm:w-6 lg:w-7 h-7 sm:h-6 lg:h-7 cursor-pointer hover:scale-105 duration-200`}
                                    />
                                </span>
                            )}
                        </div>

                        <span>
                            <TbLocation
                                className={`${
                                    mode === "dark"
                                        ? "hover:text-gray-50/50"
                                        : "hover:text-smothDark/70"
                                } w-7 sm:w-6 lg:w-7 h-7 sm:h-6 lg:h-7 rotate-12 cursor-pointer hover:scale-105 duration-200`}
                            />
                        </span>
                    </div>
                )}
            </div>

            {/* avoide flickering */}

            <div className="absolute top-[50%] left-[50%]">
                <div
                    className={`${classes.zeroOpacit}  rounded-full w-14 md:w-16 lg:w-24 h-14 md:h-16 lg:h-24 relative cursor-pointer mb-1.5 md:mb-3`}
                >
                    <div>
                        <div className="gradien"></div>
                        <div
                            className={`${
                                mode === "dark" ? "bg-smothDark" : "bg-gray-50"
                            }  grident-transparent`}
                        ></div>
                    </div>
                    <Image
                        src={userImg || getPhotoSrcFun(userName)}
                        layout="fill"
                        className="object-cover rounded-full"
                        alt={"instagram_logo"}
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default CurrentImage;
