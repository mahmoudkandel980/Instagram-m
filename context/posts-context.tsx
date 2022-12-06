import { createContext, useEffect, useState } from "react";

import { Props } from "../interfaces/context-interfaces";
import { PostInterface } from "../interfaces/posts-interfaces";
import {
    PostsCommentsInterface,
    PostLikeInterface,
    PostSaveInterface,
} from "../interfaces/context-interfaces";

const initailValue: string = "",
    initialId: any = "",
    initialPostLiked: PostLikeInterface = { likeCtx: false, id: "" },
    initailPostSaved: PostSaveInterface = { saveCtx: false, id: "" };

const initialpostsComments: PostsCommentsInterface[] = [
    { commentValue: "", id: "" },
];

const initailPosts: PostInterface[] = [
    {
        id: "",
        fullName: "",
        userName: "",
        userImg: "",
        img: "",
        caption: "",
        timestamp: { seconds: 0, nanoseconds: 0 },
        likes:
            [
                {
                    fullName: "",
                    userName: "",
                    userImg: "",
                },
            ] || [],
        saves:
            [
                {
                    fullName: "",
                    userName: "",
                    userImg: "",
                },
            ] || [],
        comments:
            [
                {
                    id: "",
                    fullName: "",
                    userName: "",
                    userImg: "",
                    comment: "",
                    timestamp: {
                        seconds: 0,
                        nanoseconds: 0,
                    },
                    likes:
                        [
                            {
                                fullName: "",
                                userName: "",
                                userImg: "",
                            },
                        ] || [],
                    replys: [
                        {
                            commentId: "",
                            replyId: "",
                            fullName: "",
                            userName: "",
                            userImg: "",
                            reply: "",
                            replyTo: "",
                            timestamp: {
                                seconds: 0,
                                nanoseconds: 0,
                            },
                            likes:
                                [
                                    {
                                        fullName: "",
                                        userName: "",
                                        userImg: "",
                                    },
                                ] || [],
                        },
                    ],
                },
            ] || [],
    },
];

const PostsContext = createContext({
    // posts Comments
    commentValue: initailValue,
    id: initialId,
    postsComments: initialpostsComments,
    setCommentValueHandler: (commentVal: string, id: any) => {},

    // use it when in home page to render the changes from SpecificPostmodel to Original post in UI
    liked: initialPostLiked,
    setLikeToPost: (like: boolean, id: any) => {},
    saved: initailPostSaved,
    setSavedToPost: (saved: boolean, id: any) => {},

    // original post
    postsDataCtx: initailPosts,
    getInitailPostsHandler: (posts: PostInterface[]): void => {},
});

export const PostsContextProvider = (props: Props): JSX.Element => {
    const { children } = props;

    const [postsComments, setPostsComments] =
        useState<PostsCommentsInterface[]>(initialpostsComments);
    const [idExist, setIdExist] = useState(true);
    const [id, setId] = useState<any>(initailValue);
    const [commentValue, setCommentValue] = useState<string>(initailValue);

    const [liked, setIsLiked] = useState<PostLikeInterface>(initialPostLiked);
    const [saved, setIsSaved] = useState<PostSaveInterface>(initailPostSaved);

    const [postsDataCtx, setPostsDataCtx] =
        useState<PostInterface[]>(initailPosts);

    // render comments for each post when value changes
    useEffect(() => {
        if (idExist) {
            postsComments.forEach(
                (comment, index) =>
                    comment.id === id.toString() &&
                    postsComments.splice(index, 1, {
                        commentValue,
                        id,
                    })
            );
        } else {
            postsComments.push({ commentValue, id });
        }
        setIdExist(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentValue, id]);

    // check if post of comment is exist in array
    const setCommentValueHandler = (commentVal: string, id: any) => {
        postsComments.forEach((comment, index) => {
            if (comment.id == id?.toString()) {
                setIdExist(true);
                return;
            }
        });

        setId(id);
        setCommentValue(commentVal);
    };

    // render like from model to original post
    const setLikeToPost = (like: boolean, id: any) => {
        setIsLiked({ likeCtx: like, id: id });
    };

    // render save from model to original post
    const setSavedToPost = (save: boolean, id: any) => {
        setIsSaved({ saveCtx: save, id: id });
    };

    // render all posts
    const getInitailPostsHandler = (posts: PostInterface[]) => {
        let postsArray = [...posts];
        setPostsDataCtx([...postsArray]);
    };

    const data = {
        // posts Comments
        commentValue,
        id,
        postsComments,
        setCommentValueHandler,

        // use it when in home page to render the changes from SpecificPostmodel to Original post in UI
        liked,
        setLikeToPost,
        saved,
        setSavedToPost,

        // original post
        postsDataCtx,
        getInitailPostsHandler,
    };
    return (
        <PostsContext.Provider value={data}>{children}</PostsContext.Provider>
    );
};

export default PostsContext;
