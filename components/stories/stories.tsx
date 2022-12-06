import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect, useRef } from "react";

import ToggleMode from "../../context/darkMode";
import CurrentStory from "../../context/currentStory-context";
import ShowHideModels from "../../context/showHideModels-context";

import StoriesHeader from "./storiesHeader";
import Story from "./story/story";
import { useRouter } from "next/router";
import StorySettingsModel from "../models/storySettingsModel";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import {
    StoriesInterface,
    StoryInterface,
} from "../../interfaces/stories-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";

import {
    IoIosArrowDropleftCircle,
    IoIosArrowDroprightCircle,
} from "react-icons/io";

// swiperJs
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import SwiperCore, { Navigation, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

SwiperCore.use([Navigation, Autoplay]);

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const Stories = (props: StoriesInterface & UserInterface) => {
    const { currentUser, stories } = props;

    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);

    const [initailIndex, setInitailIndex] = useState(10000);
    const [currentIndex, setCurrentIndex] = useState<number>(1000);
    const [modifiedStories, setModifiedStories] = useState<StoryInterface[]>(
        []
    );

    const router = useRouter();
    const { name, story } = router.query;

    const modeCtx = useContext(ToggleMode);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentStoryCtx = useContext(CurrentStory);

    const { mode } = modeCtx;
    const { showStorySettingsModel } = showHideModelsCtx;
    const { currentStory, getNextStory, getNextStoryHandler } = currentStoryCtx;

    // get next user stories if we arrive the last story of prev user
    useEffect(() => {
        if (getNextStory && modifiedStories.length - 2 > currentIndex) {
            nextButtonHandler();
            nextRef.current?.click();
            setTimeout(() => {
                getNextStoryHandler(false);
            }, 200);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getNextStory]);

    useEffect(() => {
        if (currentIndex !== 1000) {
            router.push(
                `stories?name=${modifiedStories[currentIndex].userName}&story=1`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    // get initail index of target slide
    useEffect(() => {
        modifiedStories.forEach((story, index) => {
            if (story.userName === name) {
                setInitailIndex(index - 1);
                setCurrentIndex(index);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modifiedStories]);

    // useeffect to check if stories has story for you or your following
    useEffect(() => {
        setModifiedStories([
            {
                imgs: [""],
                userImg: "",
                userName: "",
                fullName: "",
                timestamp: { nanoseconds: 0, seconds: 0 },
            },
        ]);
        let personExist: boolean = false;

        // make you  story in the first
        stories.forEach((story) => {
            if (story.userName === currentUser.userName) {
                setModifiedStories((prevState) => prevState.concat(story));
                return;
            }
        });

        // loading others stories
        stories.forEach((story) => {
            personExist = false;
            currentUser.following.forEach((following) => {
                if (story.userName === following.userName) {
                    personExist = true;
                    return;
                }
            });
            if (personExist) {
                setModifiedStories((prevState) => prevState.concat(story));
            }
        });

        setModifiedStories((prevState) =>
            prevState.concat({
                imgs: [""],
                userImg: "",
                userName: "",
                fullName: "",
                timestamp: { nanoseconds: 0, seconds: 0 },
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextButtonHandler = () => {
        modifiedStories.forEach((story, index) => {
            if (name === story.userName) {
                setCurrentIndex(index + 1);
            }
        });
    };

    const prevButtonHandler = () => {
        modifiedStories.forEach((story, index) => {
            if (name === story.userName) {
                setCurrentIndex(index - 1);
            }
        });
    };

    const prevUserStory = () => {
        router.push(
            `stories?name=${name}&story=${Number(story) - 1}`,
            undefined,
            { scroll: false }
        );
    };

    const nextUserStory = () => {
        router.push(
            `stories?name=${name}&story=${Number(story) + 1}`,
            undefined,
            { scroll: false }
        );
    };

    if (initailIndex === 10000 || !stories) {
        return <></>;
    }

    return (
        <div className="w-full h-screen">
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
                        initialSlide={initailIndex}
                        breakpoints={{
                            0: {
                                spaceBetween: 0,
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                            },
                            640: {
                                spaceBetween: 0,
                                slidesPerView: 3,
                                slidesPerGroup: 1,
                            },
                        }}
                        navigation={{
                            prevEl: prevRef.current
                                ? prevRef.current
                                : undefined,
                            nextEl: nextRef.current
                                ? nextRef.current
                                : undefined,
                        }}
                        speed={1000}
                        allowTouchMove={false}
                        onBeforeInit={(swiper) => {
                            // @ts-ignore
                            swiper.params.navigation.prevEl =
                                currentIndex >= 1 && prevRef.current;
                            // @ts-ignore
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.update();
                        }}
                    >
                        {/* nav to prev user story */}
                        <div
                            ref={prevRef}
                            onClick={prevButtonHandler}
                            className={`${
                                (currentIndex === 1 ||
                                    currentStory.imgs.length < Number(story)) &&
                                "hidden"
                            } absolute top-[50%] left-[5%] select-none sm:left-[30%] hover:-translate-x-0.5 z-50 cursor-pointer duration-300`}
                        >
                            <span>
                                <IoIosArrowDropleftCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                            </span>
                        </div>
                        {/* nav to next user story */}
                        <div
                            onClick={nextButtonHandler}
                            ref={nextRef}
                            className={`${
                                (currentIndex === modifiedStories.length - 2 ||
                                    currentStory.imgs.length > Number(story)) &&
                                "hidden"
                            } absolute top-[50%] right-[5%] select-none sm:right-[30%] hover:translate-x-0.5 z-50 cursor-pointer duration-300`}
                        >
                            <span>
                                <IoIosArrowDroprightCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                            </span>
                        </div>

                        {/* nav to prev story of the same user */}
                        <div
                            onClick={prevUserStory}
                            className={`${
                                (Number(story) === 1 ||
                                    currentStory.imgs.length < Number(story)) &&
                                "hidden"
                            } absolute top-[50%] left-[5%] select-none sm:left-[30%] hover:-translate-x-0.5 z-50 cursor-pointer duration-300`}
                        >
                            <span>
                                <IoIosArrowDropleftCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                            </span>
                        </div>
                        {/* nav to next story of the same use */}
                        <div
                            onClick={nextUserStory}
                            className={`${
                                (Number(story) === currentStory.imgs.length ||
                                    currentStory.imgs.length < Number(story)) &&
                                "hidden"
                            } absolute top-[50%] right-[5%] select-none sm:right-[30%] hover:translate-x-0.5 z-50 cursor-pointer duration-300`}
                        >
                            <span>
                                <IoIosArrowDroprightCircle className="w-7 h-7 opacity-60 hover:opacity-100 duration-150" />
                            </span>
                        </div>
                        {modifiedStories.map((story, index) => (
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
                                    length={modifiedStories.length}
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
                                stories={modifiedStories}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Stories;
