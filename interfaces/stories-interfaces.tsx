// stories
export interface StoryInterface {
    userName: string;
    userImg: string;
    fullName: string;
    imgs: string[];
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface StoriesInterface {
    stories: {
        userName: string;
        userImg: string;
        fullName: string;
        imgs: string[];
        timestamp: {
            seconds: number;
            nanoseconds: number;
        };
    }[];
}

// stories
export interface StoryForStoryPageInterface {
    userName: string;
    userImg: string;
    fullName: string;
    imgs: string[];
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    length: number;
}
