import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import Stories from "./stories/stories";
import Posts from "./posts/posts";
import Suggestions from "./suggesions/suggestions";
import SpecificPostModel from "../models/specificPostModel";
import Likes from "../models/likes";
import PostSettingsModel from "../models/postSettingsModel";
import UnfollowModel from "../models/unfollowModel";

import HideModel from "../../context/hideModels";
import ToggleMode from "../../context/darkMode";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import SpecificPostCommentReplyData from "../../context/specificPostCommentReplyData-context";
import PostsContext from "../../context/posts-context";

import {
    PostsInterface,
    PostInterface,
} from "../../interfaces/posts-interfaces";
import { StoriesInterface } from "../../interfaces/stories-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";
import { AllUsersInterface } from "../../interfaces/user-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const Feed = (
    props: PostsInterface & StoriesInterface & UserInterface & AllUsersInterface
): JSX.Element => {
    const { posts, stories, currentUser, allUsers } = props;

    const [showHideProfileModel, setShowHideProfileModel] = useState(true);

    const [specificPost, SetSpecificPost] = useState<PostInterface>();
    const [rerenderPosts, setRerenderPosts] = useState<boolean>(false);

    const router = useRouter();
    const { postId, removePost } = router.query;

    const hideModelCtx = useContext(HideModel);
    const modeCtx = useContext(ToggleMode);
    const postsCtx = useContext(PostsContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );

    const { mode } = modeCtx;
    const { postsDataCtx, getInitailPostsHandler } = postsCtx;
    const { addAllComment } = SpecificPostCommentReplyDataCtx;
    const { showLikesModel, showPostSettingsModel } = showHideModelsCtx;
    const { unfollowingModel } = currentUserFollowingCtx;
    const {
        toggleShowHideAllModelsHandler,
        toggleProfileModel,
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

    // get specific post to add comments and replies
    useEffect(() => {
        if (postId) {
            posts.forEach((post) => {
                post.id.toString() === postId && SetSpecificPost({ ...post });
            });
        }
        setRerenderPosts(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, router.pathname, posts, rerenderPosts]);

    // add specific post commments to context
    useEffect(() => {
        if (specificPost?.comments && postId) {
            let commentsArray = [...specificPost?.comments];
            addAllComment([...commentsArray]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        postId,
        specificPost,
        specificPost?.comments,
        specificPost?.likes,
        specificPost?.saves,
        postId,
        rerenderPosts,
    ]);

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
                mode === "dark" ? "text-white bg-smothDark" : "text-smothDark "
            } min-h-[80vh]`}
        >
            <div
                className={`${
                    mode === "dark" ? "bg-smothDark" : "bg-gray-100"
                } grid grid-cols-8 justify-start items-start container sm:mx-auto sm:px-0  lg:px-20 xl:px-40 2xl:px-[320px] pt-11 sm:pt-24`}
            >
                <div className="col-span-8 md:col-span-5 ">
                    {/* strioes */}
                    <Stories stories={stories} currentUser={currentUser} />
                    {/* stories upload image model */}

                    {/* posts */}
                    <Posts
                        posts={posts}
                        currentUser={currentUser}
                        allUsers={allUsers}
                        stories={stories}
                    />
                </div>

                {/* suggestion */}
                <Suggestions
                    className="col-span-3 hidden md:block"
                    currentUser={currentUser}
                    allUsers={allUsers}
                    posts={posts}
                    stories={stories}
                />
            </div>
            {/* specific post */}
            <AnimatePresence>
                {(postId ||
                    showLikesModel.state ||
                    showPostSettingsModel.id ||
                    removePost ||
                    unfollowingModel.showUnfollowingModel) && (
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
                                posts={posts}
                                currentUser={currentUser}
                                allUsers={allUsers}
                                stories={stories}
                            />
                        )}
                        {showLikesModel.state && !postId && (
                            <Likes
                                mode={mode}
                                posts={posts}
                                currentUser={currentUser}
                                stories={stories}
                            />
                        )}
                        {showPostSettingsModel.id &&
                            !postId &&
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
                                            userImg={post.userImg}
                                            timestamp={post.timestamp}
                                            fullName={post.fullName}
                                            saves={post.saves}
                                            currentUser={currentUser}
                                        />
                                    )
                            )}
                        {unfollowingModel.showUnfollowingModel && !postId && (
                            <UnfollowModel
                                mode={mode}
                                userName={unfollowingModel.userName}
                                userImg={unfollowingModel.userImg}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* seting to specific post to fade in when click in 3 dots */}
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
                                            userImg={post.userImg}
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

export default Feed;
