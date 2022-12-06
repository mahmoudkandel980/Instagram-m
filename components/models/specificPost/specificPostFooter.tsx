import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { db } from "../../../firebase.config";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";

import SpecificPostInput from "./specificPostInput";

import PostsContext from "../../../context/posts-context";
import RouterContext from "../../../context/router-context";
import ShowHideModels from "../../../context/showHideModels-context";
import UpdateTarget from "../../../context/updateTarget-context";

import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { TbLocation } from "react-icons/tb";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { BsHeartFill } from "react-icons/bs";

import timestampFun from "../../../helpers/timestampPostsFun";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { SpecificPostFooterInterface } from "../../../interfaces/specificPost-interface";
import { LikeInterface } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";

import dynamic from "next/dynamic";
import { IEmojiPickerProps } from "emoji-picker-react";
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import("emoji-picker-react"),
    {
        ssr: false,
        loading: () => <p>Emoji...</p>,
    }
);

interface SpecificModel {
    modifiedLikes: LikeInterface[];
    Liked: boolean;
    setLiked: Function;
    saved: boolean;
    setSaved: Function;
}

const SpecificPostFooter = (
    props: SpecificPostFooterInterface &
        UserInterface &
        SpecificModel &
        StoriesInterface
) => {
    const {
        mode,
        specificPost,
        currentUser,
        Liked,
        setLiked,
        saved,
        setSaved,
        modifiedLikes,
        stories,
    } = props;

    const [storyClicked, setStoryClicked] = useState(false);
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [showEmojiList, setShowEmojiList] = useState(false);
    const [postClicked, setPostClicked] = useState(false);
    const [likesHasFollowing, SetLikesHasFollowing] = useState<LikeInterface[]>(
        []
    );

    const [rerenderPost, setRerenderPost] = useState<boolean>(false);

    const router = useRouter();
    const { postId } = router.query;

    const routerCtx = useContext(RouterContext);
    const showHideModelsCtx = useContext(ShowHideModels);
    const postsCtx = useContext(PostsContext);
    const updateTargetCtx = useContext(UpdateTarget);

    const { showRouterComponentHandler } = routerCtx;
    const { showLikesModelHandler } = showHideModelsCtx;
    const {
        setCommentValueHandler,
        postsComments,
        setLikeToPost,
        setSavedToPost,
    } = postsCtx;
    // const { updatePostsHandler } = updateTargetCtx;

    // rerender post after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setRerenderPost(true);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    useEffect(() => {
        // if (textareaValue !== "") {
        setCommentValueHandler(textareaValue, postId);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textareaValue]);

    // CHECK iN LIKES HAS FOLLOWING
    useEffect(() => {
        if (rerenderPost) {
            SetLikesHasFollowing([]);
            let personExist: boolean = false;

            specificPost.likes.forEach((like, index) => {
                personExist = false;
                currentUser.following.forEach((following) => {
                    if (like.userName === following.userName) {
                        personExist = true;
                        return;
                    }
                });
                if (personExist) {
                    SetLikesHasFollowing((prevState) => prevState.concat(like));
                }
            });
            SetLikesHasFollowing((prevState) => prevState.slice(0, 3));
            setRerenderPost(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        specificPost.likes,
        specificPost.saves,
        currentUser.following,
        rerenderPost,
    ]);

    // render comment value when change is happend
    useEffect(() => {
        postsComments.forEach(
            (comment) =>
                comment.id == postId && setTextareaValue(comment.commentValue)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const onEmojiClick = (event: any, emojiObject: any) => {
        setTextareaValue((prevState) => prevState.concat(emojiObject.emoji));
    };

    const showRouteCtxHandler = () => {
        setStoryClicked(true);
        showRouterComponentHandler(true);
    };

    const showLikesModelHandlerFun = () => {
        showLikesModelHandler(true, specificPost.id);
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

    const likePostHandler = async (id: any) => {
        setPostClicked(true);
        setLikeToPost(!Liked, id);

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
        // updatePostsHandler(true, `${postId}`);
    };

    const savePostHandler = async (id: any) => {
        setSavedToPost(!saved, id);

        // firebase
        const userSave = {
            fullName: currentUser.fullName,
            userName: currentUser.userName,
            userImg: currentUser.userImg,
        };
        const savesRef = doc(db, "posts", id);

        if (saved) {
            // remove save
            await updateDoc(savesRef, {
                saves: arrayRemove(userSave),
            });
        } else {
            // add save
            await updateDoc(savesRef, {
                saves: arrayUnion({ ...userSave }),
            });
        }

        setSaved((prevState: boolean) => !prevState);
        // updatePostsHandler(true, `${postId}`);
    };

    return (
        <div
            className={`${
                mode === "dark" ? "bg-smothDark" : "bg-gray-100"
            } fixed sm:relative bottom-0 left-0 h-fit w-full flex justify-center items-center `}
        >
            <div
                className={`${
                    mode === "dark" ? "bg-smothDark/10" : "bg-gray-100"
                } sticky bottom-0 left-0 flex flex-col justify-center items-start space-y-1.5 pt-1 sm:space-y-3 w-full h-fit pb-2 px-4 sm:px-5`}
            >
                <div className="flex justify-between items-center w-full">
                    <div className="flex justify-start items-center space-x-3">
                        {/* liks and comments... */}
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center space-x-6">
                                {Liked ? (
                                    <span
                                        onClick={likePostHandler.bind(
                                            null,
                                            postId
                                        )}
                                    >
                                        <BsHeartFill className="footerheart text-darkRed w-7 h-7 cursor-pointer hover:scale-105 duration-200" />
                                    </span>
                                ) : (
                                    <span
                                        onClick={likePostHandler.bind(
                                            null,
                                            postId
                                        )}
                                    >
                                        <AiOutlineHeart
                                            className={`${
                                                mode === "dark"
                                                    ? "hover:text-gray-50/50"
                                                    : "hover:text-smothDark/70"
                                            } footerheart w-7 h-7 cursor-pointer hover:scale-105 duration-200`}
                                        />
                                    </span>
                                )}
                                <label htmlFor="search">
                                    <FaRegComment
                                        className={`${
                                            mode === "dark"
                                                ? "hover:text-gray-50/50"
                                                : "hover:text-smothDark/70"
                                        } w-6 h-6 cursor-pointer hover:scale-105 duration-200`}
                                    />
                                </label>
                                <TbLocation
                                    className={`${
                                        mode === "dark"
                                            ? "hover:text-gray-50/50"
                                            : "hover:text-smothDark/70"
                                    } w-6 h-6 rotate-12 cursor-pointer hover:scale-105 duration-200`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end flex-1 ">
                        <div className="sm:pr-2 flex justify-center items-center">
                            {saved ? (
                                <span
                                    onClick={savePostHandler.bind(null, postId)}
                                >
                                    <IoBookmark
                                        className={`${
                                            mode === "dark"
                                                ? "hover:text-gray-50/50"
                                                : "hover:text-smothDark/70"
                                        } w-7 h-7  cursor-pointer hover:scale-105 duration-200`}
                                    />
                                </span>
                            ) : (
                                <span
                                    onClick={savePostHandler.bind(null, postId)}
                                >
                                    <IoBookmarkOutline
                                        className={`${
                                            mode === "dark"
                                                ? "hover:text-gray-50/50"
                                                : "hover:text-smothDark/70"
                                        } w-7 h-7 cursor-pointer hover:scale-105 duration-200`}
                                    />
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-start space-y-0.5 flex-wrap">
                    {/* likes */}
                    {likesHasFollowing.length === 0 ? (
                        <span
                            onClick={showLikesModelHandlerFun}
                            className="text-[14px] font-bold cursor-pointer min-h-[20px]"
                        >
                            {modifiedLikes?.length! + (Liked ? 1 : 0) > 0 &&
                                modifiedLikes?.length! + (Liked ? 1 : 0)}{" "}
                            <span>
                                {modifiedLikes?.length! === 0 && !Liked
                                    ? ""
                                    : modifiedLikes?.length! +
                                          (Liked ? 1 : 0) ===
                                      1
                                    ? "like"
                                    : "likes"}
                            </span>
                        </span>
                    ) : (
                        <div className="flex justify-start items-center space-x-1 flex-wrap">
                            <div className="flex items-center gap-2 pr-2">
                                <div className="flex">
                                    {likesHasFollowing.map((like) => (
                                        <div
                                            key={like.userName}
                                            className={`${
                                                mode === "dark"
                                                    ? "border-smothDark"
                                                    : "border-gray-50"
                                            } h-7 w-7 relative rounded-full -mr-2.5 border-[3px] `}
                                        >
                                            <Link
                                                href={
                                                    currentUser.userName ===
                                                    like.userName
                                                        ? `profile`
                                                        : `/${like.userName}`
                                                }
                                            >
                                                <a
                                                    className="w-full h-full relative"
                                                    onClick={
                                                        showRouteCtxHandler
                                                    }
                                                >
                                                    <div className="w-full h-full relative">
                                                        <Image
                                                            src={
                                                                like.userImg ||
                                                                getPhotoSrcFun(
                                                                    like.userName
                                                                )
                                                            }
                                                            alt={`${like.userName} image`}
                                                            layout="fill"
                                                            className="rounded-full"
                                                        />
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className="font-thin">Liked by</span>
                            {likesHasFollowing.map(
                                (like, index) =>
                                    index === 0 && (
                                        <Link
                                            key={`${like.userName}`}
                                            href={`/${like.userName}`}
                                        >
                                            <a className="font-semibold">
                                                {like.userName}
                                            </a>
                                        </Link>
                                    )
                            )}
                            {likesHasFollowing.length + (Liked ? 1 : 0) > 1 && (
                                <div>
                                    <span className="font-thin pr-1">and</span>

                                    <span
                                        onClick={showLikesModelHandlerFun}
                                        className="text-[14px] font-bold cursor-pointer"
                                    >
                                        {modifiedLikes?.length! +
                                            (Liked ? 1 : 0) >
                                            1 &&
                                            modifiedLikes?.length! +
                                                (Liked ? 1 : 0) -
                                                1}
                                        <span className="pl-0.5">
                                            {modifiedLikes?.length! +
                                                (Liked ? 1 : 0) -
                                                1 ===
                                            0
                                                ? ""
                                                : modifiedLikes?.length! +
                                                      (Liked ? 1 : 0) -
                                                      1 ===
                                                  1
                                                ? "other"
                                                : "others"}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {/* date */}
                    <span
                        className={`${
                            mode === "dark"
                                ? "text-gray-100/50"
                                : "text-gray-600/95"
                        } text-[10px] font-medium`}
                    >
                        {timestampFun(specificPost.timestamp.seconds)}
                    </span>
                </div>
                {/* textarea input */}
                <div className="w-full">
                    {showEmojiList && (
                        <div
                            onClick={hideEmojiList}
                            className="fixed top-0 left-0 w-full h-full bg-transparent z-1"
                        ></div>
                    )}
                    <div
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/50"
                                : "border-gray-300/60"
                        } border-t-[1px] py-1.5 relative w-full`}
                    >
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
                                } rotate-180 absolute left-2 w-3 h-3`}
                                style={{
                                    clipPath:
                                        "polygon(51% 49%, 0% 100%, 100% 100%)",
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
                                        ? "bottom-[53px]"
                                        : "bottom-[73px]"
                                } absolute left-0 overflow-hidden rounded-md`}
                            >
                                {/* emoji */}
                                <EmojiPickerNoSSRWrapper
                                    onEmojiClick={onEmojiClick}
                                />
                            </div>
                        )}
                        <div className="py-1.5 w-full">
                            {/* comment && reply input */}
                            <SpecificPostInput
                                mode={mode}
                                setTextareaValue={setTextareaValue}
                                textareaChangeHandler={textareaChangeHandler}
                                textareaValue={textareaValue}
                                toggleEmojiList={toggleEmojiList}
                                currentUser={currentUser}
                                hideEmojiList={hideEmojiList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecificPostFooter;
