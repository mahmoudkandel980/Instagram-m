import { useContext } from "react";
import { useRouter } from "next/router";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";

import CommentOrReplyModel from "../../../context/commentOrReplyModel-context";
import ToggleMode from "../../../context/darkMode";
import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";
import { UserInterface } from "../../../interfaces/user-interfaces";

const DeleteCommentRepliesModel = (props: UserInterface): JSX.Element => {
    const { currentUser } = props;

    const router = useRouter();
    const { postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const commentOrReplyModelCtx = useContext(CommentOrReplyModel);
    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );

    const { mode } = modeCtx;
    const { removeComment, removeReply, comments } =
        SpecificPostCommentReplyDataCtx;
    const {
        commentOrReply,
        deleteCommentOrReplyHandler,
        commentData,
        replyData,
    } = commentOrReplyModelCtx;
    const { belongsToUser, commentId, replyId, type } = commentOrReply;

    const hideModelHandler = () => {
        deleteCommentOrReplyHandler("", "", "", false, false);
    };

    // comment
    const deleteCommentHandler = async () => {
        removeComment(commentId);
        hideModelHandler();

        // firebase delete comment
        const commentRef = doc(db, "posts", `${postId}`);
        await updateDoc(commentRef, {
            comments: arrayRemove(commentData),
        });
    };

    // reply
    const deleteReplyHandler = async () => {
        const targetComment = comments.filter(
            (comment) => comment.id === replyData.commentId
        );

        const repliesRef = doc(db, "posts", `${postId}`);

        await updateDoc(repliesRef, {
            comments: arrayRemove(...targetComment),
        });

        await updateDoc(repliesRef, {
            comments: arrayUnion({
                comment: targetComment[0].comment,
                fullName: targetComment[0].fullName,
                id: targetComment[0].id,
                likes: targetComment[0].likes,
                replys: targetComment[0].replys.filter(
                    (reply) => reply.replyId !== replyId
                ),
                timestamp: targetComment[0].timestamp,
                userImg: targetComment[0].userImg,
                userName: targetComment[0].userName,
            }),
        });

        removeReply(commentId, replyId);
        hideModelHandler();
    };

    return (
        <div className="fixed z-[100] -top-2.5 sm:-top-1.5 left-0 w-full h-full">
            <div
                onClick={hideModelHandler}
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/30"
                } w-full h-full`}
            ></div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-smothDark text-white"
                        : "bg-gray-100 text-sm font-boldothDark"
                } 
                 fixed z-[10] top-[50%] left-[50%] w-72 sm:w-96 rounded-md  -translate-x-36 sm:-translate-x-48 -translate-y-20
                } `}
            >
                {belongsToUser ? (
                    type === "comment" ? (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                } flex justify-center items-center border-b-[1px] py-3 w-full text-sm font-bold text-lightRed `}
                            >
                                <button onClick={hideModelHandler}>
                                    Report
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                } flex justify-center items-center border-b-[1px] py-3 w-full text-sm font-bold text-lightRed `}
                            >
                                <button onClick={deleteCommentHandler}>
                                    Delete
                                </button>
                            </div>
                            <div
                                className={`flex justify-center items-center py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                } flex justify-center items-center border-b-[1px] py-3 w-full text-sm font-bold text-lightRed `}
                            >
                                <button onClick={hideModelHandler}>
                                    Report
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                } flex justify-center items-center border-b-[1px] py-3 w-full text-sm font-bold text-lightRed `}
                            >
                                <button onClick={deleteReplyHandler}>
                                    Delete
                                </button>
                            </div>
                            <div
                                className={`flex justify-center items-center py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="w-full flex flex-col justify-center items-center">
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-gray-600/40"
                                    : "border-gray-600/10"
                            } flex justify-center items-center border-b-[1px] py-3 w-full text-sm font-bold text-lightRed `}
                        >
                            <button onClick={hideModelHandler}>Report</button>
                        </div>
                        <div
                            className={`flex justify-center items-center py-3 w-full text-sm`}
                        >
                            <button onClick={hideModelHandler}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteCommentRepliesModel;
