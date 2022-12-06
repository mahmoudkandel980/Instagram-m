import Link from "next/link";

import { ModeInterFace } from "../../../interfaces/interfaces";

interface LinkInterface {
    link: string;
    href: string;
}

const FooterLinks = (props: LinkInterface & ModeInterFace) => {
    const { link, href, mode } = props;
    return (
        <Link href={href}>
            <a
                target="_blank"
                className={`${
                    mode === "dark"
                        ? "text-gray-300/50  hover:border-b-gray-300/50"
                        : "text-gray-400/90  hover:border-b-gray-400/90"
                }  capitalize text-[12px] border-b-[1px] border-transparent`}
            >
                {link}
            </a>
        </Link>
    );
};

export default FooterLinks;
