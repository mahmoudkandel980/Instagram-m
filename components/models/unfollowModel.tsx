import { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { db } from "../../firebase.config";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

import CurrentUserFollowing from "../../context/currentUserFollowing";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { ModeInterFace } from "../../interfaces/interfaces";
import { UnfollowModelInterface } from "../../interfaces/interfaces";
const UnfollowModel = (props: ModeInterFace & UnfollowModelInterface) => {
    const { mode, userImg, userName } = props;

    const router = useRouter();
    const { asPath, pathname } = router;

    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const { unfollowingModelHandler, removeFromFollowing, unfollowingModel } =
        currentUserFollowingCtx;

    const confirmUnfollowPersonHandler = async () => {
        // remove following from firebase
        // update to currentUser following
        const followingRef = doc(
            db,
            "allUsers",
            `${unfollowingModel.currentUserUserUserName}`
        );
        await updateDoc(followingRef, {
            following: arrayRemove({
                fullName: unfollowingModel.fullName,
                userImg: unfollowingModel.userImg,
                userName: unfollowingModel.userName,
            }),
        });

        // update to user followers
        const followersRef = doc(
            db,
            "allUsers",
            `${unfollowingModel.userName}`
        );
        await updateDoc(followersRef, {
            followers: arrayRemove({
                fullName: unfollowingModel.currentUserUserFullName,
                userImg: unfollowingModel.currentUserUserUserImg,
                userName: unfollowingModel.currentUserUserUserName,
            }),
        });

        removeFromFollowing(userName);

        hideModelHandler();
    };

    // hide unfollow model
    const hideModelHandler = () => {
        unfollowingModelHandler(
            false,
            unfollowingModel.userName,
            unfollowingModel.fullName,
            unfollowingModel.userImg,
            unfollowingModel.currentUserUserUserName,
            unfollowingModel.currentUserUserFullName,
            unfollowingModel.currentUserUserUserImg
        );
    };

    return (
        <div className="fixed z-[1000] -top-1.5 left-0 w-screen h-full">
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
                } fixed z-[10] top-[50%] left-[50%] w-[90%] sm:w-96 rounded-md -translate-x-[50%] sm:-translate-x-48 -translate-y-[50%] sm:-translate-y-48`}
            >
                <div
                    className={`${
                        mode === "dark"
                            ? "border-gray-600/40"
                            : "border-gray-600/10"
                    }  border-b-[1px] pt-5 w-full flex flex-col justify-center items-center`}
                >
                    <div className="rounded-full w-24 h-24 relative cursor-pointer">
                        <Image
                            src={userImg || getPhotoSrcFun(userName)}
                            layout="fill"
                            className="object-contain rounded-full"
                            alt={"instagram_logo"}
                            priority
                        />
                    </div>
                    <div className="text-md font-thin py-4 pb-8 text-center px-1">
                        {asPath.includes("/profile") ? (
                            <div>
                                <span>{`If you change your mind, you'll have to request to join @`}</span>
                                <span
                                    className={`${
                                        userName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } inline-flex`}
                                >
                                    <span className="w-full truncate">
                                        {userName}
                                    </span>
                                </span>
                                <span>{` again.`}</span>
                            </div>
                        ) : pathname.includes("/[userName]") ? (
                            <div>
                                <span>{`If you change your mind, you'll have to request to join @`}</span>
                                <span
                                    className={`${
                                        userName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } inline-flex`}
                                >
                                    <span className="w-full truncate">
                                        {userName}
                                    </span>
                                </span>
                                <span>{` again.`}</span>
                            </div>
                        ) : (
                            <div>
                                <span>Leave @</span>
                                <span
                                    className={`${
                                        userName.length > 20
                                            ? "w-32"
                                            : "min-w-max"
                                    } inline-flex`}
                                >
                                    <span className="w-full truncate">
                                        {userName}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`${
                        mode === "dark"
                            ? "border-gray-600/40"
                            : "border-gray-600/10"
                    }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                >
                    <button onClick={confirmUnfollowPersonHandler}>
                        Unfollow
                    </button>
                </div>
                <div
                    className={` flex justify-center items-center py-3 w-full text-sm`}
                >
                    <button onClick={hideModelHandler}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UnfollowModel;
