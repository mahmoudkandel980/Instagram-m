import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";

import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { FiSmile } from "react-icons/fi";

import { UserInterface } from "../../../interfaces/user-interfaces";
import { SpecificPostInputInterface } from "../../../interfaces/specificPost-interface";

const SpecificPostInput = (
    props: SpecificPostInputInterface & UserInterface
) => {
    const {
        textareaValue,
        setTextareaValue,
        toggleEmojiList,
        mode,
        textareaChangeHandler,
        currentUser,
        hideEmojiList,
    } = props;

    const [focusInInput, setFocusInInput] = useState(true);
    const ref = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();
    const { postId } = router.query;

    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );
    const { addComment, addReply, replyTo, toggleReplyTo, comments } =
        SpecificPostCommentReplyDataCtx;
    useEffect(() => {
        if (focusInInput) {
            ref.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusInInput]);

    useEffect(() => {
        if (replyTo.userName !== "") {
            setTextareaValue(`@${replyTo.userName} `);
            setFocusInInput(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [replyTo]);

    const submitHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        hideEmojiList();

        if (textareaValue.trim().length === 0) {
            return;
        }

        if (replyTo.userName !== "") {
            // add reply
            let modifiedReply: string;
            if (textareaValue.includes(replyTo.userName)) {
                modifiedReply = textareaValue
                    .substring(
                        textareaValue.indexOf(replyTo.userName) +
                            replyTo.userName.length
                    )
                    .trim();
            } else {
                modifiedReply = textareaValue.substring(
                    textareaValue.indexOf(" ") + 1
                );
            }

            const repliesRef = doc(db, "posts", `${postId}`);

            const replyData = {
                commentId: replyTo.id,
                replyId: `${Math.random()}`,
                fullName: currentUser.fullName,
                userName: currentUser.userName,
                userImg:
                    currentUser.userImg || getPhotoSrcFun(currentUser.userName),
                reply: modifiedReply.trim(),
                replyTo: replyTo.userName,
                timestamp: {
                    seconds: +Date.now() / 1000,
                    nanoseconds: +Date.now() / 1000,
                },
                likes: [],
            };

            const targetComment = comments.filter(
                (comment) => comment.id === replyTo.id
            );

            await updateDoc(repliesRef, {
                comments: arrayUnion({
                    comment: targetComment[0].comment,
                    fullName: targetComment[0].fullName,
                    id: targetComment[0].id,
                    likes: targetComment[0].likes,
                    replys: [...targetComment[0].replys, replyData],
                    timestamp: targetComment[0].timestamp,
                    userImg: targetComment[0].userImg,
                    userName: targetComment[0].userName,
                }),
            });

            await updateDoc(repliesRef, {
                comments: arrayRemove(...targetComment),
            });

            // id always belongs to comment of replies
            addReply(replyTo.id, { ...replyData });

            // remove textareaValue
            setTextareaValue("");

            // set id and userName with empty string to get red of reply state in context
            toggleReplyTo("", "");
        } else {
            // add comment
            const commnetData = {
                id: uuidv4(),
                fullName: currentUser.fullName,
                userName: currentUser.userName,
                userImg:
                    currentUser.userImg || getPhotoSrcFun(currentUser.userName),
                comment: textareaValue.trim(),
                timestamp: {
                    seconds: +Date.now() / 1000,
                    nanoseconds: +Date.now() / 1000,
                },
                likes: [],
                replys: [],
            };

            // firebase
            addComment({ ...commnetData });
            // remove textareaValue
            setTextareaValue("");

            const commentRef = doc(db, "posts", `${postId}`);
            await updateDoc(commentRef, {
                comments: arrayUnion({ ...commnetData }),
            });
        }
    };

    const blueInputHandler = () => {
        setFocusInInput(false);
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="w-fit">
                <span onClick={toggleEmojiList}>
                    <FiSmile
                        className={`${
                            mode === "dark" ? "text-white" : "text-smothDark"
                        } w-7 h-7 cursor-pointer`}
                    />
                </span>
            </div>
            <div className="flex items-center flex-1 px-2 self-center">
                <textarea
                    id="search"
                    className={`${
                        mode === "dark"
                            ? "text-white bg-smothDark placeholder:text-gray-300/70"
                            : "text-smothDark bg-white placeholder:text-gray-700/70"
                    } ${
                        textareaValue.length > 0
                            ? "min-h-fit overflow-y-scroll"
                            : "h-7"
                    } hideScrollBar w-full outline-none px-1 rounded-md`}
                    spellCheck={false}
                    onBlur={blueInputHandler}
                    ref={ref}
                    autoFocus
                    value={textareaValue}
                    onChange={textareaChangeHandler}
                    placeholder="Add a comment..."
                ></textarea>
            </div>
            <div className="w-fit pr-2">
                <button
                    onClick={submitHandler}
                    className={`${
                        textareaValue.length === 0
                            ? "text-lightBlue/50 cursor-default"
                            : "text-lightBlue cursor-pointer"
                    } capitalize flex justify-end text-[12px] font-extrabold `}
                >
                    post
                </button>
            </div>
        </div>
    );
};

export default SpecificPostInput;
