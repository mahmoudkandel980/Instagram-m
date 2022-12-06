import { motion, AnimatePresence } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { auth, db } from "../../firebase.config";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";

import ProfileData from "../../components/profile/profileData";
import Followers from "../../components/models/followers";
import Following from "../../components/models/following";
import ToggleMode from "../../context/darkMode";
import UserContext from "../../context/user-context";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import RouterContext from "../../context/router-context";
import UpdateTarget from "../../context/updateTarget-context";

const isSSR = typeof window === "undefined";

import { PostInterface } from "../../interfaces/posts-interfaces";
import { StoryInterface } from "../../interfaces/stories-interfaces";
import { SingleUserInterface } from "../../interfaces/user-interfaces";
import {
    FollowerInterface,
    SingleFollowingInterface,
} from "../../interfaces/interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const Profile = (props: any) => {
    const [isSSR, setIsSSR] = useState(true);

    const [followers, setFollowers] = useState<FollowerInterface[]>([]);
    const [following, setFollowing] = useState<SingleFollowingInterface[]>([]);

    // firebase
    const [firebasePosts, setFirebasePosts] = useState<PostInterface[]>();
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const router = useRouter();
    const { pop, postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const userCtx = useContext(UserContext);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const routerCtx = useContext(RouterContext);
    const updateTargetCtx = useContext(UpdateTarget);

    const { mode } = modeCtx;
    const { setUserDataHandler, setUsersHandler } = userCtx;
    const { addAllFollowings, addAllfollowers } = currentUserFollowingCtx;
    const { showRouterComponentHandler } = routerCtx;
    const {
        updatePosts,
        // updatePostsHandler,
        deleteSpecficPostHandler,
        deletedPost,
        setAllpostsState,
        updateAllPosts,
        updateCurrentUser,
    } = updateTargetCtx;

    useEffect(() => {
        showRouterComponentHandler(true);
        setUserDataHandler(firebaseCurrentUser!);
        setUsersHandler(firebaseAllUsers!);
        setTimeout(() => {
            setIsSSR(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseAllUsers, firebaseCurrentUser]);

    // upload following of current user
    useEffect(() => {
        addAllFollowings(firebaseCurrentUser?.following!);
        addAllfollowers(firebaseCurrentUser?.followers!);
        setFollowers(firebaseCurrentUser?.followers!);
        setFollowing(firebaseCurrentUser?.following!);
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
                followers &&
                following &&
                firebaseCurrentUser &&
                firebasePosts &&
                firebaseAllUsers &&
                firebaseStories && (
                    <>
                        <Head>
                            <title>
                                {firebaseCurrentUser.fullName} (@
                                {firebaseCurrentUser.userName}) • Instagram
                                photos and videos
                            </title>
                            <meta
                                name="description"
                                content={"instagram profile page"}
                            />
                        </Head>
                        <div>
                            <ProfileData
                                currentUser={firebaseCurrentUser}
                                posts={firebasePosts}
                                allUsers={firebaseAllUsers}
                                stories={firebaseStories}
                            />
                            <AnimatePresence>
                                {(pop === "followers" ||
                                    pop === "following") && (
                                    <motion.div
                                        className="top-0 left-0 fixed w-full h-full"
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
                                        {pop === "followers" && (
                                            <Followers
                                                mode={mode}
                                                followers={followers}
                                                currentUser={
                                                    firebaseCurrentUser
                                                }
                                                stories={firebaseStories}
                                            />
                                        )}
                                        {pop === "following" && (
                                            <Following
                                                mode={mode}
                                                following={following}
                                                currentUser={
                                                    firebaseCurrentUser
                                                }
                                                stories={firebaseStories}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
        </div>
    );
};

export default Profile;
