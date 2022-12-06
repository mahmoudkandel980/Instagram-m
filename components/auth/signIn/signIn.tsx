import React, { useContext } from "react";
import LeftSide from "./leftSide";
import RightSide from "./rightSide";

import ToggleMode from "../../../context/darkMode";

const SignIn = () => {
    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;
    return (
        <div className="sm:pt-28 flex justify-center items-center h-full w-full">
            <div className="flex justify-start items-center md:space-x-4  xl:space-x-8 h-full w-full">
                <LeftSide
                    mode={mode}
                    className="flex-1 hidden md:flex justify-end items-center h-full w-full"
                />
                <RightSide
                    mode={mode}
                    className="flex justify-center md:justify-start md:flex-1 h-full w-full "
                />
            </div>
        </div>
    );
};

export default SignIn;
