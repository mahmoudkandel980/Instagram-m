import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import RouterContext from "../../../context/router-context";
import CurrentUserFollowing from "../../../context/currentUserFollowing";
import CurrentStory from "../../../context/currentStory-context";

import Spinner from "../../ui/spinner";

import { ModeInterFace } from "../../../interfaces/interfaces";
import { FollowingModelInterface } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";

const SpecificSingleFollowers = (
    props: ModeInterFace &
        StoriesInterface &
        FollowingModelInterface &
        UserInterface
) => {
    const {
        followState,
        fullName,
        mode,
        stories,
        userImg,
        userName,
        currentUser,
    } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);
    const [modifiedFollowState, setModifiedFollowState] = useState(followState);

    const router = useRouter();

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const {
        following: followingCtx,
        unfollowingModel,
        addToFollowing,
        unfollowingModelHandler,
    } = currentUserFollowingCtx;

    // when hide unfollowing model need to render following
    //  again to remove spinner button state and get following or follow
    useEffect(() => {
        if (!unfollowingModel.showUnfollowingModel) {
            setTimeout(() => {
                setModifiedFollowState("follow");
                followingCtx.forEach((singleFollowing) => {
                    if (singleFollowing.userName === userName) {
                        setModifiedFollowState("following");
                        return;
                    }
                });
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unfollowingModel.showUnfollowingModel]);

    // find if user has a story
    useEffect(() => {
        stories.forEach((story) => {
            if (story.userName === userName) {
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

    // check if user in the follwing of current user or not
    useEffect(() => {
        setModifiedFollowState("follow");
        followingCtx.forEach((singleFollowing) => {
            if (singleFollowing.userName === userName) {
                setModifiedFollowState("following");
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingCtx]);

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
            currentUser.userName === userName ? `/profile` : `/${userName}`,
            undefined,
            {
                scroll: false,
            }
        );
    };

    // folow un follow firebase
    const toggleFollowFollowing = async (
        userName: string,
        fullName: string,
        userImg: string,
        followState: string
    ) => {
        if (followState === "follow") {
            // firebase follow
            setModifiedFollowState("pending");
            setTimeout(() => {
                addToFollowing(
                    userName,
                    fullName,
                    userImg || getPhotoSrcFun(userName),
                    currentUser.userName,
                    currentUser.fullName,
                    currentUser.userImg
                );
                setModifiedFollowState("following");
            }, 1500);
        } else if (followState === "following") {
            // firebase unfollow
            setModifiedFollowState("pending");
            unfollowingModelHandler(
                true,
                userName,
                fullName,
                userImg || getPhotoSrcFun(userName),
                currentUser.userName,
                currentUser.fullName,
                currentUser.userImg
            );
        }
    };

    return (
        <div key={`${userName}`}>
            <div className="py-1.5 flex justify-start items-center space-x-3 w-[100%] overflow-hidden relative">
                <div className="rounded-full ml-1 w-10 h-10 relative cursor-pointer">
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
                                    mode === "dark" ? "bg-dark" : "bg-gray-50"
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
                        src={userImg || getPhotoSrcFun(userName)}
                        layout="fill"
                        className="w-full h-full rounded-full"
                        alt={`${userName} image`}
                        priority
                    />
                </div>
                <div
                    className={`${
                        userName.length > 20 ? "w-32" : "min-w-max"
                    } flex flex-col justify-center -space-y-0.5 flex-wrap`}
                >
                    <div className="flex justify-start space-x-1.5 items-center w-full">
                        <Link
                            href={
                                currentUser.userName === userName
                                    ? `profile`
                                    : `${userName}`
                            }
                        >
                            <a
                                className="font-semibold cursor-pointer w-full truncate"
                                onClick={showRouteCtxHandler}
                            >
                                {userName}
                            </a>
                        </Link>
                        <DocumentetedUsers
                            className="w-3 h-3"
                            userName={userName}
                        />
                    </div>
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-300/50"
                                : "text-gray-400/90"
                        } text-[12px] capitalize w-full truncate`}
                    >
                        {fullName}
                    </span>
                </div>
                <div
                    className={`${
                        userName === currentUser.userName && "hidden"
                    } flex justify-end text-[11px] font-bold ml-auto flex-1 relative`}
                >
                    <div
                        onClick={toggleFollowFollowing.bind(
                            null,
                            userName,
                            fullName,
                            userImg,
                            modifiedFollowState
                        )}
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/40 "
                                : "border-gray-600/10 "
                        } ${
                            modifiedFollowState === "following"
                                ? "border-[1px] py-1.5 bg-transparent cursor-pointer"
                                : modifiedFollowState === "follow"
                                ? " bg-lightBlue text-white border-[1px] cursor-pointer"
                                : "bg-transparent border-[1px]"
                        } capitalize text-sm p-1 px-2.5 w-fit rounded-md `}
                    >
                        {modifiedFollowState === "following" ? (
                            "Following"
                        ) : modifiedFollowState === "follow" ? (
                            "Follow"
                        ) : (
                            <Spinner className="scale-[0.2] -mt-1 py-3 mr-2 w-8 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecificSingleFollowers;
