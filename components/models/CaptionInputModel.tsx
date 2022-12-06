import { useState, useEffect, useContext } from "react";
import Image from "next/image";

import { auth, db } from "../../firebase.config";
import { updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";

import DocumentetedUsers from "../ui/documentetedUsers";

import UserContext from "../../context/user-context";
import ShowHideModels from "../../context/showHideModels-context";

import { FiSmile } from "react-icons/fi";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { ModeInterFace } from "../../interfaces/interfaces";

import dynamic from "next/dynamic";
import { IEmojiPickerProps } from "emoji-picker-react";
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import("emoji-picker-react"),
    {
        ssr: false,
        loading: () => <p>Emoji...</p>,
    }
);

const ALLOWABLE_CHARACTER_COUNT = 150;

const CaptionInputModel = (props: ModeInterFace) => {
    const { mode } = props;

    const [showDiscard, setShowDiscard] = useState<boolean>(false);
    const [textareaValue, setTextareaValue] = useState("");
    const [showEmojiList, setShowEmojiList] = useState(false);

    const userCtx = useContext(UserContext);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { userData } = userCtx;
    const { editProfileModel, editProfileModelHandler } = showHideModelsCtx;

    // give caption input existing caption value when load component
    useEffect(() => {
        setTextareaValue(editProfileModel.caption);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (textareaValue.length >= ALLOWABLE_CHARACTER_COUNT) {
            setTextareaValue((prevTextareaValue) =>
                prevTextareaValue.slice(0, ALLOWABLE_CHARACTER_COUNT)
            );
        }
    }, [textareaValue]);

    const onEmojiClick = (event: any, emojiObject: any) => {
        if (textareaValue.length <= ALLOWABLE_CHARACTER_COUNT) {
            setTextareaValue((prevState) =>
                prevState.concat(emojiObject.emoji)
            );
        }
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

    // close edit profile model
    const hideEditProfileModelHandler = () => {
        editProfileModelHandler(
            false,
            editProfileModel.caption,
            false,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    const discardHandler = () => {
        setShowDiscard(false);
        editProfileModelHandler(
            false,
            editProfileModel.caption,
            false,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    const showDiscardHandler = () => {
        setShowDiscard(true);
    };

    const onSubmitHandler = async () => {
        // firebase
        try {
            // update caption to firebase
            const user = doc(db, "allUsers", auth.currentUser?.displayName!);
            await updateDoc(user, { caption: textareaValue });
        } catch (error) {
            console.log(error);
        }

        editProfileModelHandler(
            false,
            textareaValue,
            false,
            editProfileModel.image,
            editProfileModel.showProfileImageModel
        );
    };

    return (
        <div className="absolute z-10 top-0 left-0 w-full h-full">
            <div
                className={`${
                    mode === "dark" ? "bg-dark/30" : "bg-dark/30"
                } w-full h-full`}
                onClick={
                    editProfileModel.caption === textareaValue
                        ? hideEditProfileModelHandler
                        : showDiscardHandler
                }
            ></div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-smothDark text-white"
                        : "bg-gray-100 text-smothDark"
                }  fixed z-[110] top-[50%] left-0 sm:left-[50%] w-[95%] sm:w-96 rounded-md translate-x-[2.5%] -translate-y-48 sm:-translate-x-48 sm:-translate-y-48`}
            >
                <div className="sm:flex-2 md:flex-1 w-full h-full py-5 sm:pt-3 sm:px-2">
                    {showEmojiList && (
                        <div
                            onClick={hideEmojiList}
                            className=" absolute top-0 left-0 w-full h-full bg-transparent z-1"
                        ></div>
                    )}
                    <div className="flex justify-start items-center space-x-3 w-full mr-5 pl-2 sm:pl-0">
                        <div className="rounded-full w-8 h-8 relative cursor-pointer">
                            <Image
                                src={
                                    userData.userImg ||
                                    getPhotoSrcFun(userData.userName)
                                }
                                layout="fill"
                                className="rounded-full  hover:scale-105 duration-200"
                                alt={"instagram_logo"}
                                priority
                            />
                        </div>
                        <div
                            className={`${
                                userData.userName.length > 20
                                    ? "w-32"
                                    : "min-w-max"
                            } flex flex-col items-start justify-center -space-y-0.5 flex-wrap`}
                        >
                            <div className="flex justify-start space-x-1.5 items-center w-full">
                                <span className="font-semibold cursor-pointer w-full truncate">
                                    {userData.userName}
                                </span>
                                <DocumentetedUsers
                                    className="w-3 h-3"
                                    userName={userData.userName}
                                />
                            </div>
                        </div>
                        <div
                            className={`${
                                showEmojiList ||
                                editProfileModel.caption === textareaValue
                                    ? "text-lightBlue/50"
                                    : "text-lightBlue"
                            } flex justify-end items-center flex-1 pr-1 font-semibold`}
                        >
                            <button onClick={onSubmitHandler}>Submit</button>
                        </div>
                    </div>
                    <div className="pt-5 relative w-full">
                        {/* textarea */}
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-gray-600/50"
                                    : "border-gray-300/60"
                            } flex items-center self-center border-b-[1px] pb-1 pl-2 sm:pl-0`}
                        >
                            <textarea
                                className={`${
                                    mode === "dark"
                                        ? "text-white bg-smothDark placeholder:text-gray-300/70"
                                        : "text-smothDark bg-white placeholder:text-gray-700/70"
                                } ${
                                    textareaValue.length > 0
                                        ? "h-32 overflow-y-scroll"
                                        : "h-7"
                                } hideScrollBar w-full outline-none px-1 pr-2 rounded-md`}
                                spellCheck={false}
                                autoFocus
                                value={textareaValue}
                                onChange={textareaChangeHandler}
                                onFocus={hideEmojiList}
                                placeholder="Write a caption..."
                            ></textarea>
                        </div>
                        <div
                            className={`${
                                textareaValue.length > 0
                                    ? "pt-[10px]"
                                    : "pt-[110px]"
                            } relative w-full`}
                        >
                            {showEmojiList && (
                                <div
                                    className={`${
                                        mode === "dark"
                                            ? "bg-darkBody/95"
                                            : "bg-gray-300/95"
                                    } ${
                                        textareaValue.length > 0
                                            ? "bottom-6 sm:top-8 "
                                            : "bottom-6 sm:top-[131px]"
                                    } rotate-180 sm:rotate-0 absolute left-7 sm:left-2 w-3 h-3`}
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
                                        textareaValue.length > 0
                                            ? "-top-[318px] sm:top-11"
                                            : "-top-[218px] sm:top-[142px]"
                                    } absolute sm:left-0 md:-left-32 lg:left-0 overflow-hidden rounded-md`}
                                >
                                    {/* emoji */}
                                    <EmojiPickerNoSSRWrapper
                                        onEmojiClick={onEmojiClick}
                                    />
                                </div>
                            )}
                            <div className="w-fill flex justify-between items-center relative px-5 sm:px-0">
                                <span onClick={toggleEmojiList}>
                                    <FiSmile
                                        className={`${
                                            mode === "dark"
                                                ? "text-white"
                                                : "text-smothDark"
                                        } w-7 h-7 cursor-pointer`}
                                    />
                                </span>
                                {/* carater counter */}
                                <div className="pr-2 text-[12px] font-thin opacity-50 hover:opacity-100 cursor-pointer">
                                    <span>
                                        {textareaValue.length >=
                                        ALLOWABLE_CHARACTER_COUNT
                                            ? ALLOWABLE_CHARACTER_COUNT.toString().replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ","
                                              )
                                            : textareaValue.length
                                                  .toString()
                                                  .replace(
                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                      ","
                                                  )}
                                    </span>
                                    <span>/</span>
                                    <span>
                                        {ALLOWABLE_CHARACTER_COUNT.toString().replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`${
                    !showDiscard && "hidden"
                } absolute top-0 left-0 w-full h-full z-[1000]`}
            >
                <div
                    className={`${
                        mode === "dark" ? "bg-dark/30" : "bg-dark/50"
                    } absolute top-0 left-0 w-full h-full`}
                    onClick={() => setShowDiscard(false)}
                ></div>
                <div
                    className={`${
                        mode === "dark"
                            ? "bg-smothDark text-white"
                            : "bg-gray-100 text-smothDark"
                    } fixed z-[110] top-[50%] left-0 sm:left-[50%] w-[90%] sm:w-96 h-44 rounded-md translate-x-[5%] sm:-translate-x-48 -translate-y-36`}
                >
                    <div className="flex flex-col justify-center items-center">
                        <h3 className="text-xl font-bold pt-4">
                            Discard post?
                        </h3>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "text-white/50"
                                    : "text-darkGray/70"
                            } py-2 pb-5 text-[14px] font-thin block w-full text-center `}
                        >
                            If you leave, your edits won&#39;t be saved.
                        </span>
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-darkGray border-t-[1px]"
                                    : "border-t-[2px]"
                            } w-full h-10 text-darkRed text-center py-2`}
                        >
                            <div
                                className="cursor-pointer text-[14px]"
                                onClick={discardHandler}
                            >
                                Discard
                            </div>
                        </div>
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-darkGray border-t-[1px]"
                                    : "border-t-[2px]"
                            } w-full h-10 text-center py-2`}
                        >
                            <div
                                className="cursor-pointer text-[14px]"
                                onClick={() => setShowDiscard(false)}
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptionInputModel;
