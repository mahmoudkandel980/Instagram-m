import { useState, useEffect } from "react";

import SpecificSingleFollowers from "./specificSingleFollowers";

import { UserInterface } from "../../../interfaces/user-interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import {
    ModeInterFace,
    FollowersInterface,
    FollowingModelInterface,
    HideModelHandler,
} from "../../../interfaces/interfaces";

const SpecificFollowersModel = (
    props: ModeInterFace &
        FollowersInterface &
        HideModelHandler &
        UserInterface &
        StoriesInterface
) => {
    const { mode, followers, currentUser, stories } = props;

    const [modifiedFollowing, setModifiedFollowing] = useState<
        FollowingModelInterface[]
    >([]);

    useEffect(() => {
        setModifiedFollowing([]);
        let personExist: boolean = false;

        // get Current user  in first if exist
        followers?.forEach((follower) => {
            if (follower.userName === currentUser.userName) {
                setModifiedFollowing((prevState) =>
                    prevState.concat({ ...follower, followState: "user" })
                );
                return;
            }
        });

        followers?.forEach((follower, index) => {
            personExist = false;
            currentUser.following.forEach((following) => {
                if (follower.userName === following.userName) {
                    personExist = true;
                    return;
                }
            });
            if (follower.userName !== currentUser.userName) {
                if (personExist) {
                    setModifiedFollowing((prevState) =>
                        prevState.concat({
                            ...follower,
                            followState: "following",
                        })
                    );
                } else {
                    setModifiedFollowing((prevState) =>
                        prevState.concat({
                            ...follower,
                            followState: "follow",
                        })
                    );
                }
            }
        });
    }, [followers, currentUser.userName, currentUser.following]);

    return (
        <div>
            {modifiedFollowing.length > 0 &&
                modifiedFollowing.map((following, index) => (
                    <SpecificSingleFollowers
                        key={following.userName}
                        userName={following.userName}
                        fullName={following.fullName}
                        userImg={following.userImg}
                        followState={following.followState}
                        currentUser={currentUser}
                        mode={mode}
                        stories={stories}
                    />
                ))}
        </div>
    );
};

export default SpecificFollowersModel;
