import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import SpecificPostModel from "../models/specificPostModel";
import SpecificUserUpperData from "./specificUserUpperData";
import SpecificUserLowerData from "./specificUserLowerData";
import PostSettingsModel from "../models/postSettingsModel";
import UnfollowModel from "../models/unfollowModel";

import ToggleMode from "../../context/darkMode";
import HideModel from "../../context/hideModels";
import PostsContext from "../../context/posts-context";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import {
    UserInterface,
    AllUsersInterface,
} from "../../interfaces/user-interfaces";
import { SpecificUserInterface } from "../../interfaces/specificUser-interface";
import { StoriesInterface } from "../../interfaces/stories-interfaces";
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

const SpecificUserData = (
    props: UserInterface &
        PostsInterface &
        SpecificUserInterface &
        AllUsersInterface &
        StoriesInterface
): JSX.Element => {
    const { currentUser, posts, user, allUsers, stories } = props;

    const [showHideProfileModel, setShowHideProfileModel] = useState(true);

    const [userPosts, setUserPosts] = useState<PostInterface[]>([]);

    const [rerenderPosts, setRerenderPosts] = useState<boolean>(false);

    const modeCtx = useContext(ToggleMode);
    const postsCtx = useContext(PostsContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const hideModelCtx = useContext(HideModel);

    const { mode } = modeCtx;
    const { postsDataCtx, getInitailPostsHandler } = postsCtx;
    const { showPostSettingsModel, specificUserQuery } = showHideModelsCtx;
    const { unfollowingModel } = currentUserFollowingCtx;
    const {
        toggleProfileModel,
        toggleShowHideAllModelsHandler,
        toggleProfileModelHandler,
    } = hideModelCtx;

    const router = useRouter();
    const aspath = router.asPath;
    const { postId } = router.query;

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
            setUserPosts([]);
            posts.forEach((post) => {
                if (post.userName === user.userName) {
                    setUserPosts((prevState) => prevState.concat(post));
                    return;
                }
            });

            setRerenderPosts(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user.userName, posts, postId, rerenderPosts]
    );

    useEffect(() => {
        let userPostArray = [...userPosts];
        getInitailPostsHandler(userPostArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPosts, specificUserQuery, postId, aspath, user.userName]);

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
                    <SpecificUserUpperData
                        user={user}
                        posts={userPosts}
                        currentUser={currentUser}
                        allUsers={allUsers}
                        stories={stories}
                    />
                    <SpecificUserLowerData posts={postsDataCtx} />
                </div>
            </div>
            {/* specific post */}
            <AnimatePresence>
                {(postId || unfollowingModel.showUnfollowingModel) && (
                    <motion.div
                        className="top-0 left-0 fixed w-full h-full z-[1000]"
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
                        {postId && !rerenderPosts && (
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

export default SpecificUserData;
