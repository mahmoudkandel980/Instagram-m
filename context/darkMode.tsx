import { createContext, useEffect, useState } from "react";

import { Props } from "../interfaces/context-interfaces";

const initailMode: string = "";

const ToggleMode = createContext({
    mode: initailMode,
    toggleMode: (modeType: string): void => {},
});

export const ToggleModeProvider = (props: Props): JSX.Element => {
    const { children } = props;
    const [mode, setMode] = useState<string>(initailMode);

    useEffect(() => {
        setMode(localStorage.getItem("mode") || "");
        if (
            localStorage.getItem("mode") === "dark" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setMode("dark");
            localStorage.setItem("mode", "dark");
        } else {
            setMode("light");
            localStorage.setItem("mode", "light");
        }
    }, []);

    const toggleMode = (modeType: string) => {
        setMode(modeType);
        localStorage.setItem("mode", modeType);
    };

    const data = {
        mode,
        toggleMode,
    };
    return <ToggleMode.Provider value={data}>{children}</ToggleMode.Provider>;
};

export default ToggleMode;
