import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import SpecificPostModel from "../models/specificPostModel";
import ProfileUpperData from "./profileUpperData";
import ProfileLowerData from "./profileLowerData";
import PostSettingsModel from "../models/postSettingsModel";

import ToggleMode from "../../context/darkMode";
import HideModel from "../../context/hideModels";
import PostsContext from "../../context/posts-context";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import UnfollowModel from "../models/unfollowModel";
import RemoveFollowerModel from "../models/removeFollowerModel";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { StoriesInterface } from "../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../interfaces/user-interfaces";
import {
    PostsInterface,
    PostInterface,
} from "../../interfaces/posts-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const ProfileData = (
    props: UserInterface & PostsInterface & AllUsersInterface & StoriesInterface
): JSX.Element => {
    const { currentUser, posts, allUsers, stories } = props;

    const [showHideProfileModel, setShowHideProfileModel] = useState(false);

    const [userPosts, setUserPosts] = useState<PostInterface[]>([]);
    const [savedPosts, setSavedPosts] = useState<PostInterface[]>([]);

    const [rerenderPosts, setRerenderPosts] = useState<boolean>(false);

    const router = useRouter();
    const aspath = router.asPath;
    const { postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const postsCtx = useContext(PostsContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const hideModelCtx = useContext(HideModel);

    const { mode } = modeCtx;
    const { postsDataCtx, getInitailPostsHandler } = postsCtx;
    const { showPostSettingsModel, profileQuery } = showHideModelsCtx;
    const { unfollowingModel, removeFollowersModel } = currentUserFollowingCtx;
    const {
        toggleProfileModel,
        toggleShowHideAllModelsHandler,
        toggleProfileModelHandler,
    } = hideModelCtx;

    // rerender posts after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setRerenderPosts(true);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [posts, postId]);

    // put posts and saved posts in postsContext
    useEffect(
        () => {
            setSavedPosts([]);
            setUserPosts([]);

            posts.forEach((post) => {
                post.saves.forEach((savedPost) => {
                    if (savedPost.userName === currentUser.userName) {
                        setSavedPosts((prevState) => prevState.concat(post));
                        return;
                    }
                });
            });

            posts.forEach((post) => {
                if (post.userName === currentUser.userName) {
                    setUserPosts((prevState) => prevState.concat(post));
                    return;
                }
            });

            setRerenderPosts(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [posts, postId, rerenderPosts]
    );

    useEffect(() => {
        if (profileQuery == "saved") {
            let savedPostArray = [...savedPosts];
            getInitailPostsHandler(savedPostArray);
        } else {
            let userPostArray = [...userPosts];
            getInitailPostsHandler(userPostArray);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPosts, savedPosts, profileQuery, aspath]);

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
            } min-h-screen`}
        >
            <div
                className={`container sm:mx-auto sm:px-0 md:px-5 lg:px-[100px] xl:px-[180px] 2xl:px-[255px] pt-12 sm:pt-24`}
            >
                <div className="flex flex-col justify-center">
                    <div className=" lg:px-[70px] xl:px-[70px] 2xl:px-[70px]">
                        <ProfileUpperData
                            currentUser={currentUser}
                            posts={userPosts}
                            stories={stories}
                        />
                    </div>
                    <ProfileLowerData posts={postsDataCtx} />
                </div>
            </div>
            {/* specific post */}
            <AnimatePresence>
                {(postId ||
                    unfollowingModel.showUnfollowingModel ||
                    removeFollowersModel.showRemoveFollowersModel) && (
                    <motion.div
                        className="top-0 left-0 fixed w-full h-full z-[100]"
                        initial={{
                            opacity: 0,
                            transform: "scale(1.5)",
                            top: "5px",
                        }}
                        animate={{
                            opacity: 1,
                            transform: "scale(1)",
                            top: "5px",
                        }}
                        exit={{
                            opacity: 0,
                            transform: "scale(1.1)",
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        {postId && (
                            <SpecificPostModel
                                currentUser={currentUser}
                                posts={postsDataCtx}
                                allUsers={allUsers}
                                stories={stories}
                            />
                        )}
                        {unfollowingModel.showUnfollowingModel && !postId && (
                            <UnfollowModel
                                mode={mode}
                                userName={unfollowingModel.userName}
                                userImg={
                                    unfollowingModel.userImg ||
                                    getPhotoSrcFun(unfollowingModel.userName)
                                }
                            />
                        )}
                        {removeFollowersModel.showRemoveFollowersModel &&
                            !postId && (
                                <RemoveFollowerModel
                                    mode={mode}
                                    userName={removeFollowersModel.userName}
                                    userImg={
                                        removeFollowersModel.userImg ||
                                        getPhotoSrcFun(
                                            removeFollowersModel.userName
                                        )
                                    }
                                />
                            )}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {postId && showPostSettingsModel.id && (
                    <motion.div
                        className="top-0 left-0 fixed w-full h-full z-[100]"
                        initial={{
                            opacity: 0,
                            transform: "scale(1.5)",
                            top: "5px",
                        }}
                        animate={{
                            opacity: 1,
                            transform: "scale(1)",
                            top: "5px",
                        }}
                        exit={{
                            opacity: 0,
                            transform: "scale(1.1)",
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        {showPostSettingsModel.id &&
                            postId &&
                            posts.map(
                                (post) =>
                                    showPostSettingsModel.id === post.id && (
                                        <PostSettingsModel
                                            key={post.id}
                                            caption={post.caption}
                                            comments={post.comments}
                                            id={post.id}
                                            img={post.img}
                                            likes={post.likes}
                                            userName={post.userName}
                                            userImg={
                                                post.userImg ||
                                                getPhotoSrcFun(post.userName)
                                            }
                                            timestamp={post.timestamp}
                                            fullName={post.fullName}
                                            saves={post.saves}
                                            currentUser={currentUser}
                                        />
                                    )
                            )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileData;
