import { useContext, useState, useEffect } from "react";

import SpecificPostCommentReplyData from "../../../context/specificPostCommentReplyData-context";

import Comments from "./comments";
import Spinner from "../../ui/spinner";

import { PostCommentReplyDataInterface } from "../../../interfaces/context-interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { PostsInterface } from "../../../interfaces/posts-interfaces";
import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import {
    UserInterface,
    AllUsersInterface,
} from "../../../interfaces/user-interfaces";

const SpecificPostComments = (
    props: ModeInterFace &
        UserInterface &
        AllUsersInterface &
        PostsInterface &
        StoriesInterface
) => {
    const { mode, currentUser, allUsers, posts, stories } = props;

    const [loading, setLoading] = useState(true);

    const SpecificPostCommentReplyDataCtx = useContext(
        SpecificPostCommentReplyData
    );
    const { comments } = SpecificPostCommentReplyDataCtx;
    const [modifiedComments, setModifiedCommnets] = useState<
        PostCommentReplyDataInterface[]
    >([]);

    useEffect(() => {
        const commentsModification: PostCommentReplyDataInterface[] = comments;
        commentsModification.sort(
            (a, b) => a.timestamp.seconds - b.timestamp.seconds
        );

        setModifiedCommnets(commentsModification);
    }, [comments]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 pb-16 h-full sm:pb-5 w-full">
                <div className="flex justify-center items-center w-full h-full">
                    <Spinner className="scale-50  w-8 h-5" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-16 h-full sm:pb-5">
            {comments &&
                comments.map((comment, index) => (
                    <div
                        key={`${comment.timestamp} ${comment.comment} ${index}`}
                    >
                        {/* comments */}
                        <Comments
                            mode={mode}
                            id={comment.id}
                            userImg={comment.userImg}
                            userName={comment.userName}
                            timestamp={comment.timestamp}
                            likes={comment.likes}
                            replyTo={null}
                            currentUser={currentUser}
                            comment={comment}
                            allUsers={allUsers}
                            posts={posts}
                            stories={stories}
                        />
                    </div>
                ))}
        </div>
    );
};

export default SpecificPostComments;
