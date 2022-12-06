import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import RouterContext from "../../../context/router-context";
import CurrentUserFollowing from "../../../context/currentUserFollowing";
import CurrentStory from "../../../context/currentStory-context";

import Spinner from "../../ui/spinner";
import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { PostsInterface } from "../../../interfaces/posts-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";
import {
    ModeInterFace,
    SuggestedPersonInterface,
    SingleFollowingInterface,
    SuggestedPeopleInterface,
    IndexInterface,
} from "../../../interfaces/interfaces";

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
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const {
        following: followingCtx,
        addToFollowing,
        unfollowingModelHandler,
    } = currentUserFollowingCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    useEffect(() => {
        setUserFollowersincurrentUserFollowing([]);
        followers.forEach((follower) => {
            currentUser.following.forEach((singleFollwing) => {
                if (follower.userName === singleFollwing.userName) {
                    setUserFollowersincurrentUserFollowing((prevState) =>
                        prevState.concat(follower)
                    );
                    return;
                }
            });
        });
    }, [currentUser.following, followers]);

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
        // setStoryClicked(true);
        showRouterComponentHandler(true);
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
        <div
            className={`${
                mode === "dark" ? "border-white/10" : "border-dark/10"
            } flex flex-col justify-center items-center space-y-1.5 p-10 rounded-lg border-[1px]`}
        >
            <div className="rounded-full w-12 h-12 relative cursor-pointer ">
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
            </div>
            <div
                className={`${
                    userName.length > 14 ? "w-32" : "min-w-max"
                } flex flex-col items-center justify-center  flex-wrap`}
            >
                <div className="flex justify-start space-x-1.5 items-center w-full">
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
            </div>
            <div className="text-[11px] font-bold">
                <button
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
                    } capitalize mt-3 text-sm cursor-pointer p-1 px-5 rounded-md`}
                >
                    {buttonState === "follow" ? (
                        "follow"
                    ) : buttonState === "pending" ? (
                        <div className="flex justify-center items-center">
                            <Spinner className="scale-[0.2] mr-2 w-5 -mt-[5px] h-6 " />
                        </div>
                    ) : (
                        "Following"
                    )}
                </button>
            </div>
        </div>
    );
};

export default SuggestedPeopleModel;
