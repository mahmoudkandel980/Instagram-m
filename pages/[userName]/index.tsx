import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
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

import Followers from "../../components/models/followers";
import Following from "../../components/models/following";

import SpecificUserData from "../../components/specificUser/specificUserData";

import ToggleMode from "../../context/darkMode";
import CurrentUserFollowing from "../../context/currentUserFollowing";
import RouterContext from "../../context/router-context";
import UpdateTarget from "../../context/updateTarget-context";
import UserContext from "../../context/user-context";

import { UserNameInterface } from "../../interfaces/specificUser-interface";
import { PostInterface } from "../../interfaces/posts-interfaces";
import { StoryInterface } from "../../interfaces/stories-interfaces";
import { SingleUserInterface } from "../../interfaces/user-interfaces";
import {
    FollowerInterface,
    SingleFollowingInterface,
} from "../../interfaces/interfaces";

const isSSR = typeof window === "undefined";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const UserOfUsers = (props: UserNameInterface) => {
    const [isSSR, setIsSSR] = useState(true);
    const [targetUser, setTargetUser] = useState<SingleUserInterface>();

    // to get user full name to page title
    const [pageUserFullName, setPageUserFullName] = useState<string>("");

    // firebase
    const [firebasePosts, setFirebasePosts] = useState<PostInterface[]>();
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const router = useRouter();
    const { pop, userName, postId } = router.query;

    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);
    const updateTargetCtx = useContext(UpdateTarget);
    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const userCtx = useContext(UserContext);

    const { showRouterComponentHandler } = routerCtx;
    const { mode } = modeCtx;
    const { addAllFollowings } = currentUserFollowingCtx;
    const { setUserDataHandler, setUsersHandler } = userCtx;

    const {
        updatePosts,
        // updatePostsHandler,
        deleteSpecficPostHandler,
        deletedPost,
        updateCurrentUser,
    } = updateTargetCtx;

    useEffect(() => {
        showRouterComponentHandler(true);
        setTimeout(() => {
            setIsSSR(false);
        }, 300);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        firebaseAllUsers?.forEach((user) => {
            if (user.userName === userName) {
                setTargetUser(user);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName, firebaseAllUsers]);

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

    // update current user
    useEffect(() => {
        const fetchCurrentUserData = async () => {
            try {
                const currentUserRef = doc(
                    db,
                    "allUsers",
                    auth.currentUser?.displayName!
                );
                // @ts-ignore
                const currentUserSnap = await getDoc(currentUserRef);

                // @ts-ignore
                setFirebaseCurrentUser(currentUserSnap.data());
            } catch (error) {
                console.log(error);
            }
        };

        if (updateCurrentUser) {
            fetchCurrentUserData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCurrentUser]);

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

    // when update current user from firebase update it
    useEffect(() => {
        setUserDataHandler(firebaseCurrentUser!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseCurrentUser?.search]);

    // to get page fullname of user
    useEffect(() => {
        firebaseAllUsers?.forEach((user) => {
            if (user.userName === `${userName}`) {
                setPageUserFullName(user.fullName);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseAllUsers]);

    if (!targetUser) {
        return (
            <>
                <Head>
                    <title>
                        {pageUserFullName} (@
                        {userName}) • Instagram photos and videos
                    </title>
                    <meta
                        name="description"
                        content={"instagram profile page"}
                    />
                </Head>
                <div
                    className={`${
                        mode === "dark" ? "bg-smothDark" : "bg-gray-100"
                    }  fixed top-0 left-0  w-full h-screen flex justify-center items-center `}
                >
                    <div className="relative w-28 sm:w-40 h-28 sm:h-40">
                        <Image
                            src={`/images/instagram-logo-router.png`}
                            alt="instagram-logo bg-red"
                            layout="fill"
                        />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div>
            {!isSSR &&
                firebaseCurrentUser?.search &&
                firebasePosts &&
                firebaseAllUsers &&
                firebaseStories && (
                    <div>
                        <Head>
                            <title>
                                {pageUserFullName} (@
                                {userName}) • Instagram photos and videos
                            </title>
                            <meta
                                name="description"
                                content={"instagram profile page"}
                            />
                        </Head>
                        <SpecificUserData
                            posts={firebasePosts}
                            currentUser={firebaseCurrentUser}
                            user={targetUser}
                            allUsers={firebaseAllUsers}
                            stories={firebaseStories}
                        />
                        <AnimatePresence>
                            {(pop === "followers" || pop === "following") && (
                                <motion.div
                                    className="top-0 z-[100] left-0 fixed w-full h-full"
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
                                            followers={targetUser.followers}
                                            currentUser={firebaseCurrentUser}
                                            stories={firebaseStories}
                                        />
                                    )}
                                    {pop === "following" && (
                                        <Following
                                            mode={mode}
                                            following={targetUser.following}
                                            currentUser={firebaseCurrentUser}
                                            stories={firebaseStories}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
        </div>
    );
};

export default UserOfUsers;
