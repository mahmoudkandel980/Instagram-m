// posts
export interface PostInterface {
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
}

export interface PostsInterface {
    posts: {
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
    }[];
}
