import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import SuggestedPeopleModel from "./people";
import SpecificPostModel from "../models/specificPostModel";
import Likes from "../models/likes";
import PostSettingsModel from "../models/postSettingsModel";
import UnfollowModel from "../models/unfollowModel";

import ToggleMode from "../../context/darkMode";
import HideModel from "../../context/hideModels";
import ShowHideModels from "../../context/showHideModels-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import RouterContext from "../../context/router-context";

import { getPhotoSrcFun } from "../../helpers/getPhotoSrcFun";

import { SuggestedPersonInterface } from "../../interfaces/interfaces";
import { AllUsersInterface } from "../../interfaces/user-interfaces";
import { UserInterface } from "../../interfaces/user-interfaces";
import { PostsInterface } from "../../interfaces/posts-interfaces";
import { StoriesInterface } from "../../interfaces/stories-interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const SuggestedPeople = (
    props: AllUsersInterface & UserInterface & PostsInterface & StoriesInterface
): JSX.Element => {
    const { allUsers, currentUser, posts, stories } = props;
    const [showHideProfileModel, setShowHideProfileModel] = useState(true);

    const [suggesetionPeople, setSuggesetionPeople] = useState<
        SuggestedPersonInterface[]
    >([]);

    const router = useRouter();
    const { postId, removePost } = router.query;

    const modeCtx = useContext(ToggleMode);
    const hideModelCtx = useContext(HideModel);
    const CurrentUserFollowingCtx = useContext(CurrentUserFollowing);
    const routerCtx = useContext(RouterContext);
    const showHideModelsCtx = useContext(ShowHideModels);

    const { mode } = modeCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { showLikesModel, showPostSettingsModel } = showHideModelsCtx;
    const { following: followingCtx, unfollowingModel } =
        CurrentUserFollowingCtx;
    const {
        toggleShowHideAllModelsHandler,
        toggleProfileModel,
        toggleProfileModelHandler,
    } = hideModelCtx;

    // useeffect to check if people is your follwing or is you
    useEffect(() => {
        setSuggesetionPeople([]);
        let personExist: boolean = false;

        allUsers.forEach((person, index) => {
            personExist = false;
            followingCtx?.forEach((following) => {
                if (
                    person.userName === currentUser.userName ||
                    person.userName === following.userName
                ) {
                    personExist = true;
                    return;
                }
            });
            if (!personExist) {
                setSuggesetionPeople((prevState) => prevState.concat(person));
            }
        });
        setSuggesetionPeople((prevState) => prevState.slice(0, 30));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        toggleShowHideAllModelsHandler(showHideProfileModel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showHideProfileModel]);

    const hideModelHandler = () => {
        setShowHideProfileModel((prevState) => !prevState);
        toggleShowHideAllModelsHandler(showHideProfileModel);
        if (toggleProfileModel) {
            toggleProfileModelHandler(false);
        }
    };

    return (
        <div
            onClick={hideModelHandler}
            className={`${
                mode === "dark"
                    ? "bg-smothDark text-white"
                    : "bg-gray-100 text-smothDark"
            } min-h-screen`}
        >
            <div className="pt-14 sm:pt-32 container mx-auto">
                <div className="flex justify-center item-center">
                    <div className="w-full sm:w-[600px]">
                        <h2 className="ml-2 sm:ml-5 text-lg font-bold">
                            Suggested
                        </h2>
                        <div
                            className={`${
                                mode === "dark" ? "bg-dark" : "bg-gray-100"
                            } flex flex-col justify-start sm:rounded-lg p-2 sm:p-4 py-2 items-start space-y-2 sm:ml-1.5 sm:mr-3 mt-1 sm:mt-3`}
                        >
                            {suggesetionPeople.map(
                                (SuggestionPerson, index) =>
                                    SuggestionPerson.userName !==
                                        currentUser.userName && (
                                        <SuggestedPeopleModel
                                            key={SuggestionPerson.userName}
                                            userImg={
                                                SuggestionPerson.userImg ||
                                                getPhotoSrcFun(
                                                    SuggestionPerson.userName
                                                )
                                            }
                                            mode={mode}
                                            userName={SuggestionPerson.userName}
                                            fullName={SuggestionPerson.fullName}
                                            caption={SuggestionPerson.caption}
                                            email={SuggestionPerson.email}
                                            followers={
                                                SuggestionPerson.followers
                                            }
                                            following={
                                                SuggestionPerson.following
                                            }
                                            search={SuggestionPerson.search}
                                            timestamp={
                                                SuggestionPerson.timestamp
                                            }
                                            currentUser={currentUser}
                                            allUsers={allUsers}
                                            posts={posts}
                                            index={index}
                                            suggestedPeople={suggesetionPeople}
                                            stories={stories}
                                        />
                                    )
                            )}
                            {suggesetionPeople.length === 0 && (
                                <div className="flex justify-center items-center w-full h-full">
                                    <h2
                                        className={`${
                                            mode === "dark"
                                                ? "text-white/50"
                                                : "text-dark/50"
                                        } font-semibold text-lg sm:text-xl`}
                                    >
                                        No suggested people
                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* specific post */}
                    <AnimatePresence>
                        {(postId ||
                            showLikesModel.state ||
                            removePost ||
                            unfollowingModel.showUnfollowingModel) && (
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
                                {postId && (
                                    <SpecificPostModel
                                        posts={posts}
                                        currentUser={currentUser}
                                        allUsers={allUsers}
                                        stories={stories}
                                    />
                                )}
                                {showLikesModel.state && !postId && (
                                    <Likes
                                        mode={mode}
                                        posts={posts}
                                        currentUser={currentUser}
                                        stories={stories}
                                    />
                                )}
                                {unfollowingModel.showUnfollowingModel && (
                                    <UnfollowModel
                                        mode={mode}
                                        userName={unfollowingModel.userName}
                                        userImg={
                                            unfollowingModel.userImg ||
                                            getPhotoSrcFun(
                                                unfollowingModel.userName
                                            )
                                        }
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* seting to specific post to fade in when click in 3 dots */}
                    <AnimatePresence>
                        {postId && showPostSettingsModel.id && (
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
                                {showPostSettingsModel.id &&
                                    postId &&
                                    posts.map(
                                        (post) =>
                                            showPostSettingsModel.id ===
                                                post.id && (
                                                <PostSettingsModel
                                                    key={post.id}
                                                    caption={post.caption}
                                                    comments={post.comments}
                                                    id={post.id}
                                                    img={post.img}
                                                    likes={post.likes}
                                                    userName={post.userName}
                                                    userImg={
                                                        post.userImg ||
                                                        getPhotoSrcFun(
                                                            post.userName
                                                        )
                                                    }
                                                    timestamp={post.timestamp}
                                                    fullName={post.fullName}
                                                    saves={post.saves}
                                                    currentUser={currentUser}
                                                />
                                            )
                                    )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* unfollowing model */}
            </div>
            <div className="h-9 sm:h-5"></div>
        </div>
    );
};

export default SuggestedPeople;
