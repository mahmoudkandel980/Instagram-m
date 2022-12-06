/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useState, useContext } from "react";

import { auth, db } from "../../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";

import Spinner from "../ui/spinner";

import ShowHideModels from "../../context/showHideModels-context";

import { IoMdClose, IoIosArrowBack } from "react-icons/io";
import { TbPhoto } from "react-icons/tb";

import { ModeInterFace } from "../../interfaces/interfaces";

const UploadProfileImage = (props: ModeInterFace) => {
    const { mode } = props;

    const [shareBtnClicked, setShareBtnClicked] = useState(false);
    const [images, setImages] = useState<any>();
    const [showDiscard, setShowDiscard] = useState<boolean>(false);

    const showHideModelsCtx = useContext(ShowHideModels);
    const { editProfileModelHandler, editProfileModel } = showHideModelsCtx;

    const hideModelHandler = () => {
        editProfileModelHandler(
            false,
            editProfileModel.caption,
            editProfileModel.showCaptionInput,
            editProfileModel.image,
            false
        );
    };

    const showDiscardHandler = () => {
        setShowDiscard(true);
    };

    const discardHandler = () => {
        setShowDiscard(false);
        setImages("");
    };

    const uploadImagesHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files);
    };

    const submitHandler = async () => {
        setShareBtnClicked(true);

        // firebase upload profile pic
        const storeImage = async (image: any) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser?.uid}-${
                    image.name
                }-${uuidv4()}`;

                const storageRef = ref(storage, "images/" + fileName);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                            default:
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                                resolve(downloadURL);
                            }
                        );
                    }
                );
            });
        };

        const img = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            console.log(error);
            return;
        });

        const docRef = await updateDoc(
            doc(db, "allUsers", auth.currentUser?.displayName!),
            // @ts-ignore
            { userImg: img[0] }
        );

        setTimeout(() => {
            setShareBtnClicked(false);
            editProfileModelHandler(
                false,
                editProfileModel.caption,
                editProfileModel.showCaptionInput,
                images,
                false
            );
        }, 1000);
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full z-[100]">
            <div className="fixed z-[100] top-0 left-0 w-screen h-full ">
                <div
                    className={`${
                        mode === "dark" ? "bg-dark/30" : "bg-dark/70"
                    } w-full h-full`}
                    onClick={images ? showDiscardHandler : hideModelHandler}
                ></div>

                <div
                    onClick={images ? showDiscardHandler : hideModelHandler}
                    className="close-btn hidden sm:block fixed top-20 right-5"
                >
                    <IoMdClose className="w-7 h-7 cursor-pointer text-white" />
                </div>

                <div
                    className={`${
                        mode === "dark"
                            ? "bg-smothDark text-white"
                            : "bg-gray-100 text-smothDark"
                    } ${
                        images
                            ? " lg:w-[1000px] lg:-translate-x-[500px]"
                            : " lg:w-[700px] lg:-translate-x-[350px]"
                    } fixed z-[110] -top-1.5 left-0 sm:rounded-lg overflow-hidden w-full h-full sm:h-[60%] lg:h-[70%] sm:top-[20%] lg:top-[15%] sm:left-[2.5%] sm:w-[95%] lg:left-[50%]`}
                >
                    <div className="pt-2 flex flex-col items-start justify-center h-full w-full">
                        <div
                            className={`${
                                mode === "dark"
                                    ? "border-gray-600/40"
                                    : "border-gray-600/10"
                            } pb-1 w-full flex justify-start items-center border-b-[1px] relative h-9`}
                        >
                            <div
                                onClick={
                                    images
                                        ? showDiscardHandler
                                        : hideModelHandler
                                }
                                className="z-10 pl-2 sm:pl-5"
                            >
                                <IoIosArrowBack className="w-7 h-7 cursor-pointer" />
                            </div>
                            <div className="absolute -z-10 flex justify-center font-[700] w-full">
                                Upload profile picture
                            </div>
                            {images ? (
                                <div
                                    onClick={submitHandler}
                                    className="cursor-pointer absolute right-2 sm:right-5 text-lightBlue"
                                >
                                    {shareBtnClicked ? (
                                        <div className="flex justify-center items-center">
                                            <Spinner className="scale-[0.2] mb-1 w-8 h-5" />
                                        </div>
                                    ) : (
                                        `Share`
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div
                            className={`${
                                !images && "px-2 pt-1"
                            } flex flex-col justify-center items-center w-full h-full overflow-hidden`}
                        >
                            <div
                                className={`${
                                    images && "hidden"
                                } flex flex-col justify-center items-center px-2 pt-1 w-full h-full`}
                            >
                                <TbPhoto className="h-16 w-16 sm:w-20 sm:h-20 lg:h-24 lg:w-24 xl:w-28 xl:h-28" />
                                <p className="text-xl font-thin">
                                    Drag profile photo here
                                </p>
                                <label
                                    className={`${
                                        mode === "dark"
                                            ? "text-smothDark"
                                            : "text-white"
                                    } cursor-pointer mt-2 p-3 py-1 bg-lightBlue rounded-md`}
                                    htmlFor="images-input"
                                >
                                    <span className="sm:hidden">
                                        Select from mobile
                                    </span>
                                    <span className="hidden sm:block lg:hidden">
                                        Select from Tap
                                    </span>
                                    <span className="hidden lg:block">
                                        Select from Computer
                                    </span>
                                </label>
                                <input
                                    className="formInputFile hidden"
                                    type="file"
                                    id="images-input"
                                    onChange={uploadImagesHandler}
                                    max="1"
                                    accept=".jpg,.png,.jpeg"
                                    multiple
                                    required
                                    checked
                                />
                            </div>

                            <div
                                className={`${
                                    (images === undefined || images === "") &&
                                    "hidden"
                                } h-full w-full flex justify-center items-center`}
                            >
                                {/* left side model */}
                                <div className="h-[50%] sm:h-full">
                                    <img
                                        src={
                                            images === undefined ||
                                            images === ""
                                                ? ""
                                                : window.URL.createObjectURL(
                                                      images[0]
                                                  )
                                        }
                                        alt="uploaded-image"
                                        className="h-full w-full  object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  */}

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
                        } fixed z-[110] top-[50%] left-0 sm:left-[50%] w-[90%] sm:w-96 h-44 rounded-md translate-x-[5%] sm:-translate-x-48 -translate-y-24`}
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
        </div>
    );
};

export default UploadProfileImage;
