//  this context will render all current user following to render in all project pages not be individual in one section
//  untill route to another page

import { createContext, useState, useEffect } from "react";

import { db } from "../firebase.config";
import {
    deleteDoc,
    doc,
    addDoc,
    collection,
    arrayUnion,
    updateDoc,
    arrayRemove,
    getDoc,
    setDoc,
    deleteField,
} from "firebase/firestore";

import { Props } from "../interfaces/context-interfaces";

import {
    SpecificFollowingInterface,
    UnfollowingModel,
    RemoveFollowerModel,
} from "../interfaces/following-Follow-interface";

const initialFollowing: SpecificFollowingInterface[] = [
    {
        fullName: "",
        userName: "",
        userImg: "",
    },
];

const initialFollowers: SpecificFollowingInterface[] = [
    {
        fullName: "",
        userName: "",
        userImg: "",
    },
];

const initailUnfollowingModel: UnfollowingModel = {
    showUnfollowingModel: false,
    userName: "",
    fullName: "",
    userImg: "",
    currentUserUserUserName: "",
    currentUserUserFullName: "",
    currentUserUserUserImg: "",
};

const initailRemveFollowersModel: RemoveFollowerModel = {
    showRemoveFollowersModel: false,
    userName: "",
    fullName: "",
    userImg: "",
    currentUserUserUserName: "",
    currentUserUserFullName: "",
    currentUserUserUserImg: "",
};

const CurrentUserFollowing = createContext({
    //following
    following: initialFollowing,
    addAllFollowings: (followings: SpecificFollowingInterface[]): void => {},
    addToFollowing: (
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ): void => {},
    removeFromFollowing: (userName: string): void => {},

    // followers
    followers: initialFollowers,
    addAllfollowers: (followers: SpecificFollowingInterface[]): void => {},
    addToFollowers: (
        userName: string,
        fullName: string,
        userImg: string
    ): void => {},
    removeFromFollowers: (userName: string): void => {},

    // unfollowing model
    unfollowingModel: initailUnfollowingModel,
    unfollowingModelHandler: (
        showUnfollowingModel: boolean,
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ): void => {},

    // remove followers model
    removeFollowersModel: initailRemveFollowersModel,
    removeFollowersModelHandler: (
        showRemoveFollowersModel: boolean,
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ): void => {},
});

export const CurrentUserFollowingProvider = (props: Props): JSX.Element => {
    const { children } = props;

    const [following, setFollowing] =
        useState<SpecificFollowingInterface[]>(initialFollowing);
    const [unfollowingModel, setUnfollowingModel] = useState<UnfollowingModel>(
        initailUnfollowingModel
    );

    const [followers, setFollowers] =
        useState<SpecificFollowingInterface[]>(initialFollowers);
    const [removeFollowersModel, setRemoveFollowersModel] =
        useState<RemoveFollowerModel>(initailRemveFollowersModel);

    // following--------------------------
    const addAllFollowings = (followings: SpecificFollowingInterface[]) => {
        setFollowing(followings);
    };

    const addToFollowing = async (
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ) => {
        // add following to firebase
        // update to currentUser following
        const followingRef = doc(db, "allUsers", `${currentUserUserUserName}`);
        await updateDoc(followingRef, {
            following: arrayUnion({
                fullName,
                userImg,
                userName,
            }),
        });

        // update to user followers
        const followersRef = doc(db, "allUsers", `${userName}`);
        await updateDoc(followersRef, {
            followers: arrayUnion({
                fullName: currentUserUserFullName,
                userImg: currentUserUserUserImg,
                userName: currentUserUserUserName,
            }),
        });

        setFollowing((prevState) =>
            prevState.concat({ userImg, fullName, userName })
        );
    };

    const removeFromFollowing = (userName: string) => {
        setFollowing((prevState) =>
            prevState.filter(
                (singleFollowing) => singleFollowing.userName !== userName
            )
        );

        // remove following to firebase
    };

    // followers--------------------------
    const addAllfollowers = (followings: SpecificFollowingInterface[]) => {
        setFollowers(followings);
    };

    const addToFollowers = (
        userName: string,
        fullName: string,
        userImg: string
    ) => {
        setFollowers((prevState) =>
            prevState.concat({ userImg, fullName, userName })
        );

        // add followers to firebase
    };

    const removeFromFollowers = (userName: string) => {
        setFollowers((prevState) =>
            prevState.filter(
                (singleFollowing) => singleFollowing.userName !== userName
            )
        );

        // remove followers to firebase
    };

    // unfollowing model--------------------------
    const unfollowingModelHandler = (
        showUnfollowingModel: boolean,
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ) => {
        setUnfollowingModel({
            showUnfollowingModel,
            userName,
            fullName,
            userImg,
            currentUserUserUserName,
            currentUserUserFullName,
            currentUserUserUserImg,
        });
    };

    // unfollowing model--------------------------
    const removeFollowersModelHandler = (
        showRemoveFollowersModel: boolean,
        userName: string,
        fullName: string,
        userImg: string,
        currentUserUserUserName: string,
        currentUserUserFullName: string,
        currentUserUserUserImg: string
    ) => {
        setRemoveFollowersModel({
            showRemoveFollowersModel,
            userName,
            fullName,
            userImg,
            currentUserUserUserName,
            currentUserUserFullName,
            currentUserUserUserImg,
        });
    };

    const data = {
        // following
        following,
        addAllFollowings,
        addToFollowing,
        removeFromFollowing,

        // followers
        followers,
        addAllfollowers,
        addToFollowers,
        removeFromFollowers,

        // unfollowing model
        unfollowingModel,
        unfollowingModelHandler,

        // remove followers model
        removeFollowersModel,
        removeFollowersModelHandler,
    };
    return (
        <CurrentUserFollowing.Provider value={data}>
            {children}
        </CurrentUserFollowing.Provider>
    );
};

export default CurrentUserFollowing;
