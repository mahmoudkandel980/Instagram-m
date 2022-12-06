import { useContext } from "react";

import Posts from "./routes/posts";
import Saved from "./routes/saved";
import Tagged from "./routes/tagged";

import ToggleMode from "../../context/darkMode";
import ShowHideModels from "../../context/showHideModels-context";

import { MdOutlineGridOn } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { MdOutlinePermContactCalendar } from "react-icons/md";

import { PostsInterface } from "../../interfaces/posts-interfaces";

const ProfileLowerData = (props: PostsInterface): JSX.Element => {
    const { posts } = props;

    const modeCtx = useContext(ToggleMode);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { mode } = modeCtx;
    const { setProfileQueryHandler, profileQuery } = showHideModelsCtx;

    const setProfileQueryHandlerFun = (query: string) => {
        setProfileQueryHandler(query);
    };

    return (
        <div className="pt-0 sm:pt-10">
            <div
                className={`${
                    mode === "dark"
                        ? "border-gray-600/20"
                        : "border-darkGray/5 "
                } border-t-[1px]`}
            >
                <div
                    className={`flex justify-between sm:justify-center items-center sm:space-x-20 uppercase font-semibold px-5 sm:px-0  text-[12px]`}
                >
                    <div
                        onClick={setProfileQueryHandlerFun.bind(null, "posts")}
                        className={`${
                            profileQuery === "posts" &&
                            mode === "dark" &&
                            "border-white/50 text-lightBlue sm:text-white"
                        } ${
                            profileQuery === "posts" &&
                            mode !== "dark" &&
                            "border-smothDark/50 text-lightBlue sm:text-smothDark "
                        }
                            ${
                                profileQuery !== "posts" &&
                                `border-transparent ${
                                    mode === "dark"
                                        ? "text-white/40"
                                        : "text-smothDark/40"
                                }`
                            }  flex justify-start items-center space-x-1 pt-2 sm:border-t-[1px] cursor-pointer`}
                    >
                        <span>
                            <MdOutlineGridOn className="w-6 h-6 sm:w-3 sm:h-3" />
                        </span>
                        <span className="hidden sm:block">posts</span>
                    </div>
                    <div
                        onClick={setProfileQueryHandlerFun.bind(null, "saved")}
                        className={`${
                            profileQuery === "saved" &&
                            mode === "dark" &&
                            "border-white/50 text-lightBlue sm:text-white"
                        } ${
                            profileQuery === "saved" &&
                            mode !== "dark" &&
                            "border-smothDark/50 text-lightBlue sm:text-smothDark "
                        }
                            ${
                                profileQuery !== "saved" &&
                                `border-transparent ${
                                    mode === "dark"
                                        ? "text-white/40"
                                        : "text-smothDark/40"
                                }`
                            }  flex justify-start items-center space-x-1 pt-2 sm:border-t-[1px] cursor-pointer`}
                    >
                        <span>
                            <BsBookmark className="w-6 h-6 sm:w-3 sm:h-3" />
                        </span>
                        <span className="hidden sm:block ">saved</span>
                    </div>
                    <div
                        onClick={setProfileQueryHandlerFun.bind(null, "tagged")}
                        className={`${
                            profileQuery === "tagged" &&
                            mode === "dark" &&
                            "border-white/50 text-lightBlue sm:text-white"
                        } ${
                            profileQuery === "tagged" &&
                            mode !== "dark" &&
                            "border-smothDark/50 text-lightBlue sm:text-smothDark "
                        }
                            ${
                                profileQuery !== "tagged" &&
                                `border-transparent ${
                                    mode === "dark"
                                        ? "text-white/40"
                                        : "text-smothDark/40"
                                }`
                            }  flex justify-start items-center space-x-1 pt-2 sm:border-t-[1px] cursor-pointer`}
                    >
                        <span className="pr-2">
                            <MdOutlinePermContactCalendar className="w-7 h-7 sm:w-3 sm:h-3" />
                        </span>
                        <span className="hidden sm:block">tagged</span>
                    </div>
                </div>
                <div>
                    {profileQuery === "posts" ? (
                        <Posts posts={posts} />
                    ) : profileQuery === "saved" ? (
                        <Saved posts={posts} />
                    ) : (
                        <Tagged />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileLowerData;
