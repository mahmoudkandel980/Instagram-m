import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Post from "./post";

import ToggleMode from "../../../context/darkMode";
import RouterContext from "../../../context/router-context";
import PostsContext from "../../../context/posts-context";
import CurrentUserFollowing from "../../../context/currentUserFollowing";

import {
    PostsInterface,
    PostInterface,
} from "../../../interfaces/posts-interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const Posts = (
    props: PostsInterface & UserInterface & AllUsersInterface & StoriesInterface
): JSX.Element => {
    const { posts, currentUser, allUsers, stories } = props;
    const [commentValue, setCommentValue] = useState("");

    const router = useRouter();
    const aspath = router.asPath;
    const { postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const postsCtx = useContext(PostsContext);

    const { mode } = modeCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { following: followingCtx } = currentUserFollowingCtx;
    const {
        postsDataCtx,
        getInitailPostsHandler,
        commentValue: commentValueCTX,
    } = postsCtx;
    const [modifiedPosts, setModifiedPosts] = useState(postsDataCtx);

    useEffect(() => {
        setModifiedPosts(postsDataCtx);
    }, [postId, postsDataCtx]);

    // put posts in postsContext
    useEffect(
        () => {
            let postsArray: PostInterface[] = [];
            posts.forEach((post) => {
                if (post.userName === currentUser.userName) {
                    postsArray.push(post);
                }

                followingCtx.forEach((singleFollowing) => {
                    if (post.userName === singleFollowing.userName) {
                        postsArray.push(post);
                        return;
                    }
                    return;
                });
            });
            getInitailPostsHandler(postsArray);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [aspath, followingCtx, posts, currentUser, postId]
    );

    useEffect(() => {
        setCommentValue(commentValueCTX);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentValueCTX]);

    const showRouterModelHandler = () => {
        showRouterComponentHandler(true);
    };

    return (
        <div>
            <div>
                {postsDataCtx.length >= 1 &&
                    postsDataCtx.map((post, index) => (
                        <Post
                            key={`${post.id}${post.comments.length}${post.userName}11`}
                            caption={post.caption}
                            comments={post.comments}
                            timestamp={post.timestamp}
                            id={post.id}
                            img={post.img}
                            likes={post.likes}
                            fullName={post.fullName}
                            userName={post.userName}
                            userImg={post.userImg}
                            commentValue={commentValue}
                            saves={post.saves}
                            currentUser={currentUser}
                            posts={posts}
                            allUsers={allUsers}
                            stories={stories}
                        />
                    ))}
            </div>
            <div className="flex justify-center items-center pt-2">
                <Link href={`/explore/people`}>
                    <a className="py-1.5" onClick={showRouterModelHandler}>
                        <span
                            className={`${
                                mode === "dark"
                                    ? "bg-dark"
                                    : "bg-white border-[2px]"
                            } capitalize text-lightBlue cursor-pointer p-2 px-5 rounded-xl`}
                        >
                            follow people to get posts
                        </span>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Posts;
