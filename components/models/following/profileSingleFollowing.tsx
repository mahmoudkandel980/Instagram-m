import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import RouterContext from "../../../context/router-context";
import CurrentUserFollowing from "../../../context/currentUserFollowing";
import CurrentStory from "../../../context/currentStory-context";

import Spinner from "../../ui/spinner";

import { SpecificFollowingInterface } from "../../../interfaces/following-Follow-interface";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";

const ProfileSingleFollowing = (
    props: SpecificFollowingInterface &
        StoriesInterface &
        ModeInterFace &
        UserInterface
) => {
    const { fullName, userImg, userName, stories, mode, currentUser } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [buttonState, setButtonState] = useState("following");
    const [storyClicked, setStoryClicked] = useState(false);

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
                setButtonState("follow");
                followingCtx.forEach((singleFollowing) => {
                    if (singleFollowing.userName === userName) {
                        setButtonState("following");
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
        <div className="py-1.5 flex justify-start items-center space-x-3 w-[100%] overflow-hidden relative">
            <div className="rounded-full ml-1 w-10 h-10 relative cursor-pointer">
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
                    userName.length > 20 ? "w-32" : "min-w-max"
                } flex flex-col justify-center -space-y-0.5 flex-wrap`}
            >
                <div className="flex justify-start space-x-1.5 items-center w-full">
                    <Link href={`${userName}`}>
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

            <div className="flex justify-end text-[11px] font-bold ml-auto flex-1 relative">
                <span
                    onClick={toggleFollowFollowing.bind(
                        null,
                        userName,
                        fullName,
                        userImg
                    )}
                    className={`${
                        mode === "dark"
                            ? "border-gray-600/40"
                            : "border-gray-600/10"
                    } ${
                        buttonState === "follow"
                            ? "bg-lightBlue text-white cursor-pointer"
                            : buttonState === "following"
                            ? "border-[1px] cursor-pointer"
                            : "border-[1px]"
                    } capitalize text-sm p-1 px-2.5 w-fit rounded-md`}
                >
                    {buttonState === "following" ? (
                        "Following"
                    ) : buttonState === "follow" ? (
                        "Follow"
                    ) : (
                        <Spinner className="scale-[0.2] -mt-1 py-3 mr-2 w-8 h-5" />
                    )}
                </span>
            </div>
        </div>
    );
};

export default ProfileSingleFollowing;
