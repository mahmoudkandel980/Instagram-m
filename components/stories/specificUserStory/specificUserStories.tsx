import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { useRouter } from "next/router";

import ToggleMode from "../../../context/darkMode";
import CurrentStory from "../../../context/currentStory-context";
import ShowHideModels from "../../../context/showHideModels-context";

import StoriesHeader from "../storiesHeader";
import Story from "./story";
import StorySettingsModel from "../../models/storySettingsModel";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import {
    IoIosArrowDropleftCircle,
    IoIosArrowDroprightCircle,
} from "react-icons/io";

import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";

// swiperJs
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import SwiperCore, { Navigation, Autoplay, EffectCoverflow } from "swiper";

SwiperCore.use([Navigation, EffectCoverflow]);

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SpecificUserStories = (props: StoriesInterface & UserInterface) => {
    const { currentUser, stories } = props;

    const router = useRouter();
    const { userName, story } = router.query;

    const modeCtx = useContext(ToggleMode);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentStoryCtx = useContext(CurrentStory);

    const { mode } = modeCtx;
    const { showStorySettingsModel } = showHideModelsCtx;
    const { currentStory, buttonClickedHandler } = currentStoryCtx;

    const prevUserStory = () => {
        // to clear timeout of story line
        buttonClickedHandler(true);

        router.push(
            `/stories/${userName}?story=${Number(story) - 1}`,
            undefined,
            { scroll: false }
        );
    };

    const nextUserStory = () => {
        // to clear timeout of story line
        buttonClickedHandler(true);

        router.push(
            `/stories/${userName}?story=${Number(story) + 1}`,
            undefined,
            { scroll: false }
        );
    };

    if (!stories) {
        return <></>;
    }

    return (
        <>
            <div className="w-full h-screen select-none">
                {/* header */}
                <StoriesHeader />

                {/* main section */}
                <div
                    className={`text-white bg-gradient-to-b from-dark to-smothDark/90 flex  h-full w-full select-none`}
                >
                    {/* big screens */}
                    <div
                        className={`${
                            stories.length > 0 &&
                            "flex justify-start space-x-5 select-none md:pl-2"
                        } swiperStoriesPage w-full h-full`}
                    >
                        <Swiper
                            className="w-full"
                            spaceBetween={0}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            speed={1000}
                            allowTouchMove={false}
                        >
                            {/* nav to prev story of the same user */}
                            <div
                                onClick={prevUserStory}
                                className={`${
                                    (Number(story) === 1 ||
                                        currentStory.imgs.length <
                                            Number(story)) &&
                                    "hidden"
                                } absolute top-[50%] left-[5%] select-none sm:left-[18%] hover:-translate-x-0.5 z-50 cursor-pointer duration-300`}
                            >
                                <span>
                                    <IoIosArrowDropleftCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                                </span>
                            </div>
                            {/* nav to next story of the same use */}
                            <div
                                onClick={nextUserStory}
                                className={`${
                                    (Number(story) ===
                                        currentStory.imgs.length ||
                                        currentStory.imgs.length <
                                            Number(story)) &&
                                    "hidden"
                                } absolute top-[50%]  right-[5%] select-none sm:left-[80%] hover:translate-x-0.5 z-50 cursor-pointer duration-300`}
                            >
                                <span>
                                    <IoIosArrowDroprightCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                                </span>
                            </div>
                            {stories.map((story, index) => (
                                <SwiperSlide
                                    key={`${story.userName}+${index}`}
                                    className="h-full w-full"
                                >
                                    <Story
                                        key={`${story.userName} ${index}`}
                                        userName={story.userName}
                                        fullName={story.fullName}
                                        userImg={
                                            story.userImg ||
                                            getPhotoSrcFun(story.userName)
                                        }
                                        imgs={story.imgs}
                                        timestamp={story.timestamp}
                                        index={index}
                                        mode={mode}
                                        length={stories.length}
                                        currentUser={currentUser}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                <AnimatePresence>
                    {showStorySettingsModel.state && (
                        <motion.div
                            className="top-0 left-0 fixed w-full h-full z-[100]"
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
                            {showStorySettingsModel.state && (
                                <StorySettingsModel
                                    mode={mode}
                                    currentUser={currentUser}
                                    stories={stories}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default SpecificUserStories;
