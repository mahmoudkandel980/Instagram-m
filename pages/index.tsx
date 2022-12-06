import { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import { auth, db } from "../firebase.config";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";

import Head from "next/head";
import Feed from "../components/home/feed";

import UserContext from "../context/user-context";
import CurrentUserFollowing from "../context/currentUserFollowing";
import RouterContext from "../context/router-context";
import UpdateTarget from "../context/updateTarget-context";
import PostsContext from "../context/posts-context";

import { PostInterface } from "../interfaces/posts-interfaces";
import { StoryInterface } from "../interfaces/stories-interfaces";
import { SingleUserInterface } from "../interfaces/user-interfaces";

const isSSR = typeof window === "undefined";

const Home: NextPage = () => {
    const [isSSR, setIsSSR] = useState(true);

    // firebase
    const [firebasePosts, setFirebasePosts] = useState<PostInterface[]>();
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const [userCredential, setUserCredential] = useState({});
    const [formData, setFormData] = useState({
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
    });

    const { name, email } = formData;

    const router = useRouter();
    const { postId } = router.query;

    const userCtx = useContext(UserContext);
    const updateTargetCtx = useContext(UpdateTarget);
    const routerCtx = useContext(RouterContext);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const postsCtx = useContext(PostsContext);

    const {
        updatePosts,
        // updatePostsHandler,
        deleteSpecficPostHandler,
        deletedPost,
        setAllpostsState,
        updateAllPosts,
        setCurrentUserState,
        updateCurrentUser,
        updateStories,
        updateStoriesHandler,
    } = updateTargetCtx;
    const { showRouterComponentHandler } = routerCtx;
    const { setUserDataHandler, setUsersHandler } = userCtx;
    const { addAllFollowings } = currentUserFollowingCtx;
    const { saved, liked } = postsCtx;

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

            setAllpostsState(false);
        };

        if (!firebasePosts || updateAllPosts) {
            fetchPostsData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebasePosts, updateAllPosts]);

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

    // update posts when like or save it
    useEffect(() => {
        const fetchPost = async () => {
            const postRef = doc(db, "posts", `${liked.id}`);
            const postSnap = await getDoc(postRef);

            const postsFirebaseRef: PostInterface[] = [];
            //@ts-ignore
            postsFirebaseRef.push({ id: postSnap.id, ...postSnap.data() });
            firebasePosts?.forEach((post, index) => {
                if (post.id === `${liked.id}`) {
                    firebasePosts.splice(index, 1, postsFirebaseRef[0]);
                    return;
                }
            });
        };

        if (liked.id) {
            fetchPost();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liked.likeCtx]);

    // update posts when save it
    useEffect(() => {
        const fetchPost = async () => {
            const postRef = doc(db, "posts", `${saved.id}`);
            const postSnap = await getDoc(postRef);

            const postsFirebaseRef: PostInterface[] = [];
            //@ts-ignore
            postsFirebaseRef.push({ id: postSnap.id, ...postSnap.data() });
            firebasePosts?.forEach((post, index) => {
                if (post.id === `${saved.id}`) {
                    firebasePosts.splice(index, 1, postsFirebaseRef[0]);
                    return;
                }
            });
        };

        if (saved.id) {
            fetchPost();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saved.saveCtx]);

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

            updateStoriesHandler(false);
        };

        if (!firebaseStories || updateStories) {
            fetchStoriesData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateStories, firebaseStories]);

    useEffect(() => {
        showRouterComponentHandler(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setUserDataHandler(firebaseCurrentUser!);
        setUsersHandler(firebaseAllUsers!);
        setUserCredential(auth.currentUser!);

        setTimeout(() => {
            setIsSSR(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseAllUsers, firebaseCurrentUser]);

    // upload following of current user
    useEffect(() => {
        if (firebaseCurrentUser?.following) {
            addAllFollowings(firebaseCurrentUser.following);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseCurrentUser]);

    return (
        <>
            <Head>
                <title>Instagram</title>
                <meta
                    name="description"
                    content="instagram home page where get following posts, your posts, suggestion and more "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                {!isSSR && (
                    <div>
                        {/* Feed*/}
                        {firebasePosts &&
                            firebaseStories &&
                            firebaseCurrentUser &&
                            firebaseAllUsers && (
                                <Feed
                                    posts={firebasePosts}
                                    stories={firebaseStories}
                                    currentUser={firebaseCurrentUser}
                                    allUsers={firebaseAllUsers}
                                />
                            )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
