import { useState, useEffect, useContext } from "react";

import CurrentUserFollowing from "../../../context/currentUserFollowing";

import SingleSpecificLike from "./singleSpecificLike";

import { UserInterface } from "../../../interfaces/user-interfaces";
import { LikesModelInterface } from "../../../interfaces/interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import {
    ModeInterFace,
    LikesInterface,
    HideModelHandler,
} from "../../../interfaces/interfaces";

const LikesModel = (
    props: ModeInterFace &
        LikesInterface &
        UserInterface &
        HideModelHandler &
        StoriesInterface
) => {
    const { mode, likes, currentUser, hideModelHandler, stories } = props;

    const [storyClicked, setStoryClicked] = useState(false);
    const [modifiedLikes, setModifiedLikes] = useState<LikesModelInterface[]>(
        []
    );

    const currentUserFollowingCtx = useContext(CurrentUserFollowing);

    const { following: followingCtx } = currentUserFollowingCtx;

    // remove animatin of story
    useEffect(() => {
        const timer = setTimeout(() => {
            setStoryClicked(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [storyClicked]);

    // CHECK iN LIKES HAS FOLLOWING or
    useEffect(() => {
        setModifiedLikes([]);
        let personExist: boolean = false;

        // get Current user  in first if exist
        likes?.forEach((like) => {
            if (like.userName === currentUser.userName) {
                setModifiedLikes((prevState) =>
                    prevState.concat({ ...like, followState: "user" })
                );
                return;
            }
        });

        likes?.forEach((like, index) => {
            personExist = false;
            followingCtx.forEach((following) => {
                if (like.userName === following.userName) {
                    personExist = true;
                    return;
                }
            });
            if (like.userName !== currentUser.userName) {
                if (personExist) {
                    setModifiedLikes((prevState) =>
                        prevState.concat({ ...like, followState: "following" })
                    );
                } else {
                    setModifiedLikes((prevState) =>
                        prevState.concat({ ...like, followState: "follow" })
                    );
                }
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likes, currentUser.userName, followingCtx]);

    return (
        <div>
            {modifiedLikes?.length !== 0 &&
                modifiedLikes?.map((like, index) => (
                    <SingleSpecificLike
                        key={like.userName}
                        userName={like.userName}
                        fullName={like.fullName}
                        userImg={like.userImg}
                        followState={like.followState}
                        currentUser={currentUser}
                        stories={stories}
                        mode={mode}
                    />
                ))}
        </div>
    );
};

export default LikesModel;
