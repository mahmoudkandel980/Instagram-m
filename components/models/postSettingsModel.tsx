import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

import ToggleMode from "../../context/darkMode";
import UserContext from "../../context/user-context";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import UpdateTarget from "../../context/updateTarget-context";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { PostInterface } from "../../interfaces/posts-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";

const PostSettingsModel = (props: PostInterface & UserInterface) => {
    const {
        id,
        userName: postUserName,
        userImg,
        fullName,
        currentUser,
    } = props;

    const [deletePost, setDeletePost] = useState(false);
    const [unfollowPreson, SetUnfollowPreson] = useState(false);

    const modeCtx = useContext(ToggleMode);
    const userCtx = useContext(UserContext);
    const updateTargetCtx = useContext(UpdateTarget);
    const ShowHideModelsCtx = useContext(ShowHideModels);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { mode } = modeCtx;
    const { userData } = userCtx;
    const { deleteSpecficPostHandler } = updateTargetCtx;
    const { showPostSettingsModelHandler } = ShowHideModelsCtx;
    const { unfollowingModelHandler, unfollowingModel } =
        currentUserFollowingCtx;

    const { userName } = userData;

    const router = useRouter();

    const hideModelHandler = async () => {
        showPostSettingsModelHandler(false, "");

        setTimeout(() => {
            setDeletePost(false);
            SetUnfollowPreson(false);
        }, 300);
    };

    // DELETE POST
    const deletePostHandler = () => {
        setDeletePost(true);
    };

    const confirmDeletePostHandler = async () => {
        // deletePost firebase
        await deleteDoc(doc(db, "posts", id));
        // update dlete post posts
        deleteSpecficPostHandler(true, id);

        showPostSettingsModelHandler(false, "");
        router.push(`${router.pathname}`, undefined, {
            scroll: false,
        });

        setTimeout(() => {
            setDeletePost(false);
        }, 300);
        SetUnfollowPreson(false);
    };

    // UNFOLLOW PERSON
    const unfollowPersonHandler = () => {
        SetUnfollowPreson(true);
        hideModelHandler();

        unfollowingModelHandler(
            true,
            postUserName,
            fullName,
            userImg || getPhotoSrcFun(postUserName),
            currentUser.userName,
            currentUser.fullName,
            currentUser.userImg
        );
    };

    return (
        <div className="fixed z-[100] -top-[5px] left-0 w-screen h-full ">
            <div
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/70"
                } w-full h-full `}
                onClick={hideModelHandler}
            ></div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-smothDark text-white"
                        : "bg-gray-100 text-smothDark"
                }  fixed z-[110] top-[50%] left-0  sm:left-[50%] w-[90%] sm:w-96 rounded-md translate-x-[5%] -translate-y-48 sm:-translate-x-48 sm:-translate-y-48`}
            >
                <div className="py-2 flex flex-col items-start h-full">
                    {postUserName != userName ? (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                } flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
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
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                            >
                                <button onClick={unfollowPersonHandler}>
                                    Unfollow
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Go to post
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Share to...
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Copy link
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Embed
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
                    ) : !deletePost ? (
                        <div className="w-full flex flex-col justify-center items-center">
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                            >
                                <button onClick={deletePostHandler}>
                                    Delete
                                </button>
                            </div>
                            {/* edit post if you want to do in future */}
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>Edit</button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Hide like count
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Turn off commenting
                                </button>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Go to post
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
                                }  border-b-[1px] w-full flex flex-col justify-center items-center`}
                            >
                                <h2 className="text-xl">Delete post ?</h2>
                                <p className="text-sm font-thin py-4 pb-8">
                                    Are you sure you want to delete this post?
                                </p>
                            </div>
                            <div
                                className={`${
                                    mode === "dark"
                                        ? "border-gray-600/40"
                                        : "border-gray-600/10"
                                }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                            >
                                <button onClick={confirmDeletePostHandler}>
                                    Delete
                                </button>
                            </div>
                            <div
                                className={` flex justify-center items-center py-3 w-full text-sm`}
                            >
                                <button onClick={hideModelHandler}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostSettingsModel;
