import { useContext, useState, useEffect } from "react";

import SuggestedPeopleModel from "./people";

import ToggleMode from "../../../context/darkMode";
import HideModel from "../../../context/hideModels";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { SuggestedPersonInterface } from "../../../interfaces/interfaces";
import { PostsInterface } from "../../../interfaces/posts-interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

// swiperJs
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import SwiperCore, { Navigation, Autoplay } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

SwiperCore.use([Navigation, Autoplay]);

const SuggestedPeople = (
    props: AllUsersInterface & UserInterface & PostsInterface & StoriesInterface
): JSX.Element => {
    const { allUsers, currentUser, posts, stories } = props;
    const [showHideProfileModel, setShowHideProfileModel] = useState(true);

    const [suggesetionPeople, setSuggesetionPeople] = useState<
        SuggestedPersonInterface[]
    >([]);

    const modeCtx = useContext(ToggleMode);
    const hideModelCtx = useContext(HideModel);

    const { mode } = modeCtx;
    const {
        toggleShowHideAllModelsHandler,
        toggleProfileModel,
        toggleProfileModelHandler,
    } = hideModelCtx;

    useEffect(() => {
        setSuggesetionPeople((prevState) => prevState);
    }, [suggesetionPeople]);

    // useeffect to check if people is your follwing or is you
    useEffect(() => {
        setSuggesetionPeople([]);
        let personExist: boolean = false;

        allUsers.forEach((person, index) => {
            personExist = false;
            currentUser.following.forEach((following) => {
                if (
                    person.userName === currentUser.userName ||
                    person.userName === following.userName
                ) {
                    personExist = true;
                    return;
                }
            });
            if (!personExist) {
                setSuggesetionPeople((prevState) => prevState.concat(person));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <div
            onClick={hideModelHandler}
            className={`${
                mode === "dark"
                    ? "bg-smothDark text-white"
                    : "bg-gray-100 text-smothDark"
            }`}
        >
            <div className="pt-10 pb-10 sm:pb-0">
                <div
                    className={`${
                        mode === "dark" ? "border-white/10" : "border-dark/5"
                    } w-full border-[1px] pt-2 sm:rounded-lg`}
                >
                    <h2
                        className={`${
                            mode === "dark" ? "text-white/80" : "text-dark/50"
                        } ml-2 sm:ml-5 text-lg `}
                    >
                        Suggested
                    </h2>

                    <div
                        className={` w-full flex justify-start items-center p-2 sm:p-4 py-2 sm:ml-1.5 sm:mr-3`}
                    >
                        <Swiper
                            className={`${
                                suggesetionPeople.length === 0 && "hidden"
                            } w-full`}
                            slidesPerGroupAuto
                            breakpoints={{
                                0: {
                                    spaceBetween: 15,
                                    slidesPerView: 1,
                                    slidesPerGroup: 1,
                                },
                                200: {
                                    spaceBetween: 15,
                                    slidesPerView: 2,
                                    slidesPerGroup: 2,
                                },
                                500: {
                                    spaceBetween: 15,
                                    slidesPerView: 3,
                                    slidesPerGroup: 2,
                                },
                                600: {
                                    spaceBetween: 15,
                                    slidesPerView: 3,
                                    slidesPerGroup: 3,
                                },
                                768: {
                                    spaceBetween: 15,
                                    slidesPerView: 4,
                                    slidesPerGroup: 3,
                                },
                                800: {
                                    spaceBetween: 15,
                                    slidesPerView: 4,
                                },
                                868: {
                                    spaceBetween: 15,
                                    slidesPerView: 4,
                                },
                                1030: {
                                    spaceBetween: 15,
                                    slidesPerView: 4,
                                },
                                1280: {
                                    spaceBetween: 20,
                                    slidesPerView: 5,
                                },
                            }}
                            navigation
                            slidesPerGroup={4}
                            pagination={{ clickable: true }}
                            speed={3000}
                            mousewheel={true}
                            parallax={true}
                        >
                            {suggesetionPeople.map(
                                (SuggestionPerson, index) =>
                                    SuggestionPerson.userName !==
                                        currentUser.userName && (
                                        <SwiperSlide
                                            key={`${SuggestionPerson.userName}+${index}`}
                                        >
                                            <SuggestedPeopleModel
                                                key={SuggestionPerson.userName}
                                                userImg={
                                                    SuggestionPerson.userImg ||
                                                    getPhotoSrcFun(
                                                        SuggestionPerson.userName
                                                    )
                                                }
                                                mode={mode}
                                                userName={
                                                    SuggestionPerson.userName
                                                }
                                                fullName={
                                                    SuggestionPerson.fullName
                                                }
                                                caption={
                                                    SuggestionPerson.caption
                                                }
                                                email={SuggestionPerson.email}
                                                followers={
                                                    SuggestionPerson.followers
                                                }
                                                following={
                                                    SuggestionPerson.following
                                                }
                                                search={SuggestionPerson.search}
                                                timestamp={
                                                    SuggestionPerson.timestamp
                                                }
                                                currentUser={currentUser}
                                                allUsers={allUsers}
                                                posts={posts}
                                                index={index}
                                                suggestedPeople={
                                                    suggesetionPeople
                                                }
                                                stories={stories}
                                            />
                                        </SwiperSlide>
                                    )
                            )}
                        </Swiper>

                        {suggesetionPeople.length === 0 && (
                            <div className="flex justify-center items-center w-full h-full">
                                <h2
                                    className={`${
                                        mode === "dark"
                                            ? "text-white/50"
                                            : "text-dark/50"
                                    } font-semibold text-lg sm:text-xl py-10`}
                                >
                                    No suggested people
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestedPeople;
