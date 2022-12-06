/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";

import DocumentetedUsers from "../../ui/documentetedUsers";

import timestampCommentsReplaysFun from "../../../helpers/timestampCommentsReplaysFun";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import classes from "./currentImage.module.css";

import { BsHeartFill } from "react-icons/bs";
import { TbLocation } from "react-icons/tb";
import { FaPause } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import { StoryInterface } from "../../../interfaces/stories-interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";

const OtherImages = (props: StoryInterface & ModeInterFace & UserInterface) => {
    const { imgs, timestamp, userImg, userName, fullName, mode, currentUser } =
        props;

    return (
        <div className="inline w-full h-full">
            <img
                src={imgs[0]}
                alt={userName}
                // layout="fill"
                className={`md:rounded-lg select-none h-full w-full object-contain sm:object-contain `}
            />
            <div
                className={`${classes.othersPhotos} absolute top-0 left-0 w-full h-full`}
            >
                <div className="hidden sm:flex flex-col justify-center space-y-0.5 md:space-y-1 items-center w-full h-full">
                    <div
                        className={`${classes.fullOpacit} rounded-full w-14 md:w-16 lg:w-24 h-14 md:h-16 lg:h-24 relative cursor-pointer mb-1.5 md:mb-3`}
                    >
                        <div>
                            <div className="gradien"></div>
                            <div
                                className={`bg-smothDark grident-transparent`}
                            ></div>
                        </div>
                        <Image
                            src={userImg || getPhotoSrcFun(userName)}
                            layout="fill"
                            className=" rounded-full object-cover"
                            alt={"instagram_logo"}
                            priority
                        />
                    </div>
                    {/* username */}
                    <div className="flex justify-start space-x-1.5 items-center text-base lg:text-2xl font-semibold">
                        <span className="">{userName}</span>
                        <div>
                            <DocumentetedUsers
                                className="w-5 h-5"
                                userName={userName}
                            />
                        </div>
                    </div>
                    {/* time */}
                    <div>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/70"
                                    : "text-gray-600/70"
                            }text-base lg:text-2xl font-semibold`}
                        >
                            {timestampCommentsReplaysFun(timestamp.seconds)}
                        </span>
                    </div>
                </div>
            </div>
            {/* to avoid flickering */}
            <div
                className={`${classes.zeroOpacit} absolute top-0 left-0 z-10 w-full px-3 pt-5 bg-gradient-to-b from-smothDark/50 to-smothDark/[0.02] py-3`}
            >
                <div className="relative w-full h-[2px]">
                    <span className="absolute top-[3px] w-full h-[2px] bg-white/30 rounded-full"></span>
                    <span
                        className={` absolute top-[2px] left-0 w-0 h-[3px] bg-white rounded-full`}
                    ></span>
                </div>
                <div className="flex justify-between items-center pt-4">
                    <div className="flex justify-start space-x-2 items-center">
                        {/* profile image */}
                        <div className="rounded-full w-7 h-7 relative cursor-pointer">
                            <Image
                                src={userImg || getPhotoSrcFun(userName)}
                                layout="fill"
                                className="object-cover rounded-full"
                                alt={"instagram_logo"}
                                priority
                            />
                        </div>
                        {/* user name */}
                        <div
                            className={`${
                                userName.length > 20 ? "w-32" : "min-w-max"
                            } flex flex-col justify-center -space-y-0.5 flex-wrap`}
                        >
                            <div className="flex justify-start space-x-1.5 items-center w-full">
                                <span className="text-xs lg:text-[14px] cursor-pointer w-full truncate">
                                    {userName}
                                </span>
                                <DocumentetedUsers
                                    className="w-3 h-3"
                                    userName={userName}
                                />
                            </div>
                        </div>
                        <div>
                            <span
                                className={`${
                                    mode === "dark"
                                        ? "text-gray-100/70"
                                        : "text-gray-600/70"
                                } text-xs lg:text-[14px] font-thin lg:pl-1`}
                            >
                                {timestampCommentsReplaysFun(timestamp.seconds)}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-start items-center space-x-3">
                        <span className="cursor-pointer">
                            <FaPause className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                        </span>
                        <span className="cursor-pointer">
                            <FaVolumeMute className="w-4 lg:w-5 h-4 lg:h-5 text-white" />
                        </span>
                        <span className="cursor-pointer">
                            <BiDotsHorizontalRounded className="w-6 lg:w-7 h-6 lg:h-7 text-white mr-1 lg:mr-2" />
                        </span>
                    </div>
                </div>
            </div>
            <div
                className={`${classes.zeroOpacit} absolute  bottom-0 left-0 z-10 w-full px-3 pb-5 bg-gradient-to-t from-smothDark/50 to-smothDark/[0.02] py-3`}
            >
                {currentUser.userName !== userName && (
                    <div className="flex justify-start items-center space-x-3">
                        {/* input */}
                        <input
                            type="text"
                            className="flex-1 w-20 h-8 lg:h-10 rounded-full pl-4 lg:pl-5 text-white bg-transparent focus:outline-none border-[1px] border-white/90 placeholder:text-white/90 text-[14px]"
                            placeholder={`Reply to ${userName}...`}
                        />
                        {/* heart */}
                        <div>
                            <span>
                                <BsHeartFill className="footerheart text-darkRed w-7 sm:w-6 lg:w-7 h-7 sm:h-6 lg:h-7 cursor-pointer hover:scale-105 duration-200" />
                            </span>
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
        </div>
    );
};

export default OtherImages;
