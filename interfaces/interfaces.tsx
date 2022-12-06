export interface ModeInterFace {
    mode: string;
}
export interface ClassNameInterface {
    className: string;
}
export interface CommentIdInterface {
    commentId: string;
}

export interface DocumentedUsers {
    userName: string;
}

export interface ChildrenInterface {
    children: JSX.Element;
}

export interface HideModelHandler {
    hideModelHandler: () => void;
}

export interface IndexInterface {
    index: number;
}

export interface ShowSearchModel {
    setShowSearchModel: React.Dispatch<React.SetStateAction<boolean>>;
}

//  unfollow model
export interface UnfollowModelInterface {
    userImg: string;
    userName: string;
}

// profile model
export interface ProfileModelInterface {
    showModel: boolean;
    mode: string;
    showModelHandler: () => void;
    toggleCurrentModeHandler: () => void;
}

// suggestions
export interface SuggestedPersonInterface {
    email: string;
    userName: string;
    fullName: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    userImg: string;
    caption: string;
    followers:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
    following:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
    search:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
}
export interface SuggestedPeopleInterface {
    suggestedPeople:
        | {
              email: string;
              userName: string;
              fullName: string;
              timestamp: {
                  seconds: number;
                  nanoseconds: number;
              };
              userImg: string;
              caption: string;
              followers:
                  | {
                        fullName: string;
                        userName: string;
                        userImg: string;
                    }[]
                  | [];
              following:
                  | {
                        fullName: string;
                        userName: string;
                        userImg: string;
                    }[]
                  | [];
              search:
                  | {
                        fullName: string;
                        userName: string;
                        userImg: string;
                    }[]
                  | [];
          }[]
        | [];
}

// followers
export interface FollowersInterface {
    followers:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | null;
}
export interface FollowerInterface {
    fullName: string;
    userName: string;
    userImg: string;
}

// following
export interface FollowingInterface {
    following:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | null;
}

export interface SingleFollowingInterface {
    fullName: string;
    userName: string;
    userImg: string;
}
// likes
export interface LikesInterface {
    likes:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
}
export interface LikeInterface {
    fullName: string;
    userName: string;
    userImg: string;
}
export interface singlePersonSearchInterface {
    fullName: string;
    userName: string;
    userImg: string;
}

export interface LikesModelInterface {
    fullName: string;
    userName: string;
    userImg: string;
    followState: string;
}

export interface FollowingModelInterface {
    fullName: string;
    userName: string;
    userImg: string;
    followState: string;
}

// post id
export interface PostIdInterface {
    id: any;
}

// SearchInputValue
export interface SearchInputValue {
    searchInputValue: string;
}
