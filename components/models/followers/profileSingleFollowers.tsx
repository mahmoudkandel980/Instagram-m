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

import { SpecificFollowersInterface } from "../../../interfaces/following-Follow-interface";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";

const ProfileSingleFollowers = (
    props: SpecificFollowersInterface &
        ModeInterFace &
        StoriesInterface &
        UserInterface
) => {
    const { fullName, mode, stories, userImg, userName, currentUser } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [buttonState, setButtonState] = useState("remove");
    const [storyClicked, setStoryClicked] = useState(false);

    const router = useRouter();

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const {
        followers: followersCtx,
        removeFollowersModelHandler,
        removeFollowersModel,
    } = currentUserFollowingCtx;

    // when hide remove followers model need to render followers
    //  again to remove spinner button state and get following or follow
    useEffect(() => {
        if (!removeFollowersModel.showRemoveFollowersModel) {
            setTimeout(() => {
                setButtonState("removed");
                followersCtx.forEach((singleFollowing) => {
                    if (singleFollowing.userName === userName) {
                        setButtonState("remove");
                        return;
                    }
                });
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeFollowersModel.showRemoveFollowersModel]);

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
        setButtonState("removed");
        followersCtx.forEach((singleFollowing) => {
            if (singleFollowing.userName === userName) {
                setButtonState("remove");
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followersCtx]);

    const showRouterCtxHandler = () => {
        setStoryClicked(true);
        showRouterComponentHandler(true);

        router.push(`/${userName}`, undefined, {
            scroll: false,
        });
    };

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

    // folow un follow firebase
    const toggleFollowFollowing = (userName: string, userImg: string) => {
        if (buttonState === "remove") {
            // firebase follow
            setButtonState("pending");
            // console.log(userName, userImg);

            removeFollowersModelHandler(
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
            <div className="rounded-full ml-1 w-10 h-10 z-[1000] relative cursor-pointer group">
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
                <div
                    className="w-full h-full relative"
                    onClick={
                        userStory
                            ? imageClickHandler.bind(null, userStory.userName)
                            : showRouterCtxHandler
                    }
                >
                    <Image
                        src={userImg || getPhotoSrcFun(userName)}
                        layout="fill"
                        className="w-full h-full rounded-full"
                        alt={"instagram_logo"}
                        priority
                    />
                </div>
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
                            onClick={showRouterCtxHandler}
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
                        userImg
                    )}
                    className={`${
                        mode === "dark"
                            ? "border-gray-600/40"
                            : "border-gray-600/10"
                    } ${
                        buttonState === "removed"
                            ? "cursor-default opacity-30"
                            : "border-[1px] cursor-pointer"
                    } capitalize font-semibold text-sm p-1 px-2.5 w-fit rounded-md`}
                >
                    {buttonState === "remove" ? (
                        "remove"
                    ) : buttonState === "removed" ? (
                        "removed"
                    ) : (
                        <Spinner className="scale-[0.2] -mt-1 py-3 mr-2 w-8 h-5" />
                    )}
                </span>
            </div>
        </div>
    );
};

export default ProfileSingleFollowers;
