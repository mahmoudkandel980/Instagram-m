import { createContext, useState } from "react";

import { Props, CurrentStoryInterface } from "../interfaces/context-interfaces";

const initailCurrentStory: CurrentStoryInterface = {
    userName: "",
    imgs: [""],
};

const initailButtonClicked: boolean = false;

const initailNextStory: boolean = false;
const initailbackPage: string = "";

const CurrentStory = createContext({
    currentStory: initailCurrentStory,
    addCurrentStoryHandler: (userName: string, imgs: string[]): void => {},

    // button clicked to clear prev setTimeOut
    buttonClicked: initailButtonClicked,
    buttonClickedHandler: (state: boolean): void => {},

    // get next story if u get the last story in user stories in stories page
    getNextStory: initailNextStory,
    getNextStoryHandler: (state: boolean): void => {},

    // page link before go to stories page
    backPage: initailbackPage,
    setBackPageHandler: (link: string): void => {},
});

export const CurrentStoryProvider = (props: Props): JSX.Element => {
    const { children } = props;

    const [currentStory, setCurrentStory] =
        useState<CurrentStoryInterface>(initailCurrentStory);

    const [buttonClicked, setButtonClicked] =
        useState<boolean>(initailButtonClicked);

    const [getNextStory, setGetNextStory] = useState<boolean>(initailNextStory);

    const [backPage, setBackPage] = useState<string>(initailbackPage);

    const addCurrentStoryHandler = (userName: string, imgs: string[]) => {
        setCurrentStory({ userName, imgs });
    };

    const buttonClickedHandler = (state: boolean) => {
        setButtonClicked(state);
    };

    const getNextStoryHandler = (state: boolean) => {
        setGetNextStory(state);
    };

    const setBackPageHandler = (link: string) => {
        setBackPage(link);
    };

    const data = {
        currentStory,
        addCurrentStoryHandler,

        buttonClicked,
        buttonClickedHandler,

        getNextStory,
        getNextStoryHandler,

        backPage,
        setBackPageHandler,
    };
    return (
        <CurrentStory.Provider value={data}>{children}</CurrentStory.Provider>
    );
};

export default CurrentStory;
