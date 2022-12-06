import { Head, NextScript, Main, Html } from "next/document";

export default function Document(): JSX.Element {
    return (
        <Html id="html">
            <Head />
            <body id="body">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
