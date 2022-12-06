import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { db } from "../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";

import SpecificPostHeader from "./specificPost/specificPostHeader";
import SpecificPostCaption from "./specificPost/specificPostCaption";
import SpecificPostComments from "./specificPost/specificPostComments";
import SpecificPostFooter from "./specificPost/specificPostFooter";
import Likes from "./likes";
import DeleteCommentRepliesModel from "./specificPost/deleteCommentReplyModel";
import UnfollowModel from "./unfollowModel";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import ToggleMode from "../../context/darkMode";
import SpecificPostCommentReplyData from "../../context/specificPostCommentReplyData-context";
import CommentOrReplyModel from "../../context/commentOrReplyModel-context";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";

import { BsHeartFill } from "react-icons/bs";

import { LikeInterface } from "../../interfaces/interfaces";
import { StoriesInterface } from "../../interfaces/stories-interfaces";
import {
    PostInterface,
    PostsInterface,
} from "../../interfaces/posts-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../interfaces/user-interfaces";

import { IoMdClose, IoIosArrowBack } from "react-icons/io";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SpecificPostModel = (
    props: PostsInterface & UserInterface & AllUsersInterface & StoriesInterface
) => {
    const { posts, currentUser, allUsers, stories } = props;

    const [specificPost, SetSpecificPost] = useState<PostInterface>();
    const [postClicked, setPostClicked] = useState(false);
    const [helperPostClicked, setHelperPostClicked] = useState(false);

    const [Liked, setLiked] = useState(false);
    const [modifiedLikes, setModifiedLikes] = useState<LikeInterface[]>([]);
    const [saved, setSaved] = useState(false);

    const modeCtx = useContext(ToggleMode);
    const commentOrReplyModelCtx = useContext(CommentOrReplyModel);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );

    const { mode } = modeCtx;
    const { addAllComment } = SpecificPostCommentReplyDataCtx;
    const { showLikesModel } = showHideModelsCtx;
    const { unfollowingModel } = currentUserFollowingCtx;
    const { showModel } = commentOrReplyModelCtx.commentOrReply;

    const router = useRouter();
    const pathname = router.pathname;
    const { userName, postId } = router.query;

    //make helper state with true
    /*Explain
    effect of likes render in first so fade in like in image fade in the first
    and helperPostClicked put it with false when it false effect in start will
    not be render after 50 millsecond put helperPostClicked with true to get 
     effects when liked is schanged */
    useEffect(() => {
        const timer = setTimeout(() => {
            setHelperPostClicked(true);
        }, 50);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    // remove animatin of heart
    useEffect(() => {
        const timer = setTimeout(() => {
            setPostClicked(false);
        }, 700);
        return () => {
            clearTimeout(timer);
        };
    }, [postClicked]);

    // get specific post from firebase to add comments , replies and....
    useEffect(() => {
        posts.forEach((post) => {
            post.id.toString() === postId && SetSpecificPost({ ...post });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, posts, pathname]);

    // add specific post commments to context
    useEffect(() => {
        if (specificPost?.comments) {
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
    ]);

    // REMOVE USER LIKE FROM LIKES LIST IF EXIST
    useEffect(() => {
        setModifiedLikes([]);
        specificPost?.likes.forEach((like) => {
            if (like.userName !== currentUser.userName) {
                setModifiedLikes((prevState) => prevState.concat(like));
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specificPost, specificPost?.likes]);

    // check if post has usersName like or not and post saved or not
    useEffect(() => {
        setLiked(false);
        setSaved(false);

        specificPost?.saves.forEach((save) => {
            if (save.userName === currentUser.userName) {
                setSaved(true);
                return;
            }
        });
        specificPost?.likes.forEach((like) => {
            if (like.userName === currentUser.userName) {
                setLiked(true);
                return;
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specificPost?.likes, specificPost?.saves, specificPost]);

    // rended LikedPosts
    useEffect(() => {
        if (helperPostClicked) {
            setPostClicked(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Liked]);

    const hideModelHandler = () => {
        router.push(`${userName ? userName : pathname}`, undefined, {
            scroll: false,
        });
    };

    const likePostHandler = async (id: any) => {
        setPostClicked(true);
        setLiked((prevState) => !prevState);

        // firebase
        const userLike = {
            fullName: currentUser.fullName,
            userName: currentUser.userName,
            userImg: currentUser.userImg,
        };
        const likesRef = doc(db, "posts", id);

        if (Liked) {
            // remove like
            setLiked(false);
            await updateDoc(likesRef, {
                likes: arrayRemove(userLike),
            });
        } else {
            // add like
            setLiked(true);
            await updateDoc(likesRef, {
                likes: arrayUnion({ ...userLike }),
            });
        }
    };

    return (
        <>
            {specificPost && (
                <div className="fixed left-0 top-0 w-full h-full z-[100]">
                    <div className="fixed z-[100] top-0 left-0 w-screen h-full">
                        <div
                            className={`${
                                mode === "dark" ? "bg-dark/30" : "bg-dark/70"
                            } w-full h-full`}
                            onClick={hideModelHandler}
                        ></div>

                        <div
                            onClick={hideModelHandler}
                            className={`${
                                showLikesModel.state && "hidden"
                            } close-btn fixed top-1 sm:top-10 lg:top-14 left-3 sm:left-auto sm:right-2 lg:right-1 xl:right-5 z-[1000]`}
                        >
                            <IoMdClose className="hidden sm:block w-7 h-7 cursor-pointer text-white" />
                            <IoIosArrowBack
                                className={`${
                                    mode === "dark"
                                        ? "bg-white/90 text-smothDark"
                                        : "bg-smothDark/90 text-white"
                                } block sm:hidden w-6 h-6 cursor-pointer rounded-full `}
                            />
                        </div>

                        <div
                            className={`${
                                mode === "dark"
                                    ? "bg-smothDark text-white"
                                    : "bg-gray-100 text-smothDark"
                            } overflow-y-scroll overflow-x-hidden sm:overflow-hidden fixed z-[110] -top-1.5 left-0 w-screen h-screen sm:h-[90%] xl:h-[80%] sm:w-[95%] xl:w-[85%] sm:translate-x-[2.5%] xl:translate-x-[7.5%] sm:translate-y-[8%] xl:translate-y-[16%] sm:rounded-lg`}
                        >
                            <AnimatePresence>
                                {showModel && (
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
                                        {showModel && (
                                            <DeleteCommentRepliesModel
                                                currentUser={currentUser}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex flex-col sm:flex-row items-center justify-start h-full w-full relative">
                                {/* left section in large screens || top section in small screens */}
                                <div className="flex-1 w-full sm:w-[45%] sm:flex-auto lg:flex-1 lg:w-full h-full">
                                    <div className="flex justify-center items-center relative w-full h-full">
                                        <Image
                                            onClick={likePostHandler.bind(
                                                null,
                                                postId
                                            )}
                                            src={specificPost.img}
                                            alt={specificPost.caption}
                                            layout="fill"
                                            className="object-contain"
                                        />
                                        {postClicked && (
                                            <div className="absolute top-0 left-0 h-full w-full bg-transparent flex justify-center items-center">
                                                <BsHeartFill className=" imgheart w-10 h-10 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* right || bottom section */}
                                <div className="lg:flex-1 flex flex-col justify-start items-start w-full h-96 sm:h-full relative">
                                    {/* sticky header */}
                                    <SpecificPostHeader
                                        mode={mode}
                                        specificPost={specificPost}
                                        currentUser={currentUser}
                                        allUsers={allUsers}
                                        posts={posts}
                                        stories={stories}
                                    />
                                    <div className="hideScrollBar flex-1 flex flex-col sm:overflow-auto w-full px-2 sm:px-5 pr-2 pb-36 sm:pb-5">
                                        <div className="pt-5"></div>
                                        {/* caption */}
                                        {specificPost.caption && (
                                            <SpecificPostCaption
                                                mode={mode}
                                                specificPost={specificPost}
                                                currentUser={currentUser}
                                                allUsers={allUsers}
                                                posts={posts}
                                                stories={stories}
                                            />
                                        )}
                                        {/* comments */}
                                        {specificPost.comments && (
                                            <SpecificPostComments
                                                mode={mode}
                                                currentUser={currentUser}
                                                allUsers={allUsers}
                                                posts={posts}
                                                stories={stories}
                                            />
                                        )}
                                    </div>

                                    <SpecificPostFooter
                                        currentUser={currentUser}
                                        mode={mode}
                                        specificPost={specificPost}
                                        modifiedLikes={modifiedLikes}
                                        Liked={Liked}
                                        setLiked={setLiked}
                                        saved={saved}
                                        setSaved={setSaved}
                                        stories={stories}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <AnimatePresence>
                        {(showLikesModel.state ||
                            unfollowingModel.showUnfollowingModel) && (
                            <motion.div
                                className=" top-0 left-0 fixed w-full h-full z-[100]"
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
                                {showLikesModel.state && (
                                    <Likes
                                        mode={mode}
                                        posts={posts}
                                        currentUser={currentUser}
                                        stories={stories}
                                    />
                                )}
                                {unfollowingModel.showUnfollowingModel && (
                                    <UnfollowModel
                                        mode={mode}
                                        userName={unfollowingModel.userName}
                                        userImg={
                                            unfollowingModel.userImg ||
                                            getPhotoSrcFun(
                                                unfollowingModel.userName
                                            )
                                        }
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
};

export default SpecificPostModel;
