import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { db, auth } from "../../firebase.config";
import {
    deleteDoc,
    doc,
    arrayUnion,
    updateDoc,
    arrayRemove,
} from "firebase/firestore";

import ShowHideModels from "../../context/showHideModels-context";
import CurrentStory from "../../context/currentStory-context";

import { ModeInterFace } from "../../interfaces/interfaces";
import { StoriesInterface } from "../../interfaces/stories-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const StorySettingsModel = (
    props: ModeInterFace & UserInterface & StoriesInterface
) => {
    const { mode, currentUser, stories } = props;

    const [showDeleteModel, setShowDeleteModel] = useState<boolean>(false);

    const router = useRouter();
    const { story } = router.query;

    const currentStoryCtx = useContext(CurrentStory);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { backPage } = currentStoryCtx;
    const { showStorySettingsModelHandler, showStorySettingsModel } =
        showHideModelsCtx;

    const DeleteStoryHandler = () => {
        setShowDeleteModel(true);
    };

    // hide unfollow model
    const hideModelHandler = () => {
        showStorySettingsModelHandler(false, showStorySettingsModel.userName);
    };

    const removeStoryPhoto = async () => {
        // removeStoryPhoto firebase
        const currentUserStory = stories.filter(
            (currentStory) => currentStory.userName === currentUser.userName
        );

        const imgs = currentUserStory[0].imgs;

        const targetImg = currentUserStory[0].imgs.filter(
            (img, index) => index + 1 === +`${story}`
        );
        const restImgs = imgs.filter(
            (currentImg) => currentImg !== targetImg[0]
        );

        const storyRef = doc(db, "stories", `${auth.currentUser?.displayName}`);

        if (currentUserStory[0].imgs.length > 1) {
            await updateDoc(storyRef, {
                imgs: arrayRemove(...imgs),
            });

            if (restImgs) {
                await updateDoc(storyRef, {
                    imgs: arrayUnion(...restImgs),
                });
            }
        } else {
            // if it has one story delete all  data of user
            await deleteDoc(
                doc(db, "stories", `${auth.currentUser?.displayName}`)
            );
        }

        if (backPage) {
            router.push(backPage, undefined, { scroll: false });
        } else {
            router.push(`/`, undefined, { scroll: false });
        }

        hideModelHandler();
    };

    return (
        <div className="fixed z-[100] -top-1.5 left-0 w-screen h-full">
            <div
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/30"
                } w-full h-full`}
                onClick={hideModelHandler}
            ></div>

            {currentUser.userName === showStorySettingsModel.userName ? (
                <>
                    <div
                        className={`${
                            mode === "dark"
                                ? "bg-smothDark text-white"
                                : "bg-gray-100 text-smothDark"
                        } ${
                            showDeleteModel && "hidden"
                        } fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-md -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] `}
                    >
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-gray-600/40"
                                    : "border-gray-600/10"
                            }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                        >
                            <button onClick={DeleteStoryHandler}>Delete</button>
                        </div>
                        <div
                            className={` flex justify-center items-center py-3 w-full text-sm`}
                        >
                            <button onClick={hideModelHandler}>Cancel</button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showDeleteModel && (
                            <motion.div
                                onClick={hideModelHandler}
                                className="top-0 left-0 absolute w-full h-full "
                                initial={{
                                    opacity: 0,
                                    transform: "scale(1.5)",
                                    top: "5px",
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: "scale(1)",
                                    top: "5px",
                                }}
                                exit={{
                                    opacity: 0,
                                    transform: "scale(1.1)",
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            >
                                {showDeleteModel && (
                                    <div
                                        className={`${
                                            mode === "dark"
                                                ? "bg-smothDark text-white"
                                                : "bg-gray-100 text-smothDark"
                                        } fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-md -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] `}
                                    >
                                        <div className="flex flex-col justify-center items-center">
                                            <h3 className="text-xl font-bold pt-4">
                                                Delete Story?
                                            </h3>
                                            <p className="text-md px-1 font-thin py-3 pb-5 text-center">
                                                Are you sure you want to delete
                                                this photo from you story
                                            </p>
                                            <div
                                                className={`${
                                                    mode === "dark"
                                                        ? "border-gray-600/40"
                                                        : "border-gray-600/10"
                                                }  flex justify-center items-center border-b-[1px] border-t-[1px] py-3 w-full text-sm `}
                                            >
                                                <button
                                                    className="text-darkRed"
                                                    onClick={removeStoryPhoto}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div
                                                className={` flex justify-center items-center py-3 w-full text-sm`}
                                            >
                                                <button
                                                    onClick={hideModelHandler}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div
                    className={`${
                        mode === "dark"
                            ? "bg-smothDark text-white"
                            : "bg-gray-100 text-smothDark"
                    } fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-md -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] `}
                >
                    <div
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/40"
                                : "border-gray-600/10"
                        }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm `}
                    >
                        <button onClick={hideModelHandler}>
                            Report Inappropriate
                        </button>
                    </div>
                    <div
                        className={` flex justify-center items-center py-3 w-full text-sm`}
                    >
                        <button onClick={hideModelHandler}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorySettingsModel;
