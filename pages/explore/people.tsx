import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { auth, db } from "../../firebase.config";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";

import SuggestedPeople from "../../components/explore/suggestedPeople";

import CurrentUserFollowing from "../../context/currentUserFollowing";
import RouterContext from "../../context/router-context";
import UpdateTarget from "../../context/updateTarget-context";

import { PostInterface } from "../../interfaces/posts-interfaces";
import { StoryInterface } from "../../interfaces/stories-interfaces";
import { SingleUserInterface } from "../../interfaces/user-interfaces";

const isSSR = typeof window === "undefined";

const People = () => {
    const [isSSR, setIsSSR] = useState(true);

    // firebase
    const [firebasePosts, setFirebasePosts] = useState<PostInterface[]>();
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const router = useRouter();
    const { postId } = router.query;

    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const routerCtx = useContext(RouterContext);
    const updateTargetCtx = useContext(UpdateTarget);

    const { addAllFollowings } = currentUserFollowingCtx;
    const { showRouterComponentHandler } = routerCtx;
    const {
        updatePosts,
        // updatePostsHandler,
        deleteSpecficPostHandler,
        deletedPost,
    } = updateTargetCtx;

    useEffect(() => {
        showRouterComponentHandler(true);
        setTimeout(() => {
            setIsSSR(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // upload following of current user
    useEffect(() => {
        addAllFollowings(firebaseCurrentUser?.following!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseCurrentUser]);

    // posts
    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                // posts
                const postsRef = collection(db, "posts");
                const postsQ = query(postsRef, orderBy("timestamp", "desc"));
                // @ts-ignore
                const postsQuerySnap = await getDocs(postsQ);

                const postsFirebaseRef: any[] = [];
                // @ts-ignore
                postsQuerySnap.forEach((doc) => {
                    return postsFirebaseRef.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });

                setFirebasePosts(postsFirebaseRef);
            } catch (error) {
                console.log(error);
            }
        };

        if (!firebasePosts) {
            fetchPostsData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebasePosts]);

    // update posts when delete post
    useEffect(() => {
        if (deletedPost.state) {
            setFirebasePosts((prevState) =>
                prevState?.filter((post) => post.id !== deletedPost.id)
            );
            deleteSpecficPostHandler(false, "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedPost.state]);

    // update posts when pop up postId
    useEffect(() => {
        const fetchPost = async () => {
            const postRef = doc(db, "posts", `${postId}`);
            const postSnap = await getDoc(postRef);

            const postsFirebaseRef: PostInterface[] = [];
            //@ts-ignore
            postsFirebaseRef.push({ id: postSnap.id, ...postSnap.data() });
            firebasePosts?.forEach((post, index) => {
                if (post.id === `${postId}`) {
                    firebasePosts.splice(index, 1, postsFirebaseRef[0]);
                    return;
                }
            });
        };

        if (postId) {
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    // update posts when update posts
    useEffect(() => {
        const fetchPost = async () => {
            const postRef = doc(db, "posts", `${postId}`);
            const postSnap = await getDoc(postRef);

            const postsFirebaseRef: PostInterface[] = [];
            //@ts-ignore
            postsFirebaseRef.push({ id: postSnap.id, ...postSnap.data() });
            firebasePosts?.forEach((post, index) => {
                if (post.id === `${postId}`) {
                    firebasePosts.splice(index, 1, postsFirebaseRef[0]);
                    return;
                }
            });

            // updatePostsHandler(false, "");
        };

        if (updatePosts.state) {
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePosts.state]);

    // allUsers current user
    useEffect(() => {
        const fetchAllUsersData = async () => {
            try {
                // allUsers current user
                const allUsersRef = collection(db, "allUsers");
                const allUsersQuerySnap = await getDocs(allUsersRef);

                const allUsersFirebaseRef: SingleUserInterface[] = [];
                // @ts-ignore
                allUsersQuerySnap.forEach((doc: any) => {
                    return allUsersFirebaseRef.push({
                        ...doc.data(),
                    });
                });

                // get current user
                allUsersFirebaseRef.forEach((user: SingleUserInterface) => {
                    if (
                        user.userName === auth.currentUser?.displayName ||
                        user.fullName === auth.currentUser?.displayName
                    ) {
                        setFirebaseCurrentUser(user);
                    }
                });

                setFirebaseAllUsers(allUsersFirebaseRef);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllUsersData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // stories
    useEffect(() => {
        const fetchStoriesData = async () => {
            try {
                // stories
                const storiesRef = collection(db, "stories");
                const storiesQ = query(
                    storiesRef,
                    orderBy("timestamp", "desc")
                );
                // @ts-ignore
                const storiesQuerySnap = await getDocs(storiesQ);

                const storiesFirebaseRef: any[] = [];
                // @ts-ignore
                storiesQuerySnap.forEach((doc) => {
                    return storiesFirebaseRef.push({
                        ...doc.data(),
                    });
                });
                setFirebaseStories(storiesFirebaseRef);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStoriesData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {!isSSR &&
                firebaseAllUsers &&
                firebaseCurrentUser &&
                firebasePosts &&
                firebaseStories && (
                    <>
                        <Head>
                            <title>Instagram</title>
                            <meta
                                name="description"
                                content={
                                    "explore page where find people to follow"
                                }
                            />
                        </Head>
                        <SuggestedPeople
                            allUsers={firebaseAllUsers}
                            currentUser={firebaseCurrentUser}
                            posts={firebasePosts}
                            stories={firebaseStories}
                        />
                    </>
                )}
        </div>
    );
};

export default People;
