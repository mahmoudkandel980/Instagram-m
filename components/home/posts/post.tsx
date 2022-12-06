/* eslint-disable @next/next/no-img-element */
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../../firebase.config";

import PostInput from "./postInput";
import PopUpUserDataModel from "../../models/popUpUserDataModel";
import DocumentetedUsers from "../../ui/documentetedUsers";
import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import ToggleMode from "../../../context/darkMode";
import PostsContext from "../../../context/posts-context";
import timestampPostsFun from "../../../helpers/timestampPostsFun";
import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";
import RouterContext from "../../../context/router-context";
import ShowHideModels from "../../../context/showHideModels-context";
import CurrentUserFollowing from "../../../context/currentUserFollowing";
import CurrentStory from "../../../context/currentStory-context";
import UpdateTarget from "../../../context/updateTarget-context";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { TbLocation } from "react-icons/tb";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { BsHeartFill } from "react-icons/bs";

import { LikeInterface } from "../../../interfaces/interfaces";
import { CommentValueInterface } from "../../../interfaces/context-interfaces";
import {
    StoriesInterface,
    StoryInterface,
} from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";
import {
    PostInterface,
    PostsInterface,
} from "../../../interfaces/posts-interfaces";

const Post = (
    props: PostInterface &
        CommentValueInterface &
        UserInterface &
        PostsInterface &
        AllUsersInterface &
        StoriesInterface
) => {
    const {
        caption,
        comments,
        id,
        img,
        likes,
        userName,
        userImg,
        timestamp,
        fullName,
        commentValue,
        saves,
        currentUser,
        posts,
        allUsers,
        stories,
    } = props;

    const [userStory, setUserStory] = useState<StoryInterface>();

    const [storyClicked, setStoryClicked] = useState(false);
    const [postClicked, setPostClicked] = useState(false);
    const [likesHasFollowing, SetLikesHasFollowing] = useState<LikeInterface[]>(
        []
    );
    const [modifiedComments, setModifiedComments] = useState([...comments]);

    const [Liked, setLiked] = useState(false);
    const [modifiedLikes, setModifiedLikes] = useState<LikeInterface[]>([]);
    const [Saved, setSaved] = useState(false);

    const router = useRouter();
    const { pathname, asPath } = router;
    const { postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const postCtx = useContext(PostsContext);
    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);
    const showHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const specificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );
    const updateTargetCtx = useContext(UpdateTarget);

    const { mode } = modeCtx;
    const { liked, saved } = postCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { setBackPageHandler } = currentStoryCtx;
    const { comments: commentsCtx } = specificPostCommentReplyDataCtx;
    const { following: followingCtx } = currentUserFollowingCtx;
    const { showLikesModelHandler, showPostSettingsModelHandler } =
        showHideModelsCtx;
    // const { updatePostsHandler } = updateTargetCtx;

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

    // render number of comments of original post when you write a comment
    useEffect(() => {
        if (postId === id) {
            setModifiedComments(commentsCtx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentsCtx]);

    // render isSaved and isLiked from model to original post
    useEffect(() => {
        if (postId == id) {
            setSaved(saved.saveCtx);
            setLiked(liked.likeCtx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liked, saved]);

    // REMOVE USER LIKE FROM LIKES LIST IF EXIST
    useEffect(() => {
        setModifiedLikes([]);
        likes.forEach((like) => {
            if (like.userName !== currentUser.userName) {
                setModifiedLikes((prevState) => prevState.concat(like));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // check if post has usersName like or not and post saved or not
    useEffect(() => {
        setLiked(false);
        setSaved(false);
        saves.forEach((save) => {
            if (save.userName === currentUser.userName) {
                setSaved(true);
                return;
            }
        });
        likes.forEach((like) => {
            if (like.userName === currentUser.userName) {
                setLiked(true);
                return;
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asPath, postId, saves, likes]);

    // CHECK iS LIKES HAS FOLLOWING
    useEffect(() => {
        SetLikesHasFollowing([]);
        let personExist: boolean = false;

        likes.forEach((like, index) => {
            personExist = false;
            followingCtx.forEach((following) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likes, currentUser.userName, followingCtx]);

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    // remove animatin of heart
    useEffect(() => {
        const timer = setTimeout(() => {
            setPostClicked(false);
        }, 700);
        return () => {
            clearTimeout(timer);
        };
    }, [postClicked]);

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
        showRouterComponentHandler(true);

        currentUser.userName === userName
            ? router.push(`/profile`, undefined, {
                  scroll: false,
              })
            : router.push(`/${userName}`, undefined, {
                  scroll: false,
              });
    };

    const showLikesModelHandlerFun = () => {
        showLikesModelHandler(true, id);
    };

    const showPostSettingsModelHandlerFun = () => {
        showPostSettingsModelHandler(true, id);
    };

    const likePostHandler = async (id: any) => {
        setPostClicked(true);

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
        // updatePostsHandler(true, id);
    };

    const moveToUserProfileHandler = (like: LikeInterface) => {
        showRouterComponentHandler(true);
        router.push(
            `${
                currentUser.userName === like.userName
                    ? "/profile"
                    : `/${like.userName}`
            }`
        );
    };

    const savePostHandler = async (id: any) => {
        // firebase
        const userSave = {
            fullName: currentUser.fullName,
            userName: currentUser.userName,
            userImg: currentUser.userImg,
        };
        const savesRef = doc(db, "posts", id);

        if (Saved) {
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
        setSaved((prevState) => !prevState);
        // updatePostsHandler(true, id);
    };

    if (!userName) {
        return <></>;
    }

    return (
        <>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } flex flex-col space-y-2 justify-center  sm:rounded-md  border-b-[1px] border-t-[1px] sm:border-[1px] sm:py-1 mt-4 relative`}
            >
                {/* userName profile Pic */}
                <div className="pl-3 pt-3 text-sm flex justify-start items-center space-x-2 mb-1.5">
                    <div className="relative rounded-full w-9 h-9 cursor-pointer group">
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
                                        mode === "dark"
                                            ? "bg-dark"
                                            : "bg-gray-50"
                                    } grident-transparent`}
                                ></div>
                            </div>
                        )}
                        <div
                            className="w-full h-full relative"
                            onClick={
                                userStory
                                    ? imageClickHandler.bind(
                                          null,
                                          userStory.userName
                                      )
                                    : showRouteCtxHandler
                            }
                        >
                            <Image
                                id={id.toString()}
                                src={userImg || getPhotoSrcFun(userName)}
                                alt={userName}
                                layout="fill"
                                className="rounded-full"
                            />
                        </div>
                        <PopUpUserDataModel
                            key={`${userName}${id}1`}
                            allUsers={allUsers}
                            currentUser={currentUser}
                            posts={posts}
                            userName={userName}
                            className={
                                "top-4 left-4 scale-0 origin-top-left group-hover:top-11 group-hover:left-0 group-hover:scale-100 duration-500"
                            }
                            stories={stories}
                        />
                    </div>
                    <div className="flex justify-start space-x-1.5 items-center group">
                        <Link
                            href={
                                currentUser.userName === userName
                                    ? `profile`
                                    : `/${userName}`
                            }
                        >
                            <a
                                onClick={showRouteCtxHandler}
                                className="font-semibold cursor-pointer relative"
                            >
                                {userName}
                            </a>
                        </Link>
                        <DocumentetedUsers
                            className="w-3 h-3"
                            userName={userName}
                        />
                        <PopUpUserDataModel
                            key={`${userName}${id}2`}
                            allUsers={allUsers}
                            currentUser={currentUser}
                            posts={posts}
                            userName={userName}
                            className={
                                "top-10 left-16 scale-0 origin-top-left group-hover:top-11 group-hover:left-12 group-hover:scale-100 duration-500"
                            }
                            stories={stories}
                        />
                    </div>
                    <div className="flex justify-end flex-1 pr-2">
                        <span onClick={showPostSettingsModelHandlerFun}>
                            <BiDotsHorizontalRounded className="w-7 h-7 cursor-pointer" />
                        </span>
                    </div>
                </div>

                {/* Post Image */}
                <div className="w-full min-h-[20vh] relative">
                    <img
                        onClick={likePostHandler.bind(null, id)}
                        src={img}
                        alt={caption}
                        className="w-full"
                    />
                    {postClicked && (
                        <div className="absolute top-0 left-0 h-full w-full bg-transparent flex justify-center items-center">
                            <BsHeartFill className="imgheart w-10 h-10 text-white" />
                        </div>
                    )}
                </div>
                {/* liks and comments... */}
                <div className="flex justify-between items-center">
                    <div className="pl-2 flex justify-start items-center space-x-3">
                        {Liked ? (
                            <span onClick={likePostHandler.bind(null, id)}>
                                <BsHeartFill className="footerheart text-darkRed w-7 h-7 cursor-pointer hover:scale-105 duration-200" />
                            </span>
                        ) : (
                            <span onClick={likePostHandler.bind(null, id)}>
                                <AiOutlineHeart
                                    className={`${
                                        mode === "dark"
                                            ? "hover:text-gray-50/50"
                                            : "hover:text-smothDark/70"
                                    } footerheart w-7 h-7 cursor-pointer hover:scale-105 duration-200`}
                                />
                            </span>
                        )}
                        <Link href={`${pathname}?postId=${id}`} scroll={false}>
                            <a className={` cursor-pointer`}>
                                <FaRegComment
                                    className={`${
                                        mode === "dark"
                                            ? "hover:text-gray-50/50"
                                            : "hover:text-smothDark/70"
                                    } w-6 h-6 cursor-pointer hover:scale-105 duration-200`}
                                />
                            </a>
                        </Link>
                        <TbLocation
                            className={`${
                                mode === "dark"
                                    ? "hover:text-gray-50/50"
                                    : "hover:text-smothDark/70"
                            } w-6 h-6 rotate-12 cursor-pointer hover:scale-105 duration-200`}
                        />
                    </div>

                    <div className="pr-2 flex justify-center items-center">
                        {Saved ? (
                            <span onClick={savePostHandler.bind(null, id)}>
                                <IoBookmark
                                    className={`${
                                        mode === "dark"
                                            ? "hover:text-gray-50/50"
                                            : "hover:text-smothDark/70"
                                    } w-7 h-7  cursor-pointer hover:scale-105 duration-200`}
                                />
                            </span>
                        ) : (
                            <span onClick={savePostHandler.bind(null, id)}>
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
                <div className="flex flex-col justify-center items-start space-y-0.5 pl-2 pb-2 flex-wrap">
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
                                                    ? "border-dark"
                                                    : "border-gray-50"
                                            } h-7 w-7 relative rounded-full -mr-2.5 border-[3px] group`}
                                        >
                                            <Image
                                                onClick={moveToUserProfileHandler.bind(
                                                    null,
                                                    like
                                                )}
                                                src={
                                                    like.userImg ||
                                                    getPhotoSrcFun(
                                                        like.userName
                                                    )
                                                }
                                                alt={`${like.userName} image`}
                                                layout="fill"
                                                className="rounded-full cursor-pointer"
                                            />
                                            <PopUpUserDataModel
                                                key={`${userName}${id}3`}
                                                allUsers={allUsers}
                                                currentUser={currentUser}
                                                posts={posts}
                                                userName={like.userName}
                                                className={
                                                    "top-4 left-2 scale-0 origin-top-left group-hover:top-7 group-hover:left-0 group-hover:scale-100 duration-500"
                                                }
                                                stories={stories}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className="font-normal">Liked by</span>
                            {likesHasFollowing.map(
                                (like, index) =>
                                    index === 0 && (
                                        <div
                                            key={like.userName}
                                            className="group relative"
                                        >
                                            <Link
                                                key={`${like.userName}`}
                                                href={
                                                    currentUser.userName ===
                                                    like.userName
                                                        ? `profile`
                                                        : `/${like.userName}`
                                                }
                                            >
                                                <a
                                                    className="font-semibold"
                                                    onClick={
                                                        showRouteCtxHandler
                                                    }
                                                >
                                                    {like.userName}
                                                </a>
                                            </Link>
                                            <PopUpUserDataModel
                                                key={`${userName}${id}4`}
                                                allUsers={allUsers}
                                                currentUser={currentUser}
                                                posts={posts}
                                                userName={like.userName}
                                                className={
                                                    "top-4 left-2 scale-0 origin-top-left group-hover:top-7 group-hover:left-0 group-hover:scale-100 duration-500"
                                                }
                                                stories={stories}
                                            />
                                        </div>
                                    )
                            )}
                            {likesHasFollowing.length + (Liked ? 1 : 0) > 1 && (
                                <div>
                                    <span className="font-normal pr-1">
                                        and
                                    </span>
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

                    {/* caption */}
                    <div>
                        <div className="text-[14px] line-clamp-2">
                            <Link
                                href={
                                    currentUser.userName === userName
                                        ? `profile`
                                        : `/${userName}`
                                }
                            >
                                <a
                                    className="font-bold min-w-max"
                                    onClick={showRouteCtxHandler}
                                >
                                    {userName}
                                </a>
                            </Link>
                            <span>&nbsp; &nbsp;</span>
                            <span
                                className={`${
                                    mode === "dark"
                                        ? "text-gray-100/90"
                                        : "text-gray-600/95"
                                } font-normal`}
                            >
                                {caption}
                            </span>
                        </div>
                    </div>
                    {/* comments*/}
                    <div>
                        <Link href={`${pathname}?postId=${id}`} scroll={false}>
                            <a
                                className={`${
                                    mode === "dark"
                                        ? "text-gray-100/90"
                                        : "text-gray-600/95"
                                }  text-[14px] font-normal text-gray-100/90 cursor-pointer`}
                            >
                                {modifiedComments?.length === 0
                                    ? "No comments yet"
                                    : modifiedComments?.length! === 1
                                    ? "View comment"
                                    : `View all ${modifiedComments?.length!} comments`}
                            </a>
                        </Link>
                    </div>
                    {/* date */}
                    <div className="flex items-center justify-start space-x-4">
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-gray-100/50"
                                    : "text-gray-600/95"
                            } self-end uppercase text-[10px] font-normal`}
                        >
                            {timestampPostsFun(timestamp.seconds)}
                        </span>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-white"
                                    : "text-smothDark"
                            } text-[12px] font-bold`}
                        >
                            See translation
                        </span>
                    </div>
                </div>
                {/* textarea input */}
                <PostInput
                    commentValue={commentValue}
                    id={id}
                    currentUser={currentUser}
                    posts={posts}
                />
            </div>
        </>
    );
};

export default Post;
