import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import FooterLinks from "../../home/footer/footerLinks";

import ToggleMode from "../../../context/darkMode";
import HideModel from "../../../context/hideModels";

import { FaChevronDown } from "react-icons/fa";

const links = [
    { link: "meta", href: "https://about.facebook.com/" },
    { link: "about", href: "https://about.instagram.com/" },
    { link: "blog", href: "https://about.instagram.com/en_US/blog" },
    { link: "jobs", href: "https://about.instagram.com/about-us/careers" },
    { link: "help", href: "https://help.instagram.com/" },
    { link: "API", href: "https://developers.facebook.com/docs/instagram" },
    {
        link: "privacy",
        href: "https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect",
    },
    { link: "terms", href: "https://help.instagram.com/" },
    {
        link: "top accounts",
        href: "https://www.instagram.com/directory/profiles/",
    },
    { link: "hashtags", href: "https://www.instagram.com/directory/hashtags/" },
    { link: "locations", href: "https://www.instagram.com/explore/locations/" },
    { link: "instagram lite", href: "https://www.instagram.com/web/lite/" },
    {
        link: "contact uploding & Non-Users",
        href: "https://web.facebook.com/help/instagram/261704639352628?_rdc=1&_rdr",
    },
];

const Footer = () => {
    const [showHideProfileModel, setShowHideProfileModel] = useState(true);

    const router = useRouter();
    const { asPath } = router;

    const modeCtx = useContext(ToggleMode);
    const hideModelCtx = useContext(HideModel);

    const { mode } = modeCtx;
    const {
        toggleProfileModel,
        toggleProfileModelHandler,
        //
        toggleShowHideAllModelsHandler,
    } = hideModelCtx;

    useEffect(() => {
        toggleShowHideAllModelsHandler(showHideProfileModel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showHideProfileModel]);

    const hideModelHandler = () => {
        setShowHideProfileModel((prevState) => !prevState);
        toggleShowHideAllModelsHandler(showHideProfileModel);
        if (toggleProfileModel) {
            toggleProfileModelHandler(false);
        }
    };

    return (
        <div
            onClick={hideModelHandler}
            className={`${
                mode === "dark"
                    ? "bg-smothDark text-white border-gray-600/40"
                    : "bg-gray-100 text-smothDark border-gray-600/10"
            } ${
                asPath.includes("/stories") && "hidden"
            }  pb-14 sm:pb-10 py-10 border-t-[1px] flex items-center justify-center text-center`}
        >
            <div className=" flex flex-col justify-center items-center text-center">
                <div className="flex flex-wrap justify-center w-fit lg:w-[800px] space-x-2 md:space-x-3 lg:space-x-4">
                    {links.map((link, index) => (
                        <div
                            key={`${link} ${index}`}
                            className="flex items-center "
                        >
                            <FooterLinks
                                link={link.link}
                                href={link.href}
                                mode={mode}
                            />
                        </div>
                    ))}
                </div>

                <div
                    className={`${
                        mode === "dark"
                            ? "text-gray-300/50"
                            : "text-gray-400/90"
                    } flex items-center justify-center space-x-5 text-[13px] mt-4`}
                >
                    <div className="flex items-center space-x-1 cursor-pointer">
                        <span>English</span>
                        <FaChevronDown className="w-3 h-3" />
                    </div>
                    <span>&copy; 2022 by Mahmoud Kandel</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
