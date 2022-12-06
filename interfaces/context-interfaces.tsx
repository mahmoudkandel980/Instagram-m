export interface Props {
    children: React.ReactNode;
}

export interface CurrentStoryInterface {
    userName: string;
    imgs: string[];
}

// delete specific post
export interface DeleteSpecificPost {
    state: boolean;
    id: any;
}

// unfollow model
export interface UnFollowpersonInterface {
    state: boolean;
    userName: string;
    userImg: string;
}

// show hide models interfaces
export interface ModelStateInterfaceWithUserName {
    state: boolean;
    userName: string;
}

export interface ModelStateInterfaceWithId {
    state: boolean;
    id: any;
}

export interface EditProfileModelInterface {
    state: boolean;
    caption: string;
    showCaptionInput: boolean;
    image: any;
    showProfileImageModel: boolean;
}

export interface ReplyToInterface {
    userName: string;
    id: string;
}

export interface CommentValueInterface {
    commentValue: string;
}

export interface PostsCommentsInterface {
    commentValue: string;
    id: any;
}
export interface PostLikeInterface {
    likeCtx: boolean;
    id: any;
}
export interface PostSaveInterface {
    saveCtx: boolean;
    id: any;
}

export interface UserContexctInterface {
    email: string;
    userName: string;
    fullName: string;
    caption: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    userImg: string;
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

export interface PostCommentReplyDataInterface {
    id: string;
    fullName: string;
    userName: string;
    userImg: string;
    comment: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    likes:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
    replys:
        | {
              commentId: string;
              replyId: string;
              fullName: string;
              userName: string;
              userImg: string;
              reply: string;
              replyTo: string;
              timestamp: {
                  seconds: number;
                  nanoseconds: number;
              };
              likes:
                  | {
                        fullName: string;
                        userName: string;
                        userImg: string;
                    }[]
                  | [];
          }[]
        | [];
}

export interface PostReplyDataInterface {
    commentId: string;
    replyId: string;
    fullName: string;
    userName: string;
    userImg: string;
    reply: string;
    replyTo: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    likes:
        | {
              fullName: string;
              userName: string;
              userImg: string;
          }[]
        | [];
}

export interface CommentReplyTargetInterface {
    commentId: string;
    replyId: string;
    type: string; //comment or reply
    belongsToUser: boolean;
    showModel: boolean;
}
