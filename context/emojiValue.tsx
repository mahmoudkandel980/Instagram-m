import { createContext, useEffect, useState } from "react";

import { Props } from "../interfaces/context-interfaces";

const initailValue: string = "";

const EmojiValue = createContext({
    emojiValue: initailValue,
    setEmojiValueHandler: (emojiValue: string): void => {},
});

export const EmojiValueProvider = (props: Props): JSX.Element => {
    const { children } = props;
    const [emojiValue, setEmojiValue] = useState<string>(initailValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEmojiValue("");
        }, 10);

        return () => {
            clearTimeout(timer);
        };
    }, [emojiValue]);

    const setEmojiValueHandler = (emojiValue: string) => {
        setEmojiValue(emojiValue);
    };

    const data = {
        emojiValue,
        setEmojiValueHandler,
    };
    return <EmojiValue.Provider value={data}>{children}</EmojiValue.Provider>;
};

export default EmojiValue;
