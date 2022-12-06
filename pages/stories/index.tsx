import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";

import { auth, db } from "../../firebase.config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import Stories from "../../components/stories/stories";
import SmScreensStories from "../../components/stories/smScreensStories";

import CurrentUserFollowing from "../../context/currentUserFollowing";
import RouterContext from "../../context/router-context";

import { SingleUserInterface } from "../../interfaces/user-interfaces";
import { StoryInterface } from "../../interfaces/stories-interfaces";

const isSSR = typeof window === "undefined";

const StoriesPage = () => {
    const [isSSR, setIsSSR] = useState(true);

    // firebase
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const currentUserFollowingCtx = useContext(CurrentUserFollowing);
    const routerCtx = useContext(RouterContext);

    const { addAllFollowings } = currentUserFollowingCtx;
    const { showRouterComponentHandler } = routerCtx;

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

    // urrent user
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
        <>
            <Head>
                <title>Stories • Instagram</title>
                <meta name="description" content={"instagram profile page"} />
            </Head>
            <div className="w-screen h-screen">
                {!isSSR && (
                    <>
                        {window.innerWidth > 639
                            ? firebaseCurrentUser &&
                              firebaseStories && (
                                  <Stories
                                      currentUser={firebaseCurrentUser}
                                      stories={firebaseStories}
                                  />
                              )
                            : firebaseCurrentUser &&
                              firebaseStories && (
                                  <SmScreensStories
                                      currentUser={firebaseCurrentUser}
                                      stories={firebaseStories}
                                  />
                              )}
                    </>
                )}
            </div>
        </>
    );
};

export default StoriesPage;
