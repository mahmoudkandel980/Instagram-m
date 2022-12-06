import { useContext } from "react";

import Posts from "./routes/posts";
import Tagged from "./routes/tagged";

import ToggleMode from "../../context/darkMode";
import ShowHideModels from "../../context/showHideModels-context";

import { MdOutlineGridOn } from "react-icons/md";
import { MdOutlinePermContactCalendar } from "react-icons/md";

import { PostsInterface } from "../../interfaces/posts-interfaces";

const SpecificUserLowerData = (props: PostsInterface): JSX.Element => {
    const { posts } = props;

    const modeCtx = useContext(ToggleMode);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { mode } = modeCtx;
    const { specificUserQuery, setSpecificUserQueryHandler } =
        showHideModelsCtx;

    const setSpecificUserQueryHandlerFun = (query: string) => {
        setSpecificUserQueryHandler(query);
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
                        onClick={setSpecificUserQueryHandlerFun.bind(
                            null,
                            "posts"
                        )}
                        className={`${
                            specificUserQuery === "posts" &&
                            mode === "dark" &&
                            "border-white/50 text-lightBlue sm:text-white "
                        } ${
                            specificUserQuery === "posts" &&
                            mode !== "dark" &&
                            "border-smothDark/50 text-lightBlue sm:text-smothDark "
                        }
                            ${
                                specificUserQuery !== "posts" &&
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
                        onClick={setSpecificUserQueryHandlerFun.bind(
                            null,
                            "tagged"
                        )}
                        className={`${
                            specificUserQuery === "tagged" &&
                            mode === "dark" &&
                            "border-white/50 text-lightBlue sm:text-white"
                        } ${
                            specificUserQuery === "tagged" &&
                            mode !== "dark" &&
                            "border-smothDark/50 text-lightBlue sm:text-smothDark "
                        }
                            ${
                                specificUserQuery !== "tagged" &&
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
                    {specificUserQuery === "posts" ? (
                        <Posts posts={posts} />
                    ) : (
                        <Tagged />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpecificUserLowerData;
