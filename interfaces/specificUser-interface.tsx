export interface UserNameInterface {
    userName: string;
}

export interface SpecificUserInterface {
    user: {
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
    };
}
