import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Props } from "../interfaces/context-interfaces";

import { CommentReplyTargetInterface } from "../interfaces/context-interfaces";
import {
    CommentDataInterface,
    ReplyDataInterface,
} from "../interfaces/specificPost-interface";

const initailCommentOrReplyTarget: CommentReplyTargetInterface = {
    commentId: "",
    replyId: "",
    type: "", //comment or reply
    belongsToUser: false,
    showModel: false,
};

const initailCommentData: CommentDataInterface = {
    id: "",
    fullName: "",
    userName: "",
    userImg: "",
    comment: "",
    timestamp: {
        seconds: 0,
        nanoseconds: 0,
    },
    likes:
        [
            {
                fullName: "",
                userName: "",
                userImg: "",
            },
        ] || [],
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
            likes:
                [
                    {
                        fullName: "",
                        userName: "",
                        userImg: "",
                    },
                ] || [],
        },
    ],
};

const initailReplyData: ReplyDataInterface = {
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
    likes:
        [
            {
                fullName: "",
                userName: "",
                userImg: "",
            },
        ] || [],
};

const CommentOrReplyModel = createContext({
    commentOrReply: initailCommentOrReplyTarget,
    deleteCommentOrReplyHandler: (
        commentId: string,
        replyId: string,
        type: string,
        belongsToUser: boolean,
        showModel: boolean
    ) => {},

    commentData: initailCommentData,
    setCommentDataHandler: (comment: CommentDataInterface): void => {},

    replyData: initailReplyData,
    setReplyDataHandler: (reply: ReplyDataInterface): void => {},
});

export const CommentOrReplyModelProvider = (props: Props): JSX.Element => {
    const { children } = props;

    const [commentOrReply, setCommentOrReply] = useState(
        initailCommentOrReplyTarget
    );
    const [commentData, setCommentData] =
        useState<CommentDataInterface>(initailCommentData);
    const [replyData, setReplyData] =
        useState<ReplyDataInterface>(initailReplyData);

    const router = useRouter();

    useEffect(() => {
        deleteCommentOrReplyHandler("", "", "", false, false);
    }, [router.query.postId]);

    const deleteCommentOrReplyHandler = (
        commentId: string,
        replyId: string,
        type: string,
        belongsToUser: boolean,
        showModel: boolean
    ) => {
        setCommentOrReply({
            belongsToUser: belongsToUser,
            commentId: commentId,
            replyId: replyId,
            showModel: showModel,
            type: type,
        });
    };

    const setCommentDataHandler = (comment: CommentDataInterface) => {
        setCommentData(comment);
    };

    const setReplyDataHandler = (reply: ReplyDataInterface) => {
        setReplyData(reply);
    };

    const data = {
        commentOrReply,
        deleteCommentOrReplyHandler,

        commentData,
        setCommentDataHandler,

        replyData,
        setReplyDataHandler,
    };
    return (
        <CommentOrReplyModel.Provider value={data}>
            {children}
        </CommentOrReplyModel.Provider>
    );
};

export default CommentOrReplyModel;
