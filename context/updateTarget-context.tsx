import { createContext, useState } from "react";

import { Props, DeleteSpecificPost } from "../interfaces/context-interfaces";

const initailAllPostsState: boolean = false;
const initailAllStoriesState: boolean = false;

const initailState: DeleteSpecificPost = {
    id: "",
    state: false,
};
const initailDeletedPost: DeleteSpecificPost = {
    id: "",
    state: false,
};
const initailCurrentUserState: boolean = false;

const UpdateTarget = createContext({
    // posts
    updatePosts: initailDeletedPost,
    updatePostsHandler: (state: boolean, id: string): void => {},

    // stories
    updateStories: initailAllStoriesState,
    updateStoriesHandler: (state: boolean): void => {},

    // delete post
    deletedPost: initailDeletedPost,
    deleteSpecficPostHandler: (state: boolean, id: any): void => {},

    updateAllPosts: initailAllPostsState,
    setAllpostsState: (state: boolean): void => {},

    updateCurrentUser: initailCurrentUserState,
    setCurrentUserState: (state: boolean): void => {},
});

export const UpdateTargetProvider = (props: Props): JSX.Element => {
    const { children } = props;

    const [updateAllPosts, setUpdateAllPosts] =
        useState<boolean>(initailAllPostsState);

    const [updatePosts, setUpdatePosts] =
        useState<DeleteSpecificPost>(initailState);

    const [updateStories, setUpdateStories] = useState<boolean>(
        initailAllStoriesState
    );

    const [deletedPost, setDeletedPost] =
        useState<DeleteSpecificPost>(initailDeletedPost);

    const [updateCurrentUser, setUpdateCurrentUser] = useState<boolean>(
        initailCurrentUserState
    );

    const setAllpostsState = (state: boolean) => {
        setUpdateAllPosts(state);
    };

    const updateStoriesHandler = (state: boolean) => {
        setUpdateStories(state);
    };

    const updatePostsHandler = (state: boolean, id: string) => {
        setUpdatePosts({ id, state });
    };

    const deleteSpecficPostHandler = (state: boolean, id: any) => {
        setDeletedPost({ id, state });
    };

    const setCurrentUserState = (state: boolean) => {
        setUpdateCurrentUser(state);
    };

    const data = {
        updateAllPosts,
        setAllpostsState,

        // stories
        updateStories,
        updateStoriesHandler,

        updatePosts,
        updatePostsHandler,

        // delete post
        deletedPost,
        deleteSpecficPostHandler,

        // update current user Data
        updateCurrentUser,
        setCurrentUserState,
    };
    return (
        <UpdateTarget.Provider value={data}>{children}</UpdateTarget.Provider>
    );
};

export default UpdateTarget;
