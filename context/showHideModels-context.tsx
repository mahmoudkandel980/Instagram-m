import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
    Props,
    ModelStateInterfaceWithId,
    ModelStateInterfaceWithUserName,
    EditProfileModelInterface,
} from "../interfaces/context-interfaces";

const initailModelStatewithUserName: ModelStateInterfaceWithUserName = {
    state: false,
    userName: "",
};

const initailModelStateWithId: ModelStateInterfaceWithId = {
    state: false,
    id: "",
};

const initialProfileSpecificUserQuery: string = "posts";

const initailEditProfileModel: EditProfileModelInterface = {
    state: false,
    caption: "",
    showCaptionInput: false,
    image: null,
    showProfileImageModel: false,
};

const ShowHideModels = createContext({
    // story model for upload stories
    showStoryModel: initailModelStatewithUserName,
    showStoryModelHandler: (state: boolean, userName: string): void => {},

    // story model settings
    showStorySettingsModel: initailModelStatewithUserName,
    showStorySettingsModelHandler: (
        state: boolean,
        userName: string
    ): void => {},

    // post
    showPostModel: initailModelStatewithUserName,
    showPostModelHandler: (state: boolean, userName: string): void => {},

    //likes
    showLikesModel: initailModelStateWithId,
    showLikesModelHandler: (state: boolean, id: any): void => {},

    // post Settings
    showPostSettingsModel: initailModelStateWithId,
    showPostSettingsModelHandler: (state: boolean, id: any): void => {},

    // profile query
    profileQuery: initialProfileSpecificUserQuery,
    setProfileQueryHandler: (query: string): void => {},

    // specific user query
    specificUserQuery: initialProfileSpecificUserQuery,
    setSpecificUserQueryHandler: (query: string): void => {},

    // Edit profile model
    editProfileModel: initailEditProfileModel,
    editProfileModelHandler: (
        state: boolean,
        caption: string,
        showCaptionInput: boolean,
        image: any,
        showProfileImageModel: boolean
    ): void => {},
});

export const ShowHideModelsProvider = (props: Props): JSX.Element => {
    const { children } = props;

    // post
    const [showPostModel, setShowPostModel] =
        useState<ModelStateInterfaceWithUserName>(
            initailModelStatewithUserName
        );

    // story upload story
    const [showStoryModel, setShowStoryModel] =
        useState<ModelStateInterfaceWithUserName>(
            initailModelStatewithUserName
        );

    // story setting
    const [showStorySettingsModel, setShowStorySettingsModel] =
        useState<ModelStateInterfaceWithUserName>(
            initailModelStatewithUserName
        );

    // likes
    const [showLikesModel, setShowLikesModel] =
        useState<ModelStateInterfaceWithId>(initailModelStateWithId);

    // post Settings
    const [showPostSettingsModel, setShowPostSettingsModel] =
        useState<ModelStateInterfaceWithId>(initailModelStateWithId);

    // profile query
    const [profileQuery, setProfileQuery] = useState<string>(
        initialProfileSpecificUserQuery
    );

    // specific user query
    const [specificUserQuery, setSpecificUserQuery] = useState<string>(
        initialProfileSpecificUserQuery
    );

    // Edit profile model
    const [editProfileModel, setEditProfileModel] =
        useState<EditProfileModelInterface>(initailEditProfileModel);

    const router = useRouter();
    const pathname = router.pathname;

    // remove profile edit when route to other page
    useEffect(() => {
        setEditProfileModel(initailEditProfileModel);
    }, [router.pathname]);

    // if  setProfileQuery by posts if user go to any page not includes profile
    // if  setProfileQuery by posts if user go toany page not includes [userName]
    useEffect(() => {
        if (!pathname.includes("profile") && profileQuery !== "posts") {
            setProfileQuery("posts");
        }

        if (!pathname.includes("[userName]") && specificUserQuery !== "posts") {
            setSpecificUserQuery("posts");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // post
    const showPostModelHandler = (state: boolean, userName: string) => {
        setShowPostModel({ state: state, userName: userName });
    };

    // story upload story
    const showStoryModelHandler = (state: boolean, userName: string) => {
        setShowStoryModel({ state: state, userName: userName });
    };

    // story settings
    const showStorySettingsModelHandler = (
        state: boolean,
        userName: string
    ) => {
        setShowStorySettingsModel({ state: state, userName: userName });
    };

    // likes
    const showLikesModelHandler = (state: boolean, id: any) => {
        setShowLikesModel({ state: state, id: id });
    };

    // post Settings
    const showPostSettingsModelHandler = (state: boolean, id: any) => {
        setShowPostSettingsModel({ state: state, id: id });
    };

    // profile query
    const setProfileQueryHandler = (query: string) => {
        setProfileQuery(query);
    };

    // specific user query
    const setSpecificUserQueryHandler = (query: string) => {
        setSpecificUserQuery(query);
    };

    // Edit profile model
    const editProfileModelHandler = (
        state: boolean,
        caption: string,
        showCaptionInput: boolean,
        image: any,
        showProfileImageModel: boolean
    ) => {
        setEditProfileModel({
            caption: caption,
            state: state,
            showCaptionInput: showCaptionInput,
            image: image,
            showProfileImageModel: showProfileImageModel,
        });
    };

    const data = {
        // post
        showPostModel,
        showPostModelHandler,

        // story upload story
        showStoryModel,
        showStoryModelHandler,

        // story settings
        showStorySettingsModel,
        showStorySettingsModelHandler,

        //likes
        showLikesModel,
        showLikesModelHandler,

        // post Settings
        showPostSettingsModel,
        showPostSettingsModelHandler,

        // profile query
        profileQuery,
        setProfileQueryHandler,

        // specific user query
        specificUserQuery,
        setSpecificUserQueryHandler,

        // Edit profile model
        editProfileModel,
        editProfileModelHandler,
    };
    return (
        <ShowHideModels.Provider value={data}>
            {children}
        </ShowHideModels.Provider>
    );
};

export default ShowHideModels;
