import { useState, useContext, useEffect } from "react";

import RemoveFollwersUnfollowingModel from "../../../context/removeFollwersUnfollowingModel-context";
import RouterContext from "../../../context/router-context";

import ProfileSingleFollowers from "./profileSingleFollowers";

import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    ModeInterFace,
    FollowersInterface,
    FollowerInterface,
    HideModelHandler,
} from "../../../interfaces/interfaces";

const ProfileFollowersModel = (
    props: ModeInterFace &
        FollowersInterface &
        HideModelHandler &
        StoriesInterface &
        UserInterface
) => {
    const { mode, followers, hideModelHandler, stories, currentUser } = props;

    const [storyClicked, setStoryClicked] = useState(false);
    const [removeFollower, SetRemoveFollower] = useState<FollowerInterface>();
    const [showRemoveFollowerModel, setShowRemoveFollowerModel] =
        useState(false);

    const routerCtx = useContext(RouterContext);
    const RemoveFollwersUnfollowingModelCtx = useContext(
        RemoveFollwersUnfollowingModel
    );

    const { showRouterComponentHandler } = routerCtx;
    const { toggleShowRemoveFollwerModel } = RemoveFollwersUnfollowingModelCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    const showRouterCtxHandler = () => {
        setStoryClicked(true);
        showRouterComponentHandler(true);
    };

    const removeFollowerPersonHandler = (follower: FollowerInterface) => {
        SetRemoveFollower(follower);
        setShowRemoveFollowerModel(true);
        toggleShowRemoveFollwerModel(true);
    };

    const hideModel = () => {
        hideModelHandler();
    };

    const confirmRemoveFollowerHandler = (
        removeFollower: FollowerInterface
    ) => {
        // firebase

        hideModel();
    };

    return (
        <div className="z-[1]">
            {followers?.length !== 0 &&
                followers?.map((follower, index) => (
                    <ProfileSingleFollowers
                        key={`${follower}${index}`}
                        userName={follower.userName}
                        fullName={follower.fullName}
                        userImg={follower.userImg}
                        stories={stories}
                        mode={mode}
                        currentUser={currentUser}
                    />
                ))}
        </div>
    );
};

export default ProfileFollowersModel;
