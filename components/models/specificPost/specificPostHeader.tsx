import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import PopUpUserDataModel from "../popUpUserDataModel";
import DocumentetedUsers from "../../ui/documentetedUsers";

import RouterContext from "../../../context/router-context";
import ShowHideModels from "../../../context/showHideModels-context";
import CurrentStory from "../../../context/currentStory-context";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { BiDotsHorizontalRounded } from "react-icons/bi";

import { SpecificPostHeaderCommentsCationInterface } from "../../../interfaces/specificPost-interface";
import { PostsInterface } from "../../../interfaces/posts-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const SpecificPostHeader = (
    props: SpecificPostHeaderCommentsCationInterface &
        UserInterface &
        PostsInterface &
        AllUsersInterface &
        StoriesInterface
) => {
    const { mode, specificPost, currentUser, allUsers, posts, stories } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);

    const router = useRouter();
    const { postId } = router.query;

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const { showPostSettingsModelHandler } = showHideModelsCtx;

    // find if user has a story
    useEffect(() => {
        stories.forEach((story) => {
            if (story.userName === specificPost.userName) {
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

    // navigate to story page
    const imageClickHandler = (userName: string) => {
        setStoryClicked(true);
        setBackPageHandler(router.asPath);

        setTimeout(() => {
            showRouterComponentHandler(true);
            router.push(`/stories/${userName}?story=1`, undefined, {
                scroll: false,
            });
        }, 2000);
    };

    const showRouteCtxHandler = () => {
        setStoryClicked(true);
        showRouterComponentHandler(true);

        router.push(
            currentUser.userName === specificPost.userName
                ? `profile`
                : `/${specificPost.userName}`,
            undefined,
            {
                scroll: false,
            }
        );
    };

    const showPostSettingsModelFun = () => {
        showPostSettingsModelHandler(true, postId!);
    };

    return (
        <div className="h-16 z-[2] sm:h-16 w-full flex justify-center items-center">
            <div
                className={`${
                    mode === "dark" ? "bg-smothDark/10" : "bg-gray-100"
                } sticky top-0 left-0 flex justify-between items-center w-full h-16 px-3 sm:px-5`}
            >
                <div className="flex justify-start items-center space-x-2 sm:space-x-3">
                    <div className="rounded-full w-9 h-9 relative cursor-pointer group">
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
                                userStory
                                    ? imageClickHandler.bind(
                                          null,
                                          userStory.userName
                                      )
                                    : showRouteCtxHandler
                            }
                            src={
                                specificPost.userImg ||
                                getPhotoSrcFun(specificPost.userName)
                            }
                            alt={specificPost.userName}
                            layout="fill"
                            className="rounded-full"
                        />

                        <PopUpUserDataModel
                            allUsers={allUsers}
                            currentUser={currentUser}
                            posts={posts}
                            userName={specificPost.userName}
                            className={
                                "top-4 left-4 scale-0 origin-top-left group-hover:top-10 group-hover:left-0 group-hover:scale-100 duration-500"
                            }
                            stories={stories}
                        />
                    </div>
                    <div className="group">
                        <Link
                            href={
                                currentUser.userName === specificPost.userName
                                    ? `profile`
                                    : `${specificPost.userName}`
                            }
                        >
                            <a onClick={showRouteCtxHandler}>
                                {specificPost.userName}
                            </a>
                        </Link>
                        <PopUpUserDataModel
                            allUsers={allUsers}
                            currentUser={currentUser}
                            posts={posts}
                            userName={specificPost.userName}
                            className={
                                "top-8 left-20 scale-0 origin-top-left group-hover:top-12 group-hover:left-16 group-hover:scale-100 duration-500"
                            }
                            stories={stories}
                        />
                    </div>

                    <DocumentetedUsers
                        className="w-3 h-3"
                        userName={specificPost.userName}
                    />
                </div>
                <div className="flex justify-end flex-1 ">
                    <span onClick={showPostSettingsModelFun}>
                        <BiDotsHorizontalRounded className="w-7 h-7 cursor-pointer" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpecificPostHeader;
