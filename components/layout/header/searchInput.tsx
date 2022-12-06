import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect } from "react";

import SearchModel from "../../models/searchModel";

import UserContext from "../../../context/user-context";
import UpdateTarget from "../../../context/updateTarget-context";

import { FiSearch } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";

import { ModeInterFace } from "../../../interfaces/interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SearchInput = (props: ModeInterFace) => {
    const { mode } = props;

    const [showSearchIcon, setShowSearchIcon] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [showSearchModel, setShowSearchModel] = useState<boolean>(false);

    const userCtx = useContext(UserContext);
    const updateTargetCtx = useContext(UpdateTarget);

    const { userData, users } = userCtx;
    const { setCurrentUserState } = updateTargetCtx;

    useEffect(() => {
        setCurrentUserState(showSearchModel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearchModel]);

    const onFousInInput = () => {
        setShowSearchIcon((prevState) => !prevState);
        setShowSearchModel(true);
    };
    const onBlurInInput = () => {
        setShowSearchIcon((prevState) => !prevState);
    };

    const changeSearchValueHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchValue(e.target.value);
    };

    const removeSearchValue = () => {
        setSearchValue("");
        setShowSearchModel(false);
    };

    const hideSearchModelHandler = () => {
        setShowSearchModel(false);
    };

    return (
        <div>
            {showSearchModel && (
                <div
                    onClick={hideSearchModelHandler}
                    className="absolute bottom-0 sm:top-0 left-0 w-screen h-screen bg-transparent "
                ></div>
            )}
            <div className="relative group">
                <input
                    onFocus={onFousInInput}
                    onBlur={onBlurInInput}
                    value={searchValue}
                    onChange={changeSearchValueHandler}
                    type="search"
                    spellCheck={false}
                    className={`${
                        showSearchIcon && mode === "dark"
                            ? "pl-7 text-gray-400/50"
                            : !showSearchIcon && mode === "dark"
                            ? "pr-7 text-white"
                            : showSearchIcon && mode !== "dark"
                            ? "pl-7 text-gray-300 border-[1px]"
                            : "pl-7 text-smothDark border-[1px]"
                    }
                           
                            ${
                                mode === "dark" ? "bg-inputColor" : "bg-white"
                            } p-1 px-2 md:w-52 lg:w-64 rounded-lg placeholder:text-gray-400/50 outline-none duration-200`}
                    placeholder="Search"
                />
                {showSearchIcon && (
                    <div className="absolute -top-0.5 left-1 translate-y-2.5 ">
                        <FiSearch className="text-gray-400/50 h-4 w-4" />
                    </div>
                )}

                <div
                    className={`${
                        showSearchIcon && "opacity-0"
                    } absolute -top-0.5 right-5 translate-y-2 cursor-pointer`}
                >
                    <TiDelete
                        onClick={removeSearchValue}
                        className="text-gray-400/50 h-5 w-5"
                    />
                </div>
            </div>

            <AnimatePresence>
                {showSearchModel && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transform: `translateY(0)`,
                        }}
                        exit={{
                            opacity: 0,
                            transform: `translateY(0)`,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                    >
                        {showSearchModel && (
                            <SearchModel
                                allUsers={users}
                                currentUser={userData}
                                searchInputValue={searchValue}
                                setShowSearchModel={setShowSearchModel}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchInput;
