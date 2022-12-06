import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { auth } from "../../../firebase.config";
import { signOut } from "firebase/auth";

import SuggestionPeople from "./suggestionPeople";
import Footer from "../footer/footer";
import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import ToggleMode from "../../../context/darkMode";
import RouterContext from "../../../context/router-context";
import ShowHideModels from "../../../context/showHideModels-context";
import CurrentStory from "../../../context/currentStory-context";

import { PostsInterface } from "../../../interfaces/posts-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import { AllUsersInterface } from "../../../interfaces/user-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    ClassNameInterface,
    SuggestedPersonInterface,
} from "../../../interfaces/interfaces";

const Suggestions = (
    props: ClassNameInterface &
        UserInterface &
        AllUsersInterface &
        PostsInterface &
        StoriesInterface
): JSX.Element => {
    const { className, currentUser, allUsers, posts, stories } = props;

    const [storyClicked, setStoryClicked] = useState(false);
    const [userStory, setUserStory] = useState<StoryInterface>();

    const [suggesetionPeople, setSuggesetionPeople] = useState<
        SuggestedPersonInterface[]
    >([]);

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentStoryCtx = useContext(CurrentStory);

    const { mode } = modeCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { setProfileQueryHandler } = showHideModelsCtx;
    const { setBackPageHandler } = currentStoryCtx;

    const router = useRouter();

    // find if user has a story
    useEffect(() => {
        stories.forEach((story) => {
            if (story.userName === currentUser.userName) {
                setUserStory(story);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stories]);

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

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
        setSuggesetionPeople((prevState) => prevState.slice(0, 5));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // navigate to story page
    const imageClickHandler = (userName: string) => {
        setStoryClicked(true);
        setBackPageHandler(router.asPath);

        setTimeout(() => {
            showRouterComponentHandler(true);
            router.push(`/stories?name=${userName}&story=1`, undefined, {
                scroll: false,
            });
        }, 2000);
    };

    // logout
    const logoutHandler = () => {
        signOut(auth);
        showRouterComponentHandler(true);
        router.push("/signin");
    };

    const showRouterModelHandler = (query: string) => {
        showRouterComponentHandler(true);
        setProfileQueryHandler(query);
        router.push("/profile");
    };

    const showRouterModelSeeALLHandler = (query: string) => {
        showRouterComponentHandler(true);
        setProfileQueryHandler(query);
    };

    return (
        <div className={`${props.className}  ml-7 mt-2`}>
            <div className="flex flex-col">
                <div className="flex justify-start items-center space-x-3">
                    <div className="rounded-full w-14 h-14 relative cursor-pointer">
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
                        <div
                            className="w-full h-full relative"
                            onClick={
                                userStory
                                    ? imageClickHandler.bind(
                                          null,
                                          currentUser.userName
                                      )
                                    : showRouterModelHandler.bind(null, "posts")
                            }
                        >
                            <Image
                                src={
                                    currentUser.userImg ||
                                    getPhotoSrcFun(currentUser.userName)
                                }
                                layout="fill"
                                className="rounded-full object-cover"
                                alt={"profile photo"}
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center">
                        <Link href={"/profile"}>
                            <a
                                onClick={showRouterModelHandler.bind(
                                    null,
                                    "posts"
                                )}
                                className="flex justify-start space-x-1.5 items-center w-full cursor-pointer"
                            >
                                <h3 className="text-[13px]">
                                    {currentUser.userName}
                                </h3>
                                <DocumentetedUsers
                                    className="w-3 h-3"
                                    userName={currentUser.userName}
                                />
                            </a>
                        </Link>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-300/50"
                                    : "text-gray-400/90"
                            } text-[14px] capitalize `}
                        >
                            {currentUser.fullName}
                        </span>
                    </div>
                    <div className="text-[11px] font-bold ml-auto flex-1 relative">
                        <span
                            onClick={logoutHandler}
                            className="capitalize flex justify-end text-lightBlue cursor-pointer"
                        >
                            switch
                        </span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-start items-center mt-4 mb-4">
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-300/50"
                                    : "text-gray-400/90"
                            } text-[14px] capitalize font-semibold`}
                        >
                            suggestions for you
                        </span>

                        <div
                            className={`${
                                mode === "dark" ? "text-white" : "text-dark"
                            } ${
                                suggesetionPeople.length === 0 && "opacity-0"
                            } capitalize text-xs flex justify-end flex-1`}
                        >
                            <Link href={`/explore/people`}>
                                <a
                                    onClick={showRouterModelSeeALLHandler.bind(
                                        null,
                                        "posts"
                                    )}
                                >
                                    see all
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start space-y-2 ml-1.5">
                        {suggesetionPeople.map(
                            (SuggestionPerson, index) =>
                                SuggestionPerson.userName !==
                                    currentUser.userName && (
                                    <SuggestionPeople
                                        key={`${SuggestionPerson.userName}${index}`}
                                        userImg={SuggestionPerson.userImg}
                                        mode={mode}
                                        userName={SuggestionPerson.userName}
                                        fullName={SuggestionPerson.fullName}
                                        caption={SuggestionPerson.caption}
                                        email={SuggestionPerson.email}
                                        followers={SuggestionPerson.followers}
                                        following={SuggestionPerson.following}
                                        search={SuggestionPerson.search}
                                        timestamp={SuggestionPerson.timestamp}
                                        currentUser={currentUser}
                                        allUsers={allUsers}
                                        posts={posts}
                                        stories={stories}
                                    />
                                )
                        )}
                    </div>
                    {suggesetionPeople.length === 0 && (
                        <div className="flex justify-start items-center w-full h-full">
                            <h2
                                className={`${
                                    mode === "dark"
                                        ? "text-white/50"
                                        : "text-dark/50"
                                } font-semibold text-lg`}
                            >
                                No suggested people
                            </h2>
                        </div>
                    )}
                </div>
                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Suggestions;
