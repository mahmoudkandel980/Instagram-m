import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToggleModeProvider } from "../context/darkMode";
import { HideModelProvider } from "../context/hideModels";
import { EmojiValueProvider } from "../context/emojiValue";
import { RouterContextProvider } from "../context/router-context";
import { UserContextProvider } from "../context/user-context";
import { RemoveFollwersUnfollowingModelProvider } from "../context/removeFollwersUnfollowingModel-context";
import { SearchContextProvider } from "../context/search-context";
import { PostsContextProvider } from "../context/posts-context";
import { SpecificPostCommentReplyDataProvider } from "../context/specificPostCommentReplyData-context";
import { CommentOrReplyModelProvider } from "../context/commentOrReplyModel-context";
import { ShowHideModelsProvider } from "../context/showHideModels-context";
import { CurrentUserFollowingProvider } from "../context/currentUserFollowing";
import { CurrentStoryProvider } from "../context/currentStory-context";
import { UpdateTargetProvider } from "../context/updateTarget-context";

import Layout from "../components/layout/layout";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ToggleModeProvider>
            <HideModelProvider>
                <EmojiValueProvider>
                    <PostsContextProvider>
                        <RouterContextProvider>
                            <UserContextProvider>
                                <RemoveFollwersUnfollowingModelProvider>
                                    <SearchContextProvider>
                                        <SpecificPostCommentReplyDataProvider>
                                            <CommentOrReplyModelProvider>
                                                <ShowHideModelsProvider>
                                                    <CurrentUserFollowingProvider>
                                                        <CurrentStoryProvider>
                                                            <UpdateTargetProvider>
                                                                <Layout>
                                                                    <Component
                                                                        {...pageProps}
                                                                    />
                                                                </Layout>
                                                            </UpdateTargetProvider>
                                                        </CurrentStoryProvider>
                                                    </CurrentUserFollowingProvider>
                                                </ShowHideModelsProvider>
                                            </CommentOrReplyModelProvider>
                                        </SpecificPostCommentReplyDataProvider>
                                    </SearchContextProvider>
                                </RemoveFollwersUnfollowingModelProvider>
                            </UserContextProvider>
                        </RouterContextProvider>
                    </PostsContextProvider>
                </EmojiValueProvider>
            </HideModelProvider>
        </ToggleModeProvider>
    );
}

export default MyApp;
