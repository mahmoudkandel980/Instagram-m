/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";

import CurrentImage from "./currentImage";
import OtherImages from "./otherImages";

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
    const { name } = router.query;

    return (
        <div className={` h-full w-full z-10 relative`}>
            <div className="flex justify-center items-center w-full h-full relative cursor-pointer">
                {index === 0 || index === length - 1 ? (
                    <></>
                ) : (
                    <div
                        className={`${
                            userName === name
                                ? "w-full lg:w-[95%] xl:w-[85%]"
                                : "sm:scale-y-[0.65] lg:scale-y-[0.6] xl:scale-y-[0.5] 2xl:scale-y-[0.5] sm:scale-x-[0.75] lg:scale-x-[0.7] xl:scale-x-[0.5] 2xl:scale-x-[0.5] w-full"
                        } flex justify-center h-[100%] sm:h-[60%] lg:h-[75%] xl:h-[85%] 2xl:h-[90%]  items-center relative duration-1000`}
                    >
                        {userName === name ? (
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
                        ) : (
                            <OtherImages
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
                )}
            </div>
        </div>
    );
};

export default Story;
