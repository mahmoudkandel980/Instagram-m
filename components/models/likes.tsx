import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import LikesModel from "./likes/likesModel";

import ShowHideModels from "../../context/showHideModels-context";

import ToggleUnfollowModel from "../../context/removeFollwersUnfollowingModel-context";

import { IoIosClose, IoIosArrowBack } from "react-icons/io";

import { ModeInterFace } from "../../interfaces/interfaces";
import { PostsInterface } from "../../interfaces/posts-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";
import { StoriesInterface } from "../../interfaces/stories-interfaces";

const Likes = (
    props: ModeInterFace & PostsInterface & UserInterface & StoriesInterface
): JSX.Element => {
    const { mode, posts, currentUser, stories } = props;

    const [likes, setLikes] = useState<any>();

    const showHideModelsCtx = useContext(ShowHideModels);
    const toggleUnfollowModeCtx = useContext(ToggleUnfollowModel);

    const { showLikesModel, showLikesModelHandler } = showHideModelsCtx;
    const { showUnfollowModel, toggleShowUnfollowModel } =
        toggleUnfollowModeCtx;

    const router = useRouter();
    const { postId } = router.query;

    useEffect(() => {
        posts.filter((post) => {
            post.id === showLikesModel.id && setLikes(post.likes);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showLikesModel]);

    const hideModelHandler = () => {
        showLikesModelHandler(false, "");

        setTimeout(() => {
            // adding delay to hide flikring of model to likes one
            toggleShowUnfollowModel(false);
        }, 300);
    };

    return (
        <div className="fixed z-[100] -top-1.5 left-0 w-screen h-full ">
            <div
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/30"
                } w-full h-full`}
                onClick={hideModelHandler}
            ></div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-smothDark text-white"
                        : "bg-gray-100 text-smothDark"
                } ${
                    showUnfollowModel
                        ? " fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-md -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] sm:-translate-y-48"
                        : " fixed z-[10] -top-2.5 sm:top-[50%] left-0 sm:left-[50%] w-full sm:w-96 h-full sm:h-96 sm:rounded-md sm:-translate-x-48 sm:-translate-y-48"
                } `}
            >
                <div
                    className={`${
                        !showUnfollowModel && "pt-2"
                    }  flex flex-col items-start h-full`}
                >
                    <div
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/40"
                                : "border-gray-600/10"
                        } ${
                            showUnfollowModel && "hidden"
                        } pb-1 px-2 w-full flex justify-between  items-center border-b-[1px]`}
                    >
                        <div
                            className="opacity-100 sm:opacity-0"
                            onClick={hideModelHandler}
                        >
                            <IoIosArrowBack className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="font-[700]">likes</span>
                        </div>
                        <div
                            onClick={hideModelHandler}
                            className="cursor-pointer opacity-0 sm:opacity-100"
                        >
                            <IoIosClose className="w-7 h-7" />
                        </div>
                    </div>
                    <div
                        className={`${
                            postId ? "pb-0" : `${!showUnfollowModel && `pb-10`}`
                        } hideScrollBar px-2 pt-1 overflow-y-scroll w-full h-full sm:pb-0`}
                    >
                        <LikesModel
                            likes={likes}
                            mode={mode}
                            currentUser={currentUser}
                            hideModelHandler={hideModelHandler}
                            stories={stories}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Likes;
