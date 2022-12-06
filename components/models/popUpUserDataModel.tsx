import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Spinner from "../ui/spinner";
import DocumentetedUsers from "../ui/documentetedUsers";

import ToggleMode from "../../context/darkMode";
import RouterContext from "../../context/router-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import CurrentStory from "../../context/currentStory-context";

import { BsCamera } from "react-icons/bs";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { ClassNameInterface } from "../../interfaces/interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../interfaces/stories-interfaces";
import {
    PostsInterface,
    PostInterface,
} from "../../interfaces/posts-interfaces";
import {
    AllUsersInterface,
    UserInterface,
    SingleUserInterface,
} from "../../interfaces/user-interfaces";
import {
    UserNameInterface,
    FollowerInterface,
} from "../../interfaces/popupUserData-interfaces";

const PopUpUserDataModel = (
    props: AllUsersInterface &
        UserInterface &
        PostsInterface &
        UserNameInterface &
        ClassNameInterface &
        StoriesInterface
) => {
    const { allUsers, currentUser, posts, userName, className, stories } =
        props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);
    const [buttonState, setButtonState] = useState("follow");

    const [specificUser, setSpecificUser] = useState<SingleUserInterface>();
    const [specificUserPosts, SetSpecificUserPosts] =
        useState<PostInterface[]>();
    const [
        userFollowersincurrentUserFollowing,
        setUserFollowersincurrentUserFollowing,
    ] = useState<FollowerInterface[]>([]);

    const router = useRouter();
    const pathname = router.pathname;

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { mode } = modeCtx;
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
            setButtonState("follow");
            setTimeout(() => {
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
        setButtonState("follow");
        followingCtx.forEach((singleFollowing) => {
            if (singleFollowing.userName === userName) {
                setButtonState("following");
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [followingCtx]);

    // get specificUser
    useEffect(() => {
        allUsers.forEach((user) => {
            if (user.userName === userName) {
                setSpecificUser(user);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);

    // get currentUser follwing from user followers
    useEffect(() => {
        if (specificUser) {
            setUserFollowersincurrentUserFollowing([]);

            specificUser.followers.forEach((follower) => {
                followingCtx.forEach((singleFollwing) => {
                    if (follower.userName === singleFollwing.userName) {
                        setUserFollowersincurrentUserFollowing((prevState) =>
                            prevState.concat(follower)
                        );
                        return;
                    }
                });
            });
        }
    }, [followingCtx, specificUser]);

    // get user posts
    useEffect(() => {
        if (specificUser) {
            SetSpecificUserPosts([]);
            posts.forEach((post) => {
                if (post.userName === specificUser.userName) {
                    SetSpecificUserPosts((prevState) =>
                        prevState?.concat(post)
                    );
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts, specificUser]);

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
            currentUser.userName === userName ? `profile` : `/${userName}`,
            undefined,
            {
                scroll: false,
            }
        );
    };

    // folow un follow firebase
    const toggleFollowFollowing = async (
        followState: string,
        userNameTarget: string,
        fullName: string,
        userImg: string
    ) => {
        if (followState === "follow") {
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
        } else if (followState === "following") {
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
        <div
            className={`${
                mode === "dark"
                    ? "bg-smothDark border-[#ebebeb]/10"
                    : "bg-white border-smothDark/10"
            } ${className} hidden sm:block absolute border-[1px] rounded-lg w-96 z-[100] overflow-hidden cursor-default`}
        >
            {specificUser && (
                <div>
                    <div className="flex flex-col justify-center items-start">
                        {/* userimg , username and fullname */}
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-white/20"
                                    : "border-smothDark/10"
                            } flex justify-start items-center space-x-3 w-full px-3 pt-4 mr-5 border-b-[1px] pb-4`}
                        >
                            <div className="rounded-full w-12 h-12 relative">
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
                                        specificUser.userImg ||
                                        getPhotoSrcFun(specificUser.userName)
                                    }
                                    layout="fill"
                                    className="rounded-full cursor-pointer"
                                    alt={"instagram_logo"}
                                    priority
                                />
                            </div>
                            <div
                                className={`${
                                    userName.length > 25 ? "w-40" : "min-w-max"
                                } flex flex-col items-start justify-center -space-y-0.5 flex-wrap`}
                            >
                                <div className="flex justify-start space-x-1.5 items-center">
                                    <Link
                                        href={
                                            currentUser.userName === userName
                                                ? `profile`
                                                : `/${userName}`
                                        }
                                    >
                                        <a
                                            onClick={showRouteCtxHandler}
                                            className={`${
                                                specificUser.fullName.length >
                                                20
                                                    ? "w-32"
                                                    : "min-w-max"
                                            } font-semibold truncate`}
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
                                        specificUser.fullName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } ${
                                        mode === "dark"
                                            ? "text-gray-300/50"
                                            : "text-gray-400/90"
                                    } text-[12px] capitalize truncate`}
                                >
                                    {specificUser.fullName}
                                </span>

                                <span
                                    className={`${
                                        mode === "dark"
                                            ? "text-gray-300/50"
                                            : "text-gray-400/90"
                                    } text-[12px] w-32 sm:w-auto truncate`}
                                >
                                    {userFollowersincurrentUserFollowing.length >
                                        0 &&
                                        `Followed by ${
                                            userFollowersincurrentUserFollowing.length ===
                                            1
                                                ? `${userFollowersincurrentUserFollowing[0].userName}`
                                                : `${userFollowersincurrentUserFollowing[0].userName} + ${userFollowersincurrentUserFollowing.length} more`
                                        }`}
                                </span>
                            </div>
                        </div>
                        {/* user posts , follwers , follwing */}
                        <div className={`py-4 w-full`}>
                            <div className="flex justify-between items-center px-14 text-base">
                                <div className="flex flex-col justify-center items-center">
                                    <span className="font-bold">
                                        {specificUserPosts?.length}
                                    </span>
                                    <span className="font-thin">posts</span>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <span className="font-bold">
                                        {specificUser.followers.length}
                                    </span>
                                    <span className="font-thin">followers</span>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <span className="font-bold">
                                        {specificUser.following.length}
                                    </span>
                                    <span className="font-thin">following</span>
                                </div>
                            </div>
                        </div>
                        {/* 3posts image */}
                        <div
                            className={`${
                                specificUserPosts !== undefined &&
                                specificUserPosts?.length > 0
                                    ? "grid-cols-3"
                                    : "grid-cols-1"
                            } ${
                                mode === "dark"
                                    ? "border-white/20"
                                    : "border-smothDark/10"
                            } grid grid-cols-3 justify-center items-center h-32 w-full border-t-[1px]`}
                        >
                            {specificUserPosts !== undefined &&
                            specificUserPosts?.length > 0 ? (
                                specificUserPosts.map(
                                    (post, index) =>
                                        index <= 2 && (
                                            <div
                                                key={post.id}
                                                className="w-full h-full relative"
                                            >
                                                <Link
                                                    href={`${pathname}?postId=${post.id}`}
                                                    scroll={false}
                                                >
                                                    <a className="w-full h-full relative">
                                                        <div className="w-full h-full relative">
                                                            <Image
                                                                src={post.img}
                                                                layout="fill"
                                                                className="object-cover"
                                                                alt={
                                                                    post.userName
                                                                }
                                                                priority
                                                            />
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        )
                                )
                            ) : (
                                <div className="w-full h-full">
                                    <div className="flex flex-col justify-center items-center pt-2">
                                        <div className="font-thin text-xs">
                                            <div className="border-[1px] p-2 rounded-full">
                                                <BsCamera
                                                    className={`${
                                                        mode === "dark"
                                                            ? "text-white/80"
                                                            : "text-darkGray/70 "
                                                    } h-7 w-7 `}
                                                />
                                            </div>
                                        </div>
                                        <h1 className="font-bold pt-2">
                                            No Posts Yet
                                        </h1>
                                        <p className="pt-0.5 px-1 text-xs text-center">
                                            When{" "}
                                            <span className="font-bold">
                                                {specificUser.userName}
                                            </span>{" "}
                                            When posts, you&apos;ll see their
                                            photos and videos here.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className={`${
                                currentUser.userName === userName && "hidden"
                            } flex justify-between items-center space-x-2 w-full px-2 py-3`}
                        >
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40 "
                                        : "border-gray-600/25 "
                                } flex w-full justify-center items-center border-[1px] py-1 rounded-md`}
                            >
                                <span className="font-semibold">Message</span>
                            </div>
                            <div
                                onClick={toggleFollowFollowing.bind(
                                    null,
                                    buttonState,
                                    userName,
                                    specificUser.fullName,
                                    specificUser.userImg
                                )}
                                className={`${
                                    (buttonState === "pending" ||
                                        buttonState === "following") &&
                                    mode === "dark"
                                        ? "border-gray-600/40 "
                                        : "border-gray-600/25 "
                                } ${
                                    buttonState === "follow"
                                        ? "bg-lightBlue text-white border-transparent cursor-pointer"
                                        : buttonState === "following" &&
                                          "cursor-pointer"
                                }  flex w-full justify-center items-center border-[1px] py-1 rounded-md `}
                            >
                                <span className="font-semibold">
                                    {buttonState === "following" ? (
                                        "Following"
                                    ) : buttonState === "follow" ? (
                                        "Follow"
                                    ) : (
                                        <Spinner className="scale-[0.2] -mt-1 py-3.5 mr-2 w-8 h-5" />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopUpUserDataModel;
