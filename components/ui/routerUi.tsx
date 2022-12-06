import { useContext } from "react";
import Image from "next/image";

import RouterContext from "../../context/router-context";

import ToggleMode from "../../context/darkMode";

const RouterUi = () => {
    const modeCtx = useContext(ToggleMode);
    const routerCtx = useContext(RouterContext);

    const { mode } = modeCtx;
    const { showRouterComponent } = routerCtx;

    return (
        <div
            className={`${mode === "dark" ? "bg-smothDark" : "bg-gray-100"} ${
                !showRouterComponent && "hidden"
            } fixed top-0 left-0  w-full h-screen flex justify-center items-center `}
        >
            <div className="relative w-28 sm:w-40 h-28 sm:h-40">
                <Image
                    src={`/images/instagram-logo-router.png`}
                    alt="instagram-logo bg-red"
                    layout="fill"
                />
            </div>
        </div>
    );
};

export default RouterUi;
