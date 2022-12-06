import { useContext } from "react";
import Image from "next/image";

import { db } from "../../firebase.config";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

import CurrentUserFollowing from "../../context/currentUserFollowing";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { ModeInterFace } from "../../interfaces/interfaces";
import { UnfollowModelInterface } from "../../interfaces/interfaces";
const RemoveFollowerModel = (props: ModeInterFace & UnfollowModelInterface) => {
    const { mode, userImg, userName } = props;

    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const {
        removeFollowersModelHandler,
        removeFromFollowers,
        removeFollowersModel,
    } = currentUserFollowingCtx;

    const confirmRemovePersonHandler = async () => {
        // remove followers from firebase
        // update to currentUser followers
        const followingRef = doc(
            db,
            "allUsers",
            `${removeFollowersModel.currentUserUserUserName}`
        );
        await updateDoc(followingRef, {
            followers: arrayRemove({
                fullName: removeFollowersModel.fullName,
                userImg: removeFollowersModel.userImg,
                userName: removeFollowersModel.userName,
            }),
        });

        // update to user following
        const followersRef = doc(
            db,
            "allUsers",
            `${removeFollowersModel.userName}`
        );
        await updateDoc(followersRef, {
            following: arrayRemove({
                fullName: removeFollowersModel.currentUserUserFullName,
                userImg: removeFollowersModel.currentUserUserUserImg,
                userName: removeFollowersModel.currentUserUserUserName,
            }),
        });

        removeFromFollowers(userName);

        hideModelHandler();
    };

    // hide unfollow model
    const hideModelHandler = () => {
        removeFollowersModelHandler(
            false,
            removeFollowersModel.userName,
            removeFollowersModel.fullName,
            removeFollowersModel.userImg ||
                getPhotoSrcFun(removeFollowersModel.userName),
            removeFollowersModel.currentUserUserUserName,
            removeFollowersModel.currentUserUserFullName,
            removeFollowersModel.currentUserUserUserImg
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
                    <p className="text-md font-thin py-4 pb-8 text-center px-2">
                        <span>{`Instagram won't tell `}</span>
                        <span
                            className={`${
                                userName.length > 20 ? "w-32" : "min-w-max"
                            } inline-flex`}
                        >
                            <span className="w-full truncate">{userName}</span>
                        </span>
                        <span>{` hey were removed from your followers.`}</span>
                    </p>
                </div>
                <div
                    className={`${
                        mode === "dark"
                            ? "border-gray-600/40"
                            : "border-gray-600/10"
                    }  flex justify-center items-center border-b-[1px] py-3 w-full text-sm text-lightRed font-medium`}
                >
                    <button onClick={confirmRemovePersonHandler}>Remove</button>
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

export default RemoveFollowerModel;
