import ProfileSingleFollowing from "./profileSingleFollowing";

import { StoriesInterface } from "../../../interfaces/stories-interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";
import {
    ModeInterFace,
    FollowingInterface,
    HideModelHandler,
} from "../../../interfaces/interfaces";

const ProfileFollowingModel = (
    props: ModeInterFace &
        FollowingInterface &
        HideModelHandler &
        StoriesInterface &
        UserInterface
) => {
    const { mode, following, stories, currentUser } = props;

    return (
        <div>
            {following?.length !== 0 &&
                following?.map((specificFollowing, index) => (
                    <ProfileSingleFollowing
                        key={`${specificFollowing.userName} ${index}`}
                        userName={specificFollowing.userName}
                        fullName={specificFollowing.fullName}
                        userImg={specificFollowing.userImg}
                        stories={stories}
                        mode={mode}
                        currentUser={currentUser}
                    />
                ))}
        </div>
    );
};

export default ProfileFollowingModel;
