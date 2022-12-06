import { createContext, useState } from "react";

import { Props } from "../interfaces/context-interfaces";

const initailMode: boolean = true;

const HideModel = createContext({
    toggleProfileModel: initailMode,
    toggleProfileModelHandler: (hideModel: boolean): void => {},
    toggleShowHideAllModels: initailMode,
    toggleShowHideAllModelsHandler: (hideModel: boolean): void => {},
});

export const HideModelProvider = (props: Props): JSX.Element => {
    const { children } = props;
    const [toggleProfileModel, setToggleProfileModel] =
        useState<boolean>(false);
    const [toggleShowHideAllModels, setToggleShowHideAllModels] =
        useState<boolean>(true);

    const toggleProfileModelHandler = (hideModel: boolean) => {
        setToggleProfileModel(hideModel);
    };
    const toggleShowHideAllModelsHandler = (hideModel: boolean) => {
        setToggleShowHideAllModels(hideModel);
    };

    const data = {
        toggleProfileModel,
        toggleProfileModelHandler,
        toggleShowHideAllModels,
        toggleShowHideAllModelsHandler,
    };
    return <HideModel.Provider value={data}>{children}</HideModel.Provider>;
};

export default HideModel;
