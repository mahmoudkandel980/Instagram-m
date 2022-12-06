export interface AllUsersInterface {
    allUsers:
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

export interface SingleUserInterface {
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

export interface UserInterface {
    currentUser: {
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

export interface UserSearchInterface {
    fullName: string;
    userName: string;
    userImg: string;
}
