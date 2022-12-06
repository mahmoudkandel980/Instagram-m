import { useState, useContext, useEffect } from "react";

import Story from "./story";

import ToggleMode from "../../../context/darkMode";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import { StoryInterface } from "../../../interfaces/stories-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";

// swiperJs
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import SwiperCore, { Navigation, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

SwiperCore.use([Navigation, Autoplay]);

const Stories = (props: StoriesInterface & UserInterface): JSX.Element => {
    const { stories, currentUser } = props;
    const [modifiedStories, setModifiedStories] = useState<StoryInterface[]>(
        []
    );

    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;

    // useeffect to check if stories has story for you or your following
    useEffect(() => {
        setModifiedStories([
            {
                userName: currentUser.userName,
                userImg:
                    currentUser.userImg || getPhotoSrcFun(currentUser.userName),
                fullName: currentUser.fullName,
                imgs: [],
                timestamp: currentUser.timestamp,
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stories]);

    return (
        <div
            className={`${
                mode === "dark" ? "bg-dark" : "bg-gray-50 "
            } overflow-hidden sm:rounded-md border-t-[1px] sm:border-[1px] border-gray-400/50 sm:py-1 mb-1.5`}
        >
            <div
                className={`${
                    stories.length > 0 &&
                    "flex justify-start w-full space-x-5 select-none pl-2"
                }`}
            >
                <Swiper
                    className="w-full"
                    breakpoints={{
                        0: {
                            spaceBetween: 15,
                            slidesPerView: 4,
                            slidesPerGroup: 1,
                        },
                        400: {
                            spaceBetween: 15,
                            slidesPerView: 6,
                            slidesPerGroup: 2,
                        },
                        500: {
                            spaceBetween: 15,
                            slidesPerView: 7,
                            slidesPerGroup: 2,
                        },
                        600: {
                            spaceBetween: 15,
                            slidesPerView: 8,
                            slidesPerGroup: 2,
                        },
                        768: {
                            spaceBetween: 15,
                            slidesPerView: 5,
                            slidesPerGroup: 3,
                        },
                        800: {
                            spaceBetween: 15,
                            slidesPerView: 6,
                        },
                        868: {
                            spaceBetween: 15,
                            slidesPerView: 6,
                        },
                        1030: {
                            spaceBetween: 15,
                            slidesPerView: 6,
                        },
                        1280: {
                            spaceBetween: 10,
                            slidesPerView: 7,
                        },
                        1536: {
                            spaceBetween: 10,
                            slidesPerView: 7,
                        },
                    }}
                    navigation
                    slidesPerGroup={4}
                    pagination={{ clickable: true }}
                    speed={1000}
                    mousewheel={true}
                    parallax={true}
                >
                    {modifiedStories.map((story, index) => (
                        <SwiperSlide
                            key={`${story.userName}+${index}`}
                            className="flex flex-col justify-start select-none h-full w-full
                             py-3 pl-2"
                        >
                            <Story
                                key={`${story.userName} ${index}`}
                                userName={story.userName}
                                fullName={story.fullName}
                                userImg={story.userImg}
                                imgs={story.imgs}
                                timestamp={story.timestamp}
                                index={index}
                                mode={mode}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Stories;
