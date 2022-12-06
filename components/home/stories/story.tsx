import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import ToggleMode from "../../../context/darkMode";
import ShowHideModels from "../../../context/showHideModels-context";
import CurrentStory from "../../../context/currentStory-context";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { AiFillPlusCircle } from "react-icons/ai";

import { StoryInterface } from "../../../interfaces/stories-interfaces";
import { IndexInterface } from "../../../interfaces/interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";

const Story = (props: StoryInterface & IndexInterface & ModeInterFace) => {
    const { userName, imgs, userImg, index } = props;

    const [storyClicked, setStoryClicked] = useState(false);

    const router = useRouter();

    const modeCtx = useContext(ToggleMode);
    const currentStoryCtx = useContext(CurrentStory);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { mode } = modeCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const { showStoryModelHandler } = showHideModelsCtx;

    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    // go to stories page
    const imageClickHandler = () => {
        setStoryClicked(true);
        setBackPageHandler(router.asPath);

        setTimeout(() => {
            router.push(`/stories?name=${userName}&story=1`, undefined, {
                scroll: false,
            });
        }, 1500);
    };

    // upload story
    const uploadStoryPhotoHandler = (userName: string) => {
        showStoryModelHandler(true, userName);
    };

    return (
        <>
            {index === 0 ? (
                <div className="flex flex-col items-center justify-center w-14 z-10 relative">
                    <div className="rounded-full w-14 h-14 relative cursor-pointer">
                        <div
                            className={`${
                                mode === "dark" ? "bg-dark" : "bg-gray-50"
                            } grident-transparent`}
                        ></div>
                        <Image
                            onClick={uploadStoryPhotoHandler.bind(
                                null,
                                userName
                            )}
                            src={userImg}
                            alt={userName}
                            layout="fill"
                            className="rounded-full object-cover"
                        />
                        <span
                            onClick={uploadStoryPhotoHandler.bind(
                                null,
                                userName
                            )}
                            className="absolute bottom-0 right-0"
                        >
                            <AiFillPlusCircle
                                className={`${
                                    mode === "dark" ? "bg-dark" : "bg-white"
                                } text-lightBlue p-[1px] rounded-full w-5 h-5`}
                            />
                        </span>
                    </div>
                    <span
                        onClick={uploadStoryPhotoHandler.bind(null, userName)}
                        className="w-16 text-[12px] text-center"
                    >
                        Your Story
                    </span>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-14 z-10 relative">
                    <div className="rounded-full w-14 h-14 relative cursor-pointer">
                        <div
                            className={`${
                                storyClicked ? "gradien-animated" : "gradien"
                            }`}
                        ></div>
                        <div
                            className={`${
                                mode === "dark" ? "bg-dark" : "bg-gray-50"
                            } grident-transparent`}
                        ></div>
                        <div className="w-full h-full">
                            <Image
                                onClick={imageClickHandler}
                                src={userImg || getPhotoSrcFun(userName)}
                                alt={userName}
                                layout="fill"
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>
                    </div>
                    <span
                        onClick={imageClickHandler}
                        className="truncate w-16 text-[12px] cursor-pointer text-center"
                    >
                        {userName}
                    </span>
                </div>
            )}
        </>
    );
};

export default Story;
