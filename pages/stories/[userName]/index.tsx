import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { auth, db } from "../../../firebase.config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import SpecificUserStories from "../../../components/stories/specificUserStory/specificUserStories";

import CurrentUserFollowing from "../../../context/currentUserFollowing";
import RouterContext from "../../../context/router-context";

import { StoryInterface } from "../../../interfaces/stories-interfaces";
import { SingleUserInterface } from "../../../interfaces/user-interfaces";

const isSSR = typeof window === "undefined";

const SpecificPersonStory = () => {
    const [isSSR, setIsSSR] = useState(true);
    const [userStories, setUserStories] = useState<StoryInterface[]>();

    // firebase
    const [firebaseCurrentUser, setFirebaseCurrentUser] =
        useState<SingleUserInterface>();
    const [firebaseStories, setFirebaseStories] = useState<StoryInterface[]>();

    const router = useRouter();
    const { userName } = router.query;

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

    useEffect(() => {
        firebaseStories?.forEach((story) => {
            if (story.userName === userName) {
                setUserStories([story]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName, firebaseStories]);

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
                {!isSSR && userStories && firebaseCurrentUser && (
                    <SpecificUserStories
                        currentUser={firebaseCurrentUser}
                        stories={userStories}
                    />
                )}
            </div>
        </>
    );
};

export default SpecificPersonStory;
