import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";

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

import { PostsInterface } from "../../../interfaces/posts-interfaces";
import {
    RepliesInterface,
    ReplyDataInterface,
    CommentDataInterface,
} from "../../../interfaces/specificPost-interface";
import {
    LikeInterface,
    CommentIdInterface,
} from "../../../interfaces/interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const Replies = (
    props: RepliesInterface &
        UserInterface &
        AllUsersInterface &
        PostsInterface &
        StoriesInterface &
        CommentIdInterface
) => {
    const {
        id,
        likes,
        mode,
        replyTo,
        timestamp,
        userImg,
        userName,
        currentUser,
        reply,
        allUsers,
        posts,
        stories,
        commentId,
    } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();
    const [storyClicked, setStoryClicked] = useState(false);
    const [modifiedLikes, setModifiedLikes] = useState<LikeInterface[]>(likes);
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
    const { toggleReplyTo, comments, addReplyLike, removeReplyLike } =
        SpecificPostCommentReplyDataCtx;

    const { deleteCommentOrReplyHandler, setReplyDataHandler } =
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

    // check if user like comment or reply
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

    const replyToHandler = (id: string, userName: string) => {
        toggleReplyTo(id, userName);
    };

    const toggleLikeHandler = async (id: string, replyTo: string | null) => {
        // firebase reply
        const likesRef = doc(db, "posts", `${postId}`);
        const targetComments: CommentDataInterface[] = JSON.parse(
            JSON.stringify(comments)
        );
        const targetComment = targetComments.filter(
            (comment) => comment.id === reply.commentId
        );

        if (liked) {
            // remove like
            let modifiedReplies: ReplyDataInterface[] = JSON.parse(
                JSON.stringify(targetComment[0].replys)
            );
            modifiedReplies.map((specificReply, index) => {
                specificReply.replyId === id &&
                    specificReply.likes.map(
                        (like, index) =>
                            like.userName === currentUser.userName &&
                            specificReply.likes.splice(index, 1)
                    );
            });

            await updateDoc(likesRef, {
                comments: arrayRemove(...targetComment),
            });
            await updateDoc(likesRef, {
                comments: arrayUnion({
                    comment: targetComment[0].comment,
                    fullName: targetComment[0].fullName,
                    id: targetComment[0].id,
                    likes: targetComment[0].likes,
                    replys: modifiedReplies,
                    timestamp: targetComment[0].timestamp,
                    userImg: targetComment[0].userImg,
                    userName: targetComment[0].userName,
                }),
            });

            removeReplyLike(commentId, id);
            setLiked(false);
        } else {
            // add like
            let modifiedReplies: ReplyDataInterface[] = JSON.parse(
                JSON.stringify([...targetComment[0].replys])
            );
            modifiedReplies.map((currentReply) => {
                if (currentReply.replyId === reply.replyId) {
                    currentReply.likes.splice(0, 0, {
                        fullName: currentUser.fullName,
                        userName: currentUser.userName,
                        userImg: currentUser.userImg,
                    });
                }
            });

            await updateDoc(likesRef, {
                comments: arrayRemove(...targetComment),
            });
            await updateDoc(likesRef, {
                comments: arrayUnion({
                    comment: targetComment[0].comment,
                    fullName: targetComment[0].fullName,
                    id: targetComment[0].id,
                    likes: targetComment[0].likes,
                    replys: modifiedReplies,
                    timestamp: targetComment[0].timestamp,
                    userImg: targetComment[0].userImg,
                    userName: targetComment[0].userName,
                }),
            });

            setLiked(true);
            addReplyLike(
                {
                    fullName: currentUser.fullName,
                    userName: currentUser.userName,
                    userImg: currentUser.userImg,
                },
                commentId,
                id
            );
        }
    };

    const deleteReplyHandler = (reply: ReplyDataInterface) => {
        // firebase reply
        setReplyDataHandler(reply);

        deleteCommentOrReplyHandler(
            reply.commentId,
            reply.replyId,
            "reply",
            reply.userName === currentUser.userName,
            true
        );
    };

    return (
        <div className="flex justify-start items-start space-x-3 pr-3 sm:pr-5">
            <div className="rounded-full w-9 h-9 relative cursor-pointer group">
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
                        } text-[13px] sm:text-[14px] cursor-pointer`}
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
                            {reply.reply}
                        </span>
                    </div>
                </div>
                <div className="flex justify-start items-center pt-1 space-x-2 sm:space-x-4">
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-smothDark/60"
                        } text-[10px] sm:text-[12px] font-medium cursor-default`}
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
                        } text-[10px] sm:text-[12px] font-medium cursor-pointer`}
                    >
                        {modifiedLikes.length + (liked ? 1 : 0)} Like
                    </span>
                    <span
                        onClick={replyToHandler.bind(
                            null,
                            reply.commentId,
                            userName
                        )}
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-smothDark/60"
                        } text-[10px] sm:text-[12px] font-medium cursor-pointer`}
                    >
                        Reply
                    </span>
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-smothDark/60"
                        } text-[10px] sm:text-[12px] font-medium cursor-pointer`}
                    >
                        See translation
                    </span>
                    <span
                        onClick={deleteReplyHandler.bind(null, reply)}
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-smothDark/60"
                        } text-[10px] sm:text-[12px] font-medium cursor-pointer opacity-0 group-hover:opacity-100 duration-200
                        `}
                    >
                        <BiDotsHorizontalRounded className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                </div>
            </div>
            <div className=" sm:pr-8">
                {liked ? (
                    <span onClick={toggleLikeHandler.bind(null, id, replyTo)}>
                        <BsHeartFill className="footerheart text-darkRed w-5 h-5 cursor-pointer hover:scale-105 duration-200" />
                    </span>
                ) : (
                    <span onClick={toggleLikeHandler.bind(null, id, replyTo)}>
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
    );
};

export default Replies;
