/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";

import CurrentImage from "../story/currentImage";

import { getPhotoSrcFun } from "../../../helpers/getPhotoSrcFun";

import { StoryForStoryPageInterface } from "../../../interfaces/stories-interfaces";
import { IndexInterface } from "../../../interfaces/interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";
import { UserInterface } from "../../../interfaces/user-interfaces";

const Story = (
    props: StoryForStoryPageInterface &
        IndexInterface &
        ModeInterFace &
        UserInterface
) => {
    const {
        userName,
        fullName,
        imgs,
        userImg,
        timestamp,
        index,
        length,
        mode,
        currentUser,
    } = props;

    const router = useRouter();
    const { userName: userNameRouter } = router.query;

    if (!props) {
        return <></>;
    }

    return (
        <div className={` h-full w-full z-10 relative`}>
            <div className="flex justify-center items-center w-full h-full relative cursor-pointer">
                <div
                    className={`w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] flex justify-center h-[100%] sm:h-[95%] lg:h-[95%] xl:h-[98%] 2xl:h-[98%] items-center relative duration-1000`}
                >
                    {userName === userNameRouter && (
                        <CurrentImage
                            key={userName}
                            userName={userName}
                            fullName={fullName}
                            userImg={userImg || getPhotoSrcFun(userName)}
                            imgs={imgs}
                            timestamp={timestamp}
                            mode={mode}
                            currentUser={currentUser}
                        />
                    )}
                </div>
            </div>
            {/* zoz */}
        </div>
    );
};

export default Story;
