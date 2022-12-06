import { createContext, useState } from "react";

import { Props } from "../interfaces/context-interfaces";
import { UserContexctInterface } from "../interfaces/context-interfaces";
import { SingleUserInterface } from "../interfaces/user-interfaces";

const initailUserData: UserContexctInterface = {
    email: "",
    userName: "",
    fullName: "",
    caption: "",
    timestamp: {
        seconds: 0,
        nanoseconds: 0,
    },
    userImg: "",

    followers: [],
    following: [],
    search: [],
};

const initailUsers: SingleUserInterface[] = [
    {
        email: "",
        userName: "",
        fullName: "",
        timestamp: { seconds: 0, nanoseconds: 0 },
        userImg: "",
        caption: "",
        followers: [],
        following: [],
        search: [],
    },
];
const UserContext = createContext({
    userData: initailUserData,
    setUserDataHandler: (userData: UserContexctInterface): void => {},
    users: initailUsers,
    setUsersHandler: (users: SingleUserInterface[]): void => {},
});

export const UserContextProvider = (props: Props): JSX.Element => {
    const { children } = props;

    // user
    const [userData, setUserData] =
        useState<UserContexctInterface>(initailUserData);
    // users
    const [users, setUsers] = useState(initailUsers);

    const setUserDataHandler = (userData: UserContexctInterface) => {
        setUserData(userData);
    };

    const setUsersHandler = (users: SingleUserInterface[]) => {
        setUsers(users);
    };

    const data = {
        userData,
        setUserDataHandler,
        users,
        setUsersHandler,
    };
    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export default UserContext;
