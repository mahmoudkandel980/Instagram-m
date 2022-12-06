import { useState, useContext, useEffect } from "react";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";

import ToggleMode from "../../../context/darkMode";
import PostsContext from "../../../context/posts-context";
import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { FiSmile } from "react-icons/fi";

import { CommentValueInterface } from "../../../interfaces/context-interfaces";
import { PostIdInterface } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import { PostsInterface } from "../../../interfaces/posts-interfaces";

import dynamic from "next/dynamic";
import { IEmojiPickerProps } from "emoji-picker-react";
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import("emoji-picker-react"),
    {
        ssr: false,
        loading: () => <p>Emoji...</p>,
    }
);

const PostInput = (
    props: CommentValueInterface &
        PostIdInterface &
        UserInterface &
        PostsInterface
) => {
    const { commentValue, id, currentUser, posts } = props;
    const [textareaValue, setTextareaValue] = useState("");
    const [showEmojiList, setShowEmojiList] = useState(false);

    const modeCtx = useContext(ToggleMode);
    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );

    const PostsContextCtx = useContext(PostsContext);
    const { addComment } = SpecificPostCommentReplyDataCtx;

    const { mode } = modeCtx;
    const {
        setCommentValueHandler,
        id: idCtx,
        postsComments,
    } = PostsContextCtx;

    useEffect(() => {
        setCommentValueHandler(textareaValue, id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textareaValue]);

    // render comment value when change is happend
    useEffect(() => {
        postsComments.forEach(
            (comment) =>
                comment.id == id && setTextareaValue(comment.commentValue)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEmojiClick = (event: any, emojiObject: any) => {
        setTextareaValue((prevState) => prevState.concat(emojiObject.emoji));
    };

    const textareaChangeHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setTextareaValue(e.target.value);
        setShowEmojiList(false);
    };

    const toggleEmojiList = () => {
        setShowEmojiList((prevState) => !prevState);
    };
    const hideEmojiList = () => {
        if (showEmojiList) {
            setShowEmojiList(false);
        }
    };

    const submitHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        hideEmojiList();

        if (textareaValue.trim().length === 0) {
            return;
        }
        // firebase

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
        const commentRef = doc(db, "posts", id);
        await updateDoc(commentRef, {
            comments: arrayUnion({ ...commnetData }),
        });

        addComment({ ...commnetData });

        // remove textareaValue
        setTextareaValue("");
    };

    return (
        <div>
            {showEmojiList && (
                <div
                    onClick={hideEmojiList}
                    className="fixed top-0 left-0 w-full h-full bg-transparent"
                ></div>
            )}
            <div
                className={`${
                    mode === "dark"
                        ? "border-gray-600/50"
                        : "border-gray-300/60"
                } border-t-[1px] py-1.5 relative`}
            >
                {showEmojiList && (
                    <div
                        className={`${
                            mode === "dark"
                                ? "bg-darkBody/95"
                                : "bg-gray-300/95"
                        } ${
                            textareaValue.length === 0
                                ? "bottom-7"
                                : "bottom-[49px]"
                        } rotate-180 absolute left-4 w-3 h-3`}
                        style={{
                            clipPath: "polygon(51% 49%, 0% 100%, 100% 100%)",
                        }}
                    ></div>
                )}
                {showEmojiList && (
                    <div
                        className={`${
                            mode === "dark"
                                ? "bg-darkBody/95"
                                : "bg-gray-300/95"
                        } ${
                            textareaValue.length === 0
                                ? "bottom-10"
                                : "bottom-[61px]"
                        } absolute left-1 overflow-hidden rounded-md`}
                    >
                        {/* emoji */}
                        <EmojiPickerNoSSRWrapper onEmojiClick={onEmojiClick} />
                    </div>
                )}

                <div className="flex justify-center items-center">
                    <div className="w-fit pl-2">
                        <span onClick={toggleEmojiList}>
                            <FiSmile
                                className={`${
                                    mode === "dark"
                                        ? "text-white"
                                        : "text-smothDark"
                                } w-7 h-7 cursor-pointer`}
                            />
                        </span>
                    </div>
                    <div className="flex items-center flex-1 px-2 self-center">
                        <textarea
                            id={id}
                            className={`${
                                mode === "dark"
                                    ? "text-white bg-dark placeholder:text-gray-300/70"
                                    : "text-smothDark bg-white placeholder:text-gray-700/70"
                            } ${
                                textareaValue.length > 0
                                    ? "min-h-fit overflow-y-scroll"
                                    : "h-7"
                            } hideScrollBar w-full outline-none px-1 rounded-md`}
                            spellCheck={false}
                            value={id == idCtx ? commentValue : textareaValue}
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
                            } capitalize flex justify-end text-[12px] font-extrabold text-lightBlue cursor-pointer`}
                        >
                            post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostInput;
