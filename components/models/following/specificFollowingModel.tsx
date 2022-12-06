import { useContext, useState, useEffect } from "react";

import RemoveFollwersUnfollowingModel from "../../../context/removeFollwersUnfollowingModel-context";
import RouterContext from "../../../context/router-context";

import SpecificSingleFollowing from "./specificSingleFollowing";

import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    ModeInterFace,
    FollowingInterface,
    FollowingModelInterface,
    HideModelHandler,
} from "../../../interfaces/interfaces";

const SpecificFollowingModel = (
    props: ModeInterFace &
        FollowingInterface &
        HideModelHandler &
        UserInterface &
        StoriesInterface
) => {
    const { mode, following, hideModelHandler, currentUser, stories } = props;

    const [storyClicked, setStoryClicked] = useState(false);
    const [unfollowPerson, setUnfollowPerson] =
        useState<FollowingModelInterface>();
    const [modifiedFollowing, setModifiedFollowing] = useState<
        FollowingModelInterface[]
    >([]);

    const routerCtx = useContext(RouterContext);
    const RemoveFollwersUnfollowingModelCtx = useContext(
        RemoveFollwersUnfollowingModel
    );

    const { showRouterComponentHandler } = routerCtx;
    const { toggleShowUnfollowModel } = RemoveFollwersUnfollowingModelCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    useEffect(() => {
        setModifiedFollowing([]);
        let personExist: boolean = false;

        // get Current user  in first if exist
        following?.forEach((singleFollowing) => {
            if (singleFollowing.userName === currentUser.userName) {
                setModifiedFollowing((prevState) =>
                    prevState.concat({
                        ...singleFollowing,
                        followState: "user",
                    })
                );
                return;
            }
        });

        following?.forEach((singleFollowing, index) => {
            personExist = false;
            currentUser.following.forEach((following) => {
                if (singleFollowing.userName === following.userName) {
                    personExist = true;
                    return;
                }
            });
            if (singleFollowing.userName !== currentUser.userName) {
                if (personExist) {
                    setModifiedFollowing((prevState) =>
                        prevState.concat({
                            ...singleFollowing,
                            followState: "following",
                        })
                    );
                } else {
                    setModifiedFollowing((prevState) =>
                        prevState.concat({
                            ...singleFollowing,
                            followState: "follow",
                        })
                    );
                }
            }
        });
    }, [following, currentUser.userName, currentUser.following]);

    return (
        <div>
            {modifiedFollowing.length > 0 &&
                modifiedFollowing.map((following, index) => (
                    <SpecificSingleFollowing
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

export default SpecificFollowingModel;
