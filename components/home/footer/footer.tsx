import { useContext } from "react";

import FooterLinks from "./footerLinks";
import ToggleMode from "../../../context/darkMode";

const links = [
    { link: "about", href: "https://about.instagram.com/" },
    { link: "help", href: "https://help.instagram.com/" },
    { link: "press", href: "https://about.instagram.com/blog/" },
    { link: "API", href: "https://developers.facebook.com/docs/instagram" },
    { link: "jobs", href: "https://about.instagram.com/about-us/careers" },
    {
        link: "privacy",
        href: "https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect",
    },
    { link: "terms", href: "https://help.instagram.com/" },
    { link: "locations", href: "https://www.instagram.com/explore/locations/" },
];

const Footer = () => {
    const modeCtx = useContext(ToggleMode);
    const { mode } = modeCtx;

    return (
        <div className="ml-2 mb-2 flex flex-col">
            <div className=" flex flex-wrap w-72">
                {links.map((link, index) => (
                    <div
                        key={`${link} ${index}`}
                        className="flex items-center space-x-1"
                    >
                        <FooterLinks
                            link={link.link}
                            href={link.href}
                            mode={mode}
                        />
                        <span className="text-[12px] text-gray-300/50">.</span>
                    </div>
                ))}
            </div>

            <div
                className={`${
                    mode === "dark" ? "text-gray-300/50" : "text-gray-400/90"
                } text-[14px] mt-4`}
            >
                &copy; 2022 by Mahmoud Kandel
            </div>
        </div>
    );
};

export default Footer;
