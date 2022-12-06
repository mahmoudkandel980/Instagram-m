import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { auth, db } from "../../firebase.config";
import { updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";

import DocumentetedUsers from "../ui/documentetedUsers";

import ToggleMode from "../../context/darkMode";
import SearchContext from "../../context/search-context";
import RouterContext from "../../context/router-context";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { IoMdClose } from "react-icons/io";

import {
    SearchInputValue,
    ShowSearchModel,
    singlePersonSearchInterface,
} from "../../interfaces/interfaces";
import {
    AllUsersInterface,
    UserInterface,
    SingleUserInterface,
    UserSearchInterface,
} from "../../interfaces/user-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SearchModel = (
    props: AllUsersInterface &
        UserInterface &
        SearchInputValue &
        ShowSearchModel
) => {
    const { allUsers, currentUser, searchInputValue, setShowSearchModel } =
        props;
    const [showClearAllModel, SetShowClearAllModel] = useState(false);
    const [filterdUsers, setFilterdUsers] = useState<SingleUserInterface[]>([]);
    const [modifiedRecentSearch, setModifiedRecentSearch] = useState<
        UserSearchInterface[]
    >(currentUser?.search);

    const modeCtx = useContext(ToggleMode);
    const searchCtx = useContext(SearchContext);
    const routerCtx = useContext(RouterContext);

    const { mode } = modeCtx;
    const { removeSearchUserHandler, removedSearchUsers } = searchCtx;
    const { showRouterComponentHandler } = routerCtx;

    const modifiedSearchInputValue = searchInputValue
        .trim()
        .toLocaleLowerCase();

    useEffect(() => {
        const timer = setTimeout(() => {
            setModifiedRecentSearch(currentUser?.search);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [currentUser?.search]);

    // remove resent search
    useEffect(() => {
        if (removedSearchUsers) {
            removedSearchUsers.forEach((searchCtx) => {
                setModifiedRecentSearch((recentSearch) =>
                    recentSearch.filter(
                        (search) => search.userName !== searchCtx.userName
                    )
                );
            });
        }
    }, [removedSearchUsers]);

    // check if input value has any character from user fullName of userName
    useEffect(() => {
        setFilterdUsers([]);
        if (modifiedSearchInputValue.length > 0) {
            allUsers.forEach((user) => {
                if (
                    user.fullName
                        .toLowerCase()
                        .includes(modifiedSearchInputValue) ||
                    user.userName
                        .toLowerCase()
                        .includes(modifiedSearchInputValue)
                ) {
                    setFilterdUsers((prevState) => prevState.concat(user));
                }
            });
        }
        setFilterdUsers((prevState) =>
            prevState.filter(
                (person) => person.userName !== currentUser.userName
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInputValue]);

    // update search user to search of current user
    const updateUserSearchHandler = async (
        search: singlePersonSearchInterface[],
        userName: string,
        fullName: string,
        userImg: string
    ) => {
        let userInSearchArray = false;
        search.forEach((person) => {
            if (person.userName === userName) {
                userInSearchArray = true;
                return;
            }
        });

        if (!userInSearchArray) {
            // const modifiedSearch = [...search];
            // firebase
            try {
                // update caption to firebase
                const user = doc(
                    db,
                    "allUsers",
                    auth.currentUser?.displayName!
                );
                await updateDoc(user, {
                    search: arrayRemove(...modifiedRecentSearch),
                });

                modifiedRecentSearch.push({
                    fullName,
                    userImg,
                    userName,
                });

                await updateDoc(user, {
                    search: arrayUnion(...modifiedRecentSearch),
                });
            } catch (error) {
                console.log(error);
            }

            // update  profile data to render recent search
        }

        showRouterComponentHandler(true);
        setShowSearchModel(false);
    };

    // when click on userImg or userName show routing model and hide search model
    const showRouterCtxHandler = () => {
        showRouterComponentHandler(true);
        setShowSearchModel(false);
    };

    const removeAllUsersFromSearchHandler = () => {
        SetShowClearAllModel(true);
    };

    const hideClearAllModel = () => {
        SetShowClearAllModel(false);
    };

    const confirmRemoveAllUsersFromSearchHandler = async () => {
        // firebase
        const user = doc(db, "allUsers", auth.currentUser?.displayName!);
        await updateDoc(user, {
            search: arrayRemove(...modifiedRecentSearch),
        });

        setModifiedRecentSearch([]);
        SetShowClearAllModel(false);
    };

    const removeUserFromSearchHandler = async (person: UserSearchInterface) => {
        // firebase
        const user = doc(db, "allUsers", auth.currentUser?.displayName!);
        await updateDoc(user, {
            search: arrayRemove(...modifiedRecentSearch),
        });

        const filteredModifiedRecentSearch = modifiedRecentSearch.filter(
            (currentPerson) => currentPerson.userName !== person.userName
        );

        await updateDoc(user, {
            search: arrayUnion(...filteredModifiedRecentSearch),
        });

        removeSearchUserHandler(person);
    };

    return (
        <div className="w-full">
            <div
                className={`${
                    mode === "dark" ? "bg-inputColor" : "bg-[#ebebeb]"
                } rotate-180 sm:rotate-0 absolute -top-10 sm:-top-1.5 left-3 sm:left-10 w-3 h-3`}
                style={{
                    clipPath: "polygon(51% 49%, 0% 100%, 100% 100%)",
                }}
            ></div>
            {searchInputValue.length > 0 ? (
                // search of search  input section
                <section
                    className={`${
                        mode === "dark"
                            ? "bg-smothDark border-[1px] border-inputColor/20 text-white "
                            : "bg-white border-[1px] border-darkGray/10 text-smothDark"
                    } hideScrollBar py-3 pl-1 flex rounded-md flex-col justify-start items-start -top-[360px] sm:top-1.5 h-80 -right-5 sm:-left-10 w-screen sm:w-80 absolute space-y-1 overflow-x-scroll`}
                >
                    {filterdUsers.map((person) => (
                        <div key={person.userName} className="w-full">
                            <div className="py-1.5 px-2 pr-4 flex justify-start items-center space-x-3 w-[100%] overflow-hidden relative">
                                <div className="rounded-full w-10 h-10 relative cursor-pointer">
                                    <Link href={`${person.userName}`}>
                                        <a
                                            className="w-full h-full relative"
                                            onClick={updateUserSearchHandler.bind(
                                                null,
                                                person.search,
                                                person.userName,
                                                person.fullName,
                                                person.userImg
                                            )}
                                        >
                                            <div className="w-full h-full relative">
                                                <Image
                                                    src={
                                                        person.userImg ||
                                                        getPhotoSrcFun(
                                                            person.userName
                                                        )
                                                    }
                                                    layout="fill"
                                                    className="object-contain rounded-full"
                                                    alt={"instagram_logo"}
                                                    priority
                                                />
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                                <div
                                    className={`${
                                        person.userName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } flex flex-col justify-center -space-y-0.5 flex-wrap`}
                                >
                                    <div className="flex justify-start space-x-1.5 items-center w-full">
                                        <Link href={`${person.userName}`}>
                                            <a
                                                onClick={updateUserSearchHandler.bind(
                                                    null,
                                                    person.search,
                                                    person.userName,
                                                    person.fullName,
                                                    person.userImg
                                                )}
                                                className="font-semibold cursor-pointer w-full truncate"
                                            >
                                                {person.userName}
                                            </a>
                                        </Link>
                                        <DocumentetedUsers
                                            className="w-3 h-3"
                                            userName={person.userName}
                                        />
                                    </div>
                                    <span
                                        className={`${
                                            mode === "dark"
                                                ? "text-gray-300/50"
                                                : "text-gray-400/90"
                                        } text-[12px] capitalize w-full truncate`}
                                    >
                                        {person.fullName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filterdUsers.length === 0 && (
                        <div className="flex justify-center items-center w-full h-full px-5">
                            <span
                                className={`text-darkRed text-center font-semibold`}
                            >
                                No results found.
                            </span>
                        </div>
                    )}
                </section>
            ) : (
                // recent search section
                <section
                    className={`${
                        mode === "dark"
                            ? "bg-smothDark border-[1px] border-inputColor/20 text-white "
                            : "bg-white border-[1px] border-darkGray/10 text-smothDark"
                    } hideScrollBar py-3 pl-1 flex rounded-md flex-col justify-start items-start -top-[360px] sm:top-1.5 h-80 -right-5 sm:-left-10 w-screen sm:w-80 absolute space-y-1 overflow-x-scroll`}
                >
                    <div
                        className={`${
                            mode === "dark" ? "bg-smothDark" : "bg-white"
                        } sticky -top-3 left-0 w-full -pt-5 px-2 z-10`}
                    >
                        <div className="flex justify-between items-center w-full h-10">
                            <span className="font-bold text-[17px]">
                                Recent
                            </span>
                            <span
                                onClick={removeAllUsersFromSearchHandler}
                                className={`${
                                    currentUser?.search?.length === 0 &&
                                    "hidden"
                                } text-lightBlue text-[14px] cursor-pointer`}
                            >
                                Clear all
                            </span>
                        </div>
                    </div>
                    {modifiedRecentSearch?.length > 0 ? (
                        modifiedRecentSearch.map((person) => (
                            <div key={person.userName} className="w-full">
                                <div className="py-1.5 px-2 pr-4 flex justify-start items-center space-x-3 w-[100%] overflow-hidden relative">
                                    <div className="rounded-full w-10 h-10 relative cursor-pointer">
                                        <Link href={`${person.userName}`}>
                                            <a
                                                className="w-full h-full relative"
                                                onClick={showRouterCtxHandler}
                                            >
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={
                                                            person.userImg ||
                                                            getPhotoSrcFun(
                                                                person.userName
                                                            )
                                                        }
                                                        layout="fill"
                                                        className="object-contain rounded-full"
                                                        alt={"instagram_logo"}
                                                        priority
                                                    />
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                    <div
                                        className={`${
                                            person.userName.length > 20
                                                ? "w-32"
                                                : "min-w-max"
                                        } flex flex-col justify-center -space-y-0.5 flex-wrap`}
                                    >
                                        <div className="flex justify-start space-x-1.5 items-center w-full">
                                            <Link href={`${person.userName}`}>
                                                <a
                                                    onClick={
                                                        showRouterCtxHandler
                                                    }
                                                    className="font-semibold cursor-pointer w-full truncate"
                                                >
                                                    {person.userName}
                                                </a>
                                            </Link>
                                            <DocumentetedUsers
                                                className="w-3 h-3"
                                                userName={person.userName}
                                            />
                                        </div>
                                        <span
                                            className={`${
                                                mode === "dark"
                                                    ? "text-gray-300/50"
                                                    : "text-gray-400/90"
                                            } text-[12px] capitalize w-full truncate`}
                                        >
                                            {person.fullName}
                                        </span>
                                    </div>

                                    <div className="flex justify-end text-[11px] font-bold relative flex-1  ">
                                        <span
                                            onClick={removeUserFromSearchHandler.bind(
                                                null,
                                                person
                                            )}
                                            className={`${
                                                mode === "dark"
                                                    ? "border-gray-600/40"
                                                    : "border-gray-600/10 "
                                            } capitalize text-sm  cursor-pointer w-fit`}
                                        >
                                            <IoMdClose className="w-5 h-5 cursor-pointer" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <span
                                className={`${
                                    mode === "dark"
                                        ? "text-white/40"
                                        : "text-smothDark/40"
                                }`}
                            >
                                No recent searches.
                            </span>
                        </div>
                    )}
                </section>
            )}

            {/* clear all model */}
            <AnimatePresence>
                {showClearAllModel && (
                    <motion.div
                        className="top-0 left-0 fixed w-full h-full z-[100]"
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
                        {showClearAllModel && (
                            <div className="absolute bottom-0 sm:-top-11 right-0 w-screen translate-x-5 sm:translate-x-[42%] h-screen">
                                <div
                                    onClick={hideClearAllModel}
                                    className={`${
                                        mode === "dark"
                                            ? "bg-smothDark/30"
                                            : "bg-white/20"
                                    } w-full h-full`}
                                ></div>
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "border-[1px] border-inputColor/20  "
                                            : "border-[1px] border-darkGray/10 "
                                    } absolute top-[50%]  left-0 sm:left-[50%] sm:-translate-x-48 -translate-y-[50%] sm:-translate-y-[40%]`}
                                >
                                    <div className="flex justify-center items-center w-screen sm:w-full h-full">
                                        <div
                                            className={`${
                                                mode === "dark"
                                                    ? "bg-smothDark text-white"
                                                    : "bg-white text-smothDark"
                                            } flex flex-col justify-center items-center w-96 pt-5 rounded-md`}
                                        >
                                            <h2 className="font-bold pb-5">
                                                Clear search history?
                                            </h2>
                                            <p
                                                className={`${
                                                    mode === "dark"
                                                        ? " text-white/50"
                                                        : " text-smothDark/50"
                                                } text-center text-sm pb-5`}
                                            >
                                                You won&#39;t be able to undo
                                                this. If you clear your search
                                                history, you may still see
                                                accounts you&#39;ve searched for
                                                as suggested results.
                                            </p>
                                            <div
                                                className={`${
                                                    mode === "dark"
                                                        ? "border-gray-600/40"
                                                        : "border-gray-600/20"
                                                } flex justify-center items-center py-2 text-darkRed border-t-[1px] w-full`}
                                            >
                                                <span
                                                    onClick={
                                                        confirmRemoveAllUsersFromSearchHandler
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    Clear all
                                                </span>
                                            </div>
                                            <div
                                                className={`${
                                                    mode === "dark"
                                                        ? "border-gray-600/40"
                                                        : "border-gray-600/20"
                                                } flex justify-center items-center py-2 border-t-[1px] w-full`}
                                            >
                                                <span
                                                    onClick={hideClearAllModel}
                                                    className="cursor-pointer"
                                                >
                                                    Not now
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchModel;
