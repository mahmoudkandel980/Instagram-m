export interface SpecificFollowingInterface {
    fullName: string;
    userName: string;
    userImg: string;
}

export interface SpecificFollowersInterface {
    fullName: string;
    userName: string;
    userImg: string;
}

export interface UnfollowingModel {
    showUnfollowingModel: boolean;
    userName: string;
    fullName: string;
    userImg: string;
    currentUserUserUserName: string;
    currentUserUserFullName: string;
    currentUserUserUserImg: string;
}

export interface RemoveFollowerModel {
    showRemoveFollowersModel: boolean;
    userName: string;
    fullName: string;
    userImg: string;
    currentUserUserUserName: string;
    currentUserUserFullName: string;
    currentUserUserUserImg: string;
}
