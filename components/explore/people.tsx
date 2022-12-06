import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import PopUpUserDataModel from "../models/popUpUserDataModel";
import Spinner from "../ui/spinner";
import DocumentetedUsers from "../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import RouterContext from "../../context/router-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import CurrentStory from "../../context/currentStory-context";

import { PostsInterface } from "../../interfaces/posts-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../interfaces/user-interfaces";
import {
    ModeInterFace,
    SuggestedPersonInterface,
    SingleFollowingInterface,
    SuggestedPeopleInterface,
    IndexInterface,
} from "../../interfaces/interfaces";

const SuggestedPeopleModel = (
    props: ModeInterFace &
        SuggestedPersonInterface &
        UserInterface &
        AllUsersInterface &
        PostsInterface &
        SuggestedPeopleInterface &
        IndexInterface &
        StoriesInterface
) => {
    const {
        mode,
        userImg,
        userName,
        fullName,
        caption,
        email,
        followers,
        following,
        search,
        timestamp,
        currentUser,
        allUsers,
        posts,
        index,
        suggestedPeople,
        stories,
    } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [buttonState, setButtonState] = useState("follow");
    const [storyClicked, setStoryClicked] = useState(false);

    const [
        userFollowersincurrentUserFollowing,
        setUserFollowersincurrentUserFollowing,
    ] = useState<SingleFollowingInterface[]>([]);

    const router = useRouter();

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const CurrentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const {
        following: followingCtx,
        unfollowingModel,
        addToFollowing,
        unfollowingModelHandler,
    } = CurrentUserFollowingCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    // when hide unfollowing model need to render following
    //  again to remove spinner button state and get following or follow
    useEffect(() => {
        if (!unfollowingModel.showUnfollowingModel) {
            setTimeout(() => {
                followingCtx.forEach((singleFollowing) => {
                    if (singleFollowing.userName === userName) {
                        setButtonState("following");
                    } else {
                        setButtonState("follow");
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

    // check if user in the follwing of current user or not
    useEffect(() => {
        setButtonState("follow");
        followingCtx.forEach((singleFollowing) => {
            if (singleFollowing.userName === userName) {
                setButtonState("following");
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingCtx]);

    useEffect(() => {
        setUserFollowersincurrentUserFollowing([]);
        followers.forEach((follower) => {
            followingCtx.forEach((singleFollwing) => {
                if (follower.userName === singleFollwing.userName) {
                    setUserFollowersincurrentUserFollowing((prevState) =>
                        prevState.concat(follower)
                    );
                    return;
                }
            });
        });
    }, [followingCtx, followers]);

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

        router.push(`/${userName}`, undefined, {
            scroll: false,
        });
    };

    // folow un follow firebase
    const toggleFollowFollowing = async (
        userName: string,
        fullName: string,
        userImg: string
    ) => {
        if (buttonState === "follow") {
            // firebase follow
            setButtonState("pending");
            setTimeout(() => {
                addToFollowing(
                    userName,
                    fullName,
                    userImg || getPhotoSrcFun(userName),
                    currentUser.userName,
                    currentUser.fullName,
                    currentUser.userImg
                );
                setButtonState("following");
            }, 1500);
        } else if (buttonState === "following") {
            // firebase unfollow
            setButtonState("pending");
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
        <div className="flex justify-start items-center space-x-3 w-full mr-5">
            <div className="rounded-full w-12 h-12 relative cursor-pointer group">
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
                    src={userImg || getPhotoSrcFun(userName)}
                    layout="fill"
                    className="rounded-full"
                    alt={"instagram_logo"}
                    priority
                />

                <PopUpUserDataModel
                    allUsers={allUsers}
                    currentUser={currentUser}
                    posts={posts}
                    userName={userName}
                    className={`${
                        suggestedPeople.length > 15 &&
                        index > suggestedPeople.length - 6
                            ? "group-hover:-top-[300px] "
                            : "group-hover:top-14"
                    } top-5 left-5 scale-0 origin-top-left group-hover:left-5 group-hover:scale-100 duration-500`}
                    stories={stories}
                />
            </div>
            <div
                className={`${
                    userName.length > 14 ? "w-32" : "min-w-max"
                } flex flex-col items-start justify-center -space-y-0.5 flex-wrap`}
            >
                <div className="flex justify-start space-x-1.5 items-center w-fit">
                    <Link href={`/${userName}`}>
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
                        fullName.length > 20 ? "w-32" : "min-w-max"
                    } ${
                        mode === "dark"
                            ? "text-gray-300/50"
                            : "text-gray-400/90"
                    } text-[12px] capitalize truncate`}
                >
                    {fullName}
                </span>

                <span
                    className={`${
                        mode === "dark"
                            ? "text-gray-300/50"
                            : "text-gray-400/90"
                    } text-[12px] w-32 sm:w-auto truncate`}
                >
                    {userFollowersincurrentUserFollowing.length > 0 ? (
                        <span>
                            Followed by{" "}
                            {userFollowersincurrentUserFollowing.length ===
                            1 ? (
                                <span
                                    className={`${
                                        userFollowersincurrentUserFollowing[0]
                                            .userName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } inline-grid truncate`}
                                >
                                    {
                                        userFollowersincurrentUserFollowing[0]
                                            .userName
                                    }
                                </span>
                            ) : (
                                <span>
                                    <span
                                        className={`${
                                            userFollowersincurrentUserFollowing[0]
                                                .userName.length > 20
                                                ? "w-32"
                                                : "min-w-max"
                                        } inline-grid truncate`}
                                    >
                                        {
                                            userFollowersincurrentUserFollowing[0]
                                                .userName
                                        }{" "}
                                    </span>
                                    <span>
                                        +{" "}
                                        {
                                            userFollowersincurrentUserFollowing.length
                                        }{" "}
                                        more
                                    </span>
                                </span>
                            )}
                        </span>
                    ) : (
                        <span>Suggested for you</span>
                    )}
                </span>
            </div>
            <div className="flex justify-end text-[11px] font-bold ml-auto flex-1 relative">
                <span
                    onClick={toggleFollowFollowing.bind(
                        null,
                        userName,
                        fullName,
                        userImg
                    )}
                    className={`${
                        buttonState === "follow"
                            ? "bg-lightBlue text-white"
                            : buttonState === "following" && mode === "dark"
                            ? "border-white/20 border-[1px]"
                            : "border-dark/20 border-[1px]"
                    } capitalize text-sm  cursor-pointer p-1 px-5 w-fit rounded-md`}
                >
                    {buttonState === "follow" ? (
                        "follow"
                    ) : buttonState === "pending" ? (
                        <Spinner className="scale-[0.2] mr-2 w-8 h-5" />
                    ) : (
                        "Following"
                    )}
                </span>
            </div>
        </div>
    );
};

export default SuggestedPeopleModel;
