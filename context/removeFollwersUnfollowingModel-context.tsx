import { createContext, useState } from "react";

import { Props } from "../interfaces/context-interfaces";

const initialShowUnfollowModel: boolean = false;

const RemoveFollwersUnfollowingModel = createContext({
    // following
    showUnfollowModel: initialShowUnfollowModel,
    toggleShowUnfollowModel: (toggleModel: boolean): void => {},

    // followers
    showRemoveFollwerModel: initialShowUnfollowModel,
    toggleShowRemoveFollwerModel: (toggleModel: boolean): void => {},
});

export const RemoveFollwersUnfollowingModelProvider = (
    props: Props
): JSX.Element => {
    const { children } = props;

    const [showUnfollowModel, setShowUnfollowModel] = useState<boolean>(false);
    const [showRemoveFollwerModel, setShowRemoveFollwerModel] =
        useState<boolean>(false);

    const toggleShowUnfollowModel = (toggleModel: boolean) => {
        setShowUnfollowModel(toggleModel);
    };

    const toggleShowRemoveFollwerModel = (toggleModel: boolean) => {
        setShowRemoveFollwerModel(toggleModel);
    };

    const data = {
        // following
        showUnfollowModel,
        toggleShowUnfollowModel,

        // followers
        showRemoveFollwerModel,
        toggleShowRemoveFollwerModel,
    };
    return (
        <RemoveFollwersUnfollowingModel.Provider value={data}>
            {children}
        </RemoveFollwersUnfollowingModel.Provider>
    );
};

export default RemoveFollwersUnfollowingModel;
