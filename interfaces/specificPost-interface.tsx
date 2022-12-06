export interface SpecificPostInputInterface {
    mode: string;
    textareaValue: string;
    setTextareaValue: React.Dispatch<React.SetStateAction<string>>;
    toggleEmojiList: () => void;
    textareaChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    hideEmojiList: () => void;
}

export interface CommentDataInterface {
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

export interface ReplyDataInterface {
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

export interface CommentsInterface {
    mode: string;
    id: string;
    userImg: string;
    userName: string;
    replyTo: string | null;
    comment: {
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
    };
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

export interface RepliesInterface {
    mode: string;
    id: string;
    userImg: string;
    userName: string;
    replyTo: string | null;
    reply: {
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
    };
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

export interface SpecificPostFooterInterface {
    mode: string;
    specificPost: {
        id: string;
        fullName: string;
        userName: string;
        userImg: string;
        img: string;
        caption: string;
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
        saves:
            | {
                  fullName: string;
                  userName: string;
                  userImg: string;
              }[]
            | [];
        comments:
            | {
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
              }[]
            | [];
    };
}

export interface SpecificPostHeaderCommentsCationInterface {
    mode: string;
    specificPost: {
        id: string;
        fullName: string;
        userName: string;
        userImg: string;
        img: string;
        caption: string;
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
        comments:
            | {
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
              }[]
            | [];
    };
}
