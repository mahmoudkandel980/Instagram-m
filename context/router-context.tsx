import { createContext, useState, useEffect } from "react";

import { Props } from "../interfaces/context-interfaces";

const RouterContext = createContext({
    showRouterComponent: true,
    showRouterComponentHandler: (type: boolean): void => {},
});

export const RouterContextProvider = (props: Props): JSX.Element => {
    const { children } = props;
    const [showRouterComponent, setShowRouterComponent] =
        useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRouterComponent(false);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [showRouterComponent]);

    const showRouterComponentHandler = (showRouterComponent: boolean) => {
        setShowRouterComponent(showRouterComponent);
    };

    const data = {
        showRouterComponent,
        showRouterComponentHandler,
    };
    return (
        <RouterContext.Provider value={data}>{children}</RouterContext.Provider>
    );
};

export default RouterContext;
