import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Props } from "../interfaces/context-interfaces";
import { UserSearchInterface } from "../interfaces/user-interfaces";

const initailSearchContext: UserSearchInterface[] = [
    {
        fullName: "",
        userName: "",
        userImg: "",
    },
];

const SearchContext = createContext({
    removedSearchUsers: initailSearchContext,
    removeSearchUserHandler: (user: UserSearchInterface): void => {},
});

export const SearchContextProvider = (props: Props): JSX.Element => {
    const { children } = props;
    const [removedSearchUsers, setRemovedSearchUsers] =
        useState<UserSearchInterface[]>(initailSearchContext);

    const router = useRouter();
    const aspath = router.asPath;

    useEffect(() => {
        setRemovedSearchUsers([]);
    }, [aspath]);

    const removeSearchUserHandler = (user: UserSearchInterface) => {
        setRemovedSearchUsers((prevState) => prevState.concat(user));
    };

    const data = {
        removedSearchUsers,
        removeSearchUserHandler,
    };
    return (
        <SearchContext.Provider value={data}>{children}</SearchContext.Provider>
    );
};

export default SearchContext;
