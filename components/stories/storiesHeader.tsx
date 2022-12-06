import { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import RouterContext from "../../context/router-context";
import CurrentStory from "../../context/currentStory-context";

import { AiOutlineClose } from "react-icons/ai";

const StoriesHeader = () => {
    const router = useRouter();
    const { userName } = router.query;

    const routerCtx = useContext(RouterContext);
    const currentStoryCtx = useContext(CurrentStory);

    const { showRouterComponentHandler } = routerCtx;
    const { backPage } = currentStoryCtx;

    // routerModel
    const showRouterModelHandler = () => {
        showRouterComponentHandler(true);

        if (backPage) {
            router.push(backPage, undefined, { scroll: false });
        } else {
            router.push(`/`, undefined, { scroll: false });
        }
    };

    return (
        <div className="bg-transparent text-white w-full absolute z-10">
            <div className="flex justify-between items-center px-1 pl-0 py-1 sm:py-2.5">
                <div
                    className={`hidden sm:block w-36 h-10 relative cursor-pointer overflow-hidden`}
                >
                    <Image
                        onClick={showRouterModelHandler}
                        src={`/images/Instagram_logo.png`}
                        layout="fill"
                        className={`invert sepia contrast-200 saturate-200 hue-rotate-90 object-contain cursor-pointer`}
                        alt={"instagram_logo"}
                        priority
                    />
                </div>
                <div className="block ml-auto md:ml-0">
                    <span
                        className="userName cursor-pointer"
                        onClick={showRouterModelHandler}
                    >
                        <AiOutlineClose className="w-5 md:w-8 h-5 md:h-8" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StoriesHeader;
