import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import PopUpUserDataModel from "../popUpUserDataModel";
import DocumentetedUsers from "../../ui/documentetedUsers";

import RouterContext from "../../../context/router-context";
import CurrentStory from "../../../context/currentStory-context";

import timestampCommentsReplaysFun from "../../../helpers/timestampCommentsReplaysFun";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { PostsInterface } from "../../../interfaces/posts-interfaces";
import { SpecificPostHeaderCommentsCationInterface } from "../../../interfaces/specificPost-interface";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const SpecificPostCaption = (
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

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;

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

    return (
        <div className="flex z-[1] justify-start items-start space-x-3 pr-5 pb-5">
            <div className="rounded-full w-9 h-9 relative cursor-pointer group">
                {userStory && (
                    <div key={userStory.userName}>
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
                    </div>
                )}

                <Image
                    onClick={
                        userStory
                            ? imageClickHandler.bind(null, userStory.userName)
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
            <div className="flex-1 flex flex-col justify-start items-start">
                <div>
                    <div className="text-[14px]">
                        <Link
                            href={
                                currentUser.userName === specificPost.userName
                                    ? `profile`
                                    : `${specificPost.userName}`
                            }
                        >
                            <a
                                className="font-bold min-w-max"
                                onClick={showRouteCtxHandler}
                            >
                                {specificPost.userName}
                            </a>
                        </Link>
                        <span>&nbsp;</span>
                        <DocumentetedUsers
                            className="w-3 h-3"
                            userName={specificPost.userName}
                        />
                        <span>&nbsp; &nbsp;</span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/90"
                                    : "text-gray-600/95"
                            } font-normal`}
                        >
                            {specificPost.caption}
                        </span>
                    </div>
                </div>
                <div className="flex justify-start items-center space-x-4">
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-gray-600/95"
                        } text-[12px] font-medium`}
                    >
                        {timestampCommentsReplaysFun(
                            specificPost.timestamp.seconds
                        )}
                    </span>
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-gray-600/95"
                        } text-[12px] font-medium`}
                    >
                        See translation
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpecificPostCaption;
