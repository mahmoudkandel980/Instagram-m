import { useContext } from "react";
import Image from "next/image";

import ToggleMode from "../../../context/darkMode";

import { BsCamera } from "react-icons/bs";

const Tagged = () => {
    const taggedPosts: any[] = [];

    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;

    return (
        <div className="flex justify-center items-center">
            {taggedPosts?.length === 0 ||
            taggedPosts === null ||
            taggedPosts === undefined ? (
                <div className="flex flex-col justify-center items-center pt-7 xl:pt-20">
                    <div className="font-thin text-xs">
                        <div className="border-[2px] p-3 lg:p-4 rounded-full">
                            <BsCamera
                                className={`${
                                    mode === "dark"
                                        ? "text-white/80"
                                        : "text-darkGray/70 "
                                } h-9 w-9 sm:w-12 sm:h-12 lg:h-14 lg:w-14 xl:w-16 xl:h-16`}
                            />
                        </div>
                    </div>
                    <h1 className="text-xl font-[100] sm:text-2xl sm:font-[300] mt-4">
                        Photos of you
                    </h1>
                    <p className="mt-3 font-[100] sm:font-normal text-center">
                        when people tag you in photos, they will appear hear.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 justify-center items-center gap-0.5 sm:gap-1 gap-y-0.5 sm:gap-y-1 w-full mt-3 sm:mt-5">
                    {taggedPosts.map((post, index) => (
                        <div
                            key={index}
                            className="relative w-full h-40 sm:h-52 md:h-56 lg:h-64 xl:h-72 2xl:h-80 cursor-pointer"
                        >
                            <Image
                                src={post.img}
                                alt={post.username}
                                layout="fill"
                                className="object-fill"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tagged;
