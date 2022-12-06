import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";

import Replies from "./replies";
import PopUpUserDataModel from "../popUpUserDataModel";
import DocumentetedUsers from "../../ui/documentetedUsers";

import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";
import DeleteSpecificCommentOrReply from "../../../context/commentOrReplyModel-context";
import RouterContext from "../../../context/router-context";
import CurrentStory from "../../../context/currentStory-context";

import timestampCommentsReplaysFun from "../../../helpers/timestampCommentsReplaysFun";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { AiOutlineHeart } from "react-icons/ai";
import { BsHeartFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import {
    CommentsInterface,
    CommentDataInterface,
} from "../../../interfaces/specificPost-interface";
import { LikeInterface } from "../../../interfaces/interfaces";
import { PostsInterface } from "../../../interfaces/posts-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const Comments = (
    props: CommentsInterface &
        UserInterface &
        AllUsersInterface &
        PostsInterface &
        StoriesInterface
) => {
    const {
        mode,
        id,
        userImg,
        userName,
        timestamp,
        comment,
        likes,
        replyTo,
        currentUser,
        allUsers,
        posts,
        stories,
    } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);
    const [modifiedLikes, setModifiedLikes] = useState<LikeInterface[]>(likes);
    const [showReplies, setShowReplies] = useState(false);
    const [liked, setLiked] = useState(false);

    const router = useRouter();
    const postId = router.query.postId;

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );
    const DeleteSpecificCommentOrReplyCtx = useContext(
        DeleteSpecificCommentOrReply
    );

    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const { toggleReplyTo, removeCommentLike, addCommentLike, comments } =
        SpecificPostCommentReplyDataCtx;
    const { deleteCommentOrReplyHandler, setCommentDataHandler } =
        DeleteSpecificCommentOrReplyCtx;

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

    // // check if user like comment or reply
    useEffect(() => {
        setModifiedLikes([]);
        likes.forEach((like) => {
            if (like.userName === currentUser.userName) {
                setLiked(true);
            } else {
                setModifiedLikes((prevstate) => prevstate.concat(like));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

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

    const toggleShowHideReplies = () => {
        setShowReplies((prevState) => !prevState);
    };
    const replyToHandler = (id: string, userName: string) => {
        toggleReplyTo(id, userName);
    };

    const toggleLikeHandler = async (id: string) => {
        // firebase comment
        const targetComment = comments.filter((comment) => comment.id === id);

        const likesRef = doc(db, "posts", `${postId}`);

        if (liked) {
            // remove like
            await updateDoc(likesRef, {
                comments: arrayRemove({
                    comment: targetComment[0].comment,
                    fullName: targetComment[0].fullName,
                    id: targetComment[0].id,
                    likes: targetComment[0].likes,
                    replys: targetComment[0].replys,
                    timestamp: targetComment[0].timestamp,
                    userImg: targetComment[0].userImg,
                    userName: targetComment[0].userName,
                }),
            });

            await updateDoc(likesRef, {
                comments: arrayUnion({
                    comment: targetComment[0].comment,
                    fullName: targetComment[0].fullName,
                    id: targetComment[0].id,
                    likes: targetComment[0].likes.filter(
                        (like) => like.userName !== currentUser.userName
                    ),
                    replys: targetComment[0].replys,
                    timestamp: targetComment[0].timestamp,
                    userImg: targetComment[0].userImg,
                    userName: targetComment[0].userName,
                }),
            });

            setLiked(false);
            removeCommentLike(currentUser.userName, comment.id);
        } else {
            // add like
            setLiked(true);
            addCommentLike(
                {
                    fullName: currentUser.fullName,
                    userName: currentUser.userName,
                    userImg: currentUser.userImg,
                },
                comment.id
            );

            await updateDoc(likesRef, {
                comments: arrayRemove({
                    comment: comment.comment,
                    fullName: comment.fullName,
                    id: comment.id,
                    likes: comment.likes,
                    replys: comment.replys,
                    timestamp: comment.timestamp,
                    userImg: comment.userImg,
                    userName: comment.userName,
                }),
            });

            await updateDoc(likesRef, {
                comments: arrayUnion({
                    comment: comment.comment,
                    fullName: comment.fullName,
                    id: comment.id,
                    likes: [
                        ...comment.likes,
                        {
                            fullName: currentUser.fullName,
                            userName: currentUser.userName,
                            userImg: currentUser.userImg,
                        },
                    ],
                    replys: comment.replys,
                    timestamp: comment.timestamp,
                    userImg: comment.userImg,
                    userName: comment.userName,
                }),
            });
        }
    };

    const deleteCommentHandler = (comment: CommentDataInterface) => {
        // firebase comment well be in delete comment reply file
        setCommentDataHandler(comment);
        deleteCommentOrReplyHandler(
            comment.id,
            "", //reply id
            "comment",
            comment.userName === currentUser.userName,
            true
        );
    };

    return (
        <div>
            {/*********************************************************comments*********************************************************/}
            <div className="flex justify-start items-start space-x-2 sm:space-x-3 pr-3 sm:pr-5">
                <div className="rounded-full w-9 h-9 relative cursor-pointer group">
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
                        alt={userName}
                        layout="fill"
                        className="rounded-full"
                    />

                    <PopUpUserDataModel
                        allUsers={allUsers}
                        currentUser={currentUser}
                        posts={posts}
                        userName={userName}
                        className={
                            "top-5 left-4 scale-0 origin-top-left group-hover:top-12 group-hover:left-0 group-hover:scale-100 duration-500"
                        }
                        stories={stories}
                    />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start group">
                    <div>
                        <div
                            className={`  ${
                                userName.length > 20 && "flex-wrap"
                            } text-[14px] cursor-pointer`}
                        >
                            <Link
                                href={
                                    currentUser.userName === userName
                                        ? `profile`
                                        : `${userName}`
                                }
                            >
                                <a
                                    onClick={showRouteCtxHandler}
                                    className={`${
                                        userName.length > 20
                                            ? "inline-block truncate w-20"
                                            : "min-w-max"
                                    } font-bold`}
                                >
                                    {userName}
                                </a>
                            </Link>

                            <span>&nbsp;</span>
                            <DocumentetedUsers
                                className="w-3 h-3"
                                userName={userName}
                            />
                            <span>&nbsp; &nbsp;</span>

                            <span
                                className={`${
                                    mode === "dark"
                                        ? "text-gray-100/90"
                                        : "text-smothDark/60"
                                } font-normal`}
                                style={{ wordBreak: "break-word" }}
                            >
                                {replyTo && (
                                    <span className="text-lightBlue">
                                        @{replyTo}
                                        {"  "}
                                    </span>
                                )}
                                {comment.comment}
                            </span>
                        </div>
                    </div>
                    <div className="relative flex justify-start items-center space-x-2 sm:space-x-4">
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-smothDark/60"
                            } text-[12px] font-medium cursor-default`}
                        >
                            {timestampCommentsReplaysFun(timestamp.seconds)}
                        </span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-smothDark/60"
                            } ${
                                modifiedLikes.length + (liked ? 1 : 0) === 0 &&
                                "hidden"
                            } text-[11px] sm:text-[12px] font-medium cursor-pointer`}
                        >
                            {modifiedLikes.length + (liked ? 1 : 0)} Like
                        </span>
                        <span
                            onClick={replyToHandler.bind(null, id, userName)}
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-smothDark/60"
                            } text-[11px] sm:text-[12px] font-medium cursor-pointer`}
                        >
                            Reply
                        </span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-smothDark/60"
                            } text-[11px] sm:text-[12px] font-medium cursor-pointer`}
                        >
                            See translation
                        </span>
                        <span
                            onClick={deleteCommentHandler.bind(null, comment)}
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-smothDark/60"
                            } text-[11px] sm:text-[12px] font-medium cursor-pointer opacity-0 group-hover:opacity-100 duration-200
                        `}
                        >
                            <BiDotsHorizontalRounded className="w-4 h-4" />
                        </span>
                    </div>
                </div>
                <div className=" sm:pr-8">
                    {liked ? (
                        <span onClick={toggleLikeHandler.bind(null, id)}>
                            <BsHeartFill className="footerheart text-darkRed w-5 h-5 cursor-pointer hover:scale-105 duration-200" />
                        </span>
                    ) : (
                        <span onClick={toggleLikeHandler.bind(null, id)}>
                            <AiOutlineHeart
                                className={`${
                                    mode === "dark"
                                        ? "hover:text-gray-50/50"
                                        : "hover:text-smothDark/70"
                                } footerheart w-5 h-5 cursor-pointer hover:scale-105 duration-200`}
                            />
                        </span>
                    )}
                </div>
            </div>
            {/*********************************************************replies*********************************************************/}
            {comment.replys.length > 0 && (
                <div className="pl-8 sm:pl-12">
                    <div
                        onClick={toggleShowHideReplies}
                        className={`${
                            mode === "dark"
                                ? "text-white/60"
                                : "text-smothDark/60"
                        } ${
                            showReplies ? "py-4" : "py-4 pb-1"
                        } flex justify-start items-center space-x-2 cursor-pointer font-normal text-sm `}
                    >
                        <span
                            className={`${
                                mode === "dark"
                                    ? "bg-white/60"
                                    : "bg-smothDark/60"
                            } w-7 h-[1px]`}
                        ></span>
                        <span>
                            {showReplies ? "Hide" : "View"}{" "}
                            {comment.replys.length > 1 ? "replies" : "reply"}{" "}
                            {!showReplies && `(${comment.replys.length})`}
                        </span>
                    </div>
                    {showReplies &&
                        comment.replys.map((reply) => (
                            <div key={reply.timestamp.seconds} className="pb-2">
                                <Replies
                                    currentUser={currentUser}
                                    mode={mode}
                                    reply={reply}
                                    id={reply.replyId}
                                    likes={reply.likes}
                                    replyTo={reply.replyTo}
                                    timestamp={reply.timestamp}
                                    userImg={reply.userImg}
                                    userName={reply.userName}
                                    allUsers={allUsers}
                                    posts={posts}
                                    stories={stories}
                                    commentId={id}
                                />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Comments;
