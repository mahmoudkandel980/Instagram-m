import { createContext, useState } from "react";

import { Props } from "../interfaces/context-interfaces";

import {
    PostCommentReplyDataInterface,
    PostReplyDataInterface,
    ReplyToInterface,
} from "../interfaces/context-interfaces";
import { LikeInterface } from "../interfaces/interfaces";

const initialReplyTo: ReplyToInterface = { id: "", userName: "" };

const initailComments: PostCommentReplyDataInterface[] = [
    {
        id: "",
        fullName: "",
        userName: "",
        userImg: "",
        comment: "",
        timestamp: {
            seconds: 0,
            nanoseconds: 0,
        },
        likes: [
            {
                fullName: "",
                userName: "",
                userImg: "",
            },
        ],
        replys: [
            {
                commentId: "",
                replyId: "",
                fullName: "",
                userName: "",
                userImg: "",
                reply: "",
                replyTo: "",
                timestamp: {
                    seconds: 0,
                    nanoseconds: 0,
                },
                likes: [
                    {
                        fullName: "",
                        userName: "",
                        userImg: "",
                    },
                ],
            },
        ],
    },
];

const SpecificPostCommentReplyData = createContext({
    comments: initailComments,
    addAllComment: (postcomments: PostCommentReplyDataInterface[]): void => {},

    replyTo: initialReplyTo,
    toggleReplyTo: (id: string, userName: string): void => {},

    // comments methods
    addComment: (commentData: PostCommentReplyDataInterface): void => {},
    removeComment: (commentId: string): void => {},

    // commentLike methods
    addCommentLike: (likeData: LikeInterface, id: string): void => {},
    removeCommentLike: (currentUserName: string, id: string): void => {},

    // replys methods
    addReply: (id: string, replyData: PostReplyDataInterface) => {},
    removeReply: (commentId: string, replyId: string): void => {},

    // replyLike methods
    addReplyLike: (
        likeData: LikeInterface,
        commentId: string,
        replyId: string
    ): void => {},
    removeReplyLike: (commentId: string, replyId: string): void => {},
});

export const SpecificPostCommentReplyDataProvider = (
    props: Props
): JSX.Element => {
    const { children } = props;
    const [comments, setComments] =
        useState<PostCommentReplyDataInterface[]>(initailComments);

    const [replyTo, setReplyTo] = useState<ReplyToInterface>(initialReplyTo);

    // add all comments
    const addAllComment = (postcomments: PostCommentReplyDataInterface[]) => {
        let commentsArray = [...postcomments];
        setComments([...commentsArray]);
    };

    // add comment to comments
    const addComment = (commentData: PostCommentReplyDataInterface) => {
        setComments((prevState) => prevState.concat(commentData));
    };

    // remove comment
    const removeComment = (commentId: string) => {
        setComments((prevState) =>
            prevState.filter((comment) => comment.id !== commentId)
        );
    };

    // add commentLike to comments
    const addCommentLike = (likeData: LikeInterface, id: string) => {
        let commentsCopy: PostCommentReplyDataInterface[] = JSON.parse(
            JSON.stringify(comments)
        );

        commentsCopy.map((comment) => {
            comment.id === id && comment.likes.splice(0, 0, likeData);
        });
        setComments(commentsCopy);
    };

    // remove commentLike to comments
    const removeCommentLike = (username: string, id: string) => {
        let commentsCopy: PostCommentReplyDataInterface[] = [...comments];

        commentsCopy.map((comment) => {
            if (comment.id === id) {
                comment.likes.forEach((like, index) => {
                    if (like.userName === username) {
                        comment.likes.splice(index, 1);
                        return;
                    }
                });
            }
        });

        setComments(commentsCopy);
    };

    // add reply to specific comment
    const addReply = (id: string, replyData: PostReplyDataInterface) => {
        let commentsCopy: PostCommentReplyDataInterface[] = JSON.parse(
            JSON.stringify(comments)
        );

        commentsCopy.map((comment) => {
            comment.id === id &&
                comment.replys.splice(comment.replys.length, 0, replyData);
        });
        setComments(commentsCopy);
    };

    // remove reply from specific comment
    const removeReply = (commentId: string, replyId: string) => {
        let commentsCopy: PostCommentReplyDataInterface[] = [...comments];

        commentsCopy.map((comment) => {
            if (comment.id === commentId) {
                comment.replys.forEach((reply, index) => {
                    if (reply.replyId === replyId) {
                        comment.replys.splice(index, 1);
                        return;
                    }
                });
            }
        });

        setComments(commentsCopy);
    };

    // add replyLike to comments
    const addReplyLike = (
        likeData: LikeInterface,
        commentId: string,
        replyId: string
    ) => {
        let commentsCopy: PostCommentReplyDataInterface[] = JSON.parse(
            JSON.stringify(comments)
        );

        commentsCopy.map((comment) => {
            comment.id === commentId &&
                comment.replys.map((reply, index) => {
                    if (reply.replyId === replyId) {
                        reply.likes.splice(0, 0, likeData);
                    }
                });
        });
        setComments(commentsCopy);
    };

    // remove replyLike to comments
    const removeReplyLike = (commentId: string, replyId: string) => {
        let commentsCopy: PostCommentReplyDataInterface[] = [...comments];

        commentsCopy.map((comment) => {
            if (comment.id === commentId) {
                comment.replys.map((reply, index) => {
                    if (reply.replyId === replyId) {
                        reply.likes.splice(index, 1);
                    }
                });
            }
        });

        setComments(commentsCopy);
    };

    // get username and check if you write a comment or reply
    const toggleReplyTo = (id: string, userName: string) => {
        setReplyTo({ id: id, userName: userName });
    };

    const data = {
        comments,
        addAllComment,

        replyTo,
        toggleReplyTo,

        // comment methods
        addComment,
        removeComment,

        // commentlikes methods
        addCommentLike,
        removeCommentLike,

        // replys methods
        addReply,
        removeReply,

        // replyLikes methods
        addReplyLike,
        removeReplyLike,
    };
    return (
        <SpecificPostCommentReplyData.Provider value={data}>
            {children}
        </SpecificPostCommentReplyData.Provider>
    );
};

export default SpecificPostCommentReplyData;
