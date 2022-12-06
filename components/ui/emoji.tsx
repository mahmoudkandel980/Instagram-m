import { useState, useContext, useEffect } from "react";

import dynamic from "next/dynamic";
import { IEmojiPickerProps } from "emoji-picker-react";
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import("emoji-picker-react"),
    {
        ssr: false,
        loading: () => <p>Emoji...</p>,
    }
);

import EmojiValue from "../../context/emojiValue";

const Emoji = (): JSX.Element => {
    const [chosenEmoji, setChosenEmoji] = useState("");

    const emojiValueCtx = useContext(EmojiValue);
    const { setEmojiValueHandler } = emojiValueCtx;

    const onEmojiClick = (event: any, emojiObject: any) => {
        setChosenEmoji(emojiObject.emoji);
    };

    useEffect(() => {
        setEmojiValueHandler(chosenEmoji);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosenEmoji]);

    return (
        <div>
            <EmojiPickerNoSSRWrapper onEmojiClick={onEmojiClick} />
        </div>
    );
};

export default Emoji;
