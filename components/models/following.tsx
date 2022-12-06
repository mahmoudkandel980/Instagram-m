import { useContext } from "react";
import { useRouter } from "next/router";

import ProfileFollowingModel from "./following/profileFollowingModel";
import SpecificFollowingModel from "./following/specificFollowingModel";

import RemoveFollwersUnfollowingModel from "../../context/removeFollwersUnfollowingModel-context";

import { IoIosClose, IoIosArrowBack } from "react-icons/io";

import { StoriesInterface } from "../../interfaces/stories-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";
import { ModeInterFace, FollowingInterface } from "../../interfaces/interfaces";

const Following = (
    props: ModeInterFace & FollowingInterface & UserInterface & StoriesInterface
): JSX.Element => {
    const { mode, following, currentUser, stories } = props;

    const router = useRouter();
    const pathname = router.pathname;
    const { userName } = router.query;

    const RemoveFollwersUnfollowingCtx = useContext(
        RemoveFollwersUnfollowingModel
    );
    const { showUnfollowModel, toggleShowUnfollowModel } =
        RemoveFollwersUnfollowingCtx;

    const hideModelHandler = () => {
        router.push(`${userName ? userName : pathname}`, undefined, {
            scroll: false,
        });

        // adding delay to hide flikring of model to following one
        setTimeout(() => {
            toggleShowUnfollowModel(false);
        }, 300);
    };

    return (
        <div className="fixed z-[100] top-0 left-0 w-screen h-full ">
            <div
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/70"
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
                        ? " fixed z-[110] top-[50%] left-0 sm:left-[50%] w-[90%] sm:w-96 rounded-md translate-x-[5%] sm:-translate-x-48 -translate-y-[50%] sm:-translate-y-36"
                        : " fixed z-[110] -top-1.5 sm:top-[50%] left-0 sm:left-[50%] w-full sm:w-96 h-full sm:h-72 sm:rounded-md sm:-translate-x-48 sm:-translate-y-36"
                } `}
            >
                <div className="pt-2 flex flex-col items-start h-full">
                    <div
                        className={`${
                            mode === "dark"
                                ? "border-gray-600/40"
                                : "border-gray-600/10"
                        } ${
                            showUnfollowModel && "hidden"
                        } pb-1 px-2 w-full flex justify-between sm:justify-end items-center border-b-[1px]`}
                    >
                        <div
                            className="block sm:hidden"
                            onClick={hideModelHandler}
                        >
                            <IoIosArrowBack className="w-7 h-7" />
                        </div>
                        <div className="sm:pr-32">
                            <span className="font-[700]">following</span>
                        </div>
                        <div
                            onClick={hideModelHandler}
                            className="cursor-pointer hidden sm:block"
                        >
                            <IoIosClose className="w-7 h-7" />
                        </div>
                        <div></div>
                    </div>
                    <div className="hideScrollBar px-2 pt-1 overflow-y-scroll w-full h-full pb-10 sm:pb-0">
                        {userName ? (
                            <SpecificFollowingModel
                                following={following}
                                mode={mode}
                                hideModelHandler={hideModelHandler}
                                currentUser={currentUser}
                                stories={stories}
                            />
                        ) : (
                            <ProfileFollowingModel
                                following={following}
                                mode={mode}
                                hideModelHandler={hideModelHandler}
                                stories={stories}
                                currentUser={currentUser}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Following;
