import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth } from "../../../firebase.config";
import {
    setDoc,
    doc,
    serverTimestamp,
    collection,
    getDocs,
} from "firebase/firestore";

import Spinner from "../../ui/spinner";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsArrowClockwise } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";

import { ModeInterFace } from "../../../interfaces/interfaces";
import { SingleUserInterface } from "../../../interfaces/user-interfaces";

const emailValidation: RegExp = new RegExp(
    "[a-z0-9]+@[a-z]+.[a-z]{0,10}.[a-z]"
);

const SignUpForm = (props: ModeInterFace) => {
    const { mode } = props;

    // spinner in button
    const [signUpClicked, setSignUpClicked] = useState(false);

    // check if there is a username in firebase have the same value
    const [firebaseAllUsers, setFirebaseAllUsers] =
        useState<SingleUserInterface[]>();
    const [userNameInFirebase, setUserNameInFirebase] =
        useState<boolean>(false);
    const [emailInFirebase, setEmailInFirebase] = useState<boolean>(false);

    // email
    const [emailInputValue, setEmailInputValue] = useState<string>("");
    const [focusOnEmailInput, setFocusOnEmailInput] = useState<boolean>(false);
    const [blurOnEmailInput, setBlurOnEmailInput] = useState<boolean>(false);

    // full Name
    const [fullNameInputValue, setFullNameInputValue] = useState<string>("");
    const [focusOnFullNameInput, setFocusOnFullNameInput] =
        useState<boolean>(false);
    const [blurOnFullNameInput, setBlurOnFullNameInput] =
        useState<boolean>(false);

    // user Name
    const [userNameInputValue, setUserNameInputValue] = useState<string>("");
    const [focusOnUserNameInput, setFocusOnUserNameInput] =
        useState<boolean>(false);
    const [blurOnUserNameInput, setBlurOnUserNameInput] =
        useState<boolean>(false);

    // password
    const [passwordInputValue, setPasswordInputValue] = useState<string>("");
    const [focusOnPasswordInput, setFocusOnPasswordInput] =
        useState<boolean>(false);
    const [blurOnPasswordInput, setBlurOnPasswordInput] =
        useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    // allUsers current user
    useEffect(() => {
        const fetchAllUsersData = async () => {
            try {
                // allUsers current user
                const allUsersRef = collection(db, "allUsers");
                const allUsersQuerySnap = await getDocs(allUsersRef);

                const allUsersFirebaseRef: SingleUserInterface[] = [];
                // @ts-ignore
                allUsersQuerySnap.forEach((doc: any) => {
                    return allUsersFirebaseRef.push({
                        ...doc.data(),
                    });
                });

                setFirebaseAllUsers(
                    allUsersFirebaseRef.filter(
                        (user) =>
                            user.userName !== auth.currentUser?.displayName
                    )
                );
            } catch (error) {
                console.log(error);
            }
        };

        if (!firebaseAllUsers) {
            fetchAllUsersData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // check if username exist in firebase beacouse userName is unique

    useEffect(() => {
        setUserNameInFirebase(false);
        setEmailInFirebase(false);
        firebaseAllUsers?.forEach((user) => {
            if (user.userName === userNameInputValue.trim()) {
                setUserNameInFirebase(true);
                return;
            }
        });
        firebaseAllUsers?.forEach((user) => {
            if (user.email === emailInputValue.trim()) {
                setEmailInFirebase(true);
                return;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userNameInputValue, emailInputValue]);

    useEffect(() => {
        if (!passwordInputValue) {
            setShowPassword(false);
        }
    }, [passwordInputValue]);

    // email
    const focusOnEmailInputHandler = () => {
        setFocusOnEmailInput(true);
        setBlurOnEmailInput(false);
    };

    const blurOnEmailInputHandler = () => {
        setBlurOnEmailInput(true);
        setFocusOnEmailInput(false);
    };

    const changeEmailInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnEmailInput(true);
        setEmailInputValue(e.target.value);
    };

    // full name
    const focusOnFullNameInputHandler = () => {
        setFocusOnFullNameInput(true);
        setBlurOnFullNameInput(false);
    };

    const blurOnFullNameInputHandler = () => {
        setBlurOnFullNameInput(true);
        setFocusOnFullNameInput(false);
    };

    const changeFullNameInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnFullNameInput(true);
        setFullNameInputValue(e.target.value);
    };

    // user name
    const focusOnUserNameInputHandler = () => {
        setFocusOnUserNameInput(true);
        setBlurOnUserNameInput(false);
    };

    const blurOnUserNameInputHandler = () => {
        setBlurOnUserNameInput(true);
        setFocusOnUserNameInput(false);
    };

    const changeUserNameInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnUserNameInput(true);
        setUserNameInputValue(e.target.value);
    };

    // generet username
    const generateUsernameValueHandler = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        const trimedFullNameValue = fullNameInputValue
            .trim()
            .replace(/\s/g, "_");

        const timeInMilliSecond = new Date().getMilliseconds();
        const randomNumber = +timeInMilliSecond.toString().slice(2);

        setFocusOnUserNameInput(true);
        setBlurOnUserNameInput(true);

        if (randomNumber >= 4) {
            setUserNameInputValue(
                `${trimedFullNameValue}${timeInMilliSecond
                    .toString()
                    .slice(0, 3)}`
            );
        } else {
            setUserNameInputValue(
                `${trimedFullNameValue}${timeInMilliSecond
                    .toString()
                    .slice(0, 2)}`
            );
        }
    };

    // password
    const toggleShowHidePassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const focusOnPasswordInputHandler = () => {
        setFocusOnPasswordInput(true);
        setBlurOnPasswordInput(false);
    };

    const blurOnPasswordInputHandler = () => {
        setBlurOnPasswordInput(true);
        setFocusOnPasswordInput(false);
    };

    const changePasswordInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFocusOnPasswordInput(true);
        setPasswordInputValue(e.target.value);
    };

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (
            emailValidation.test(emailInputValue.trim()) === false ||
            fullNameInputValue.trim().length < 6 ||
            emailInFirebase ||
            userNameInFirebase ||
            userNameInputValue.trim().length < 6 ||
            passwordInputValue.trim().length < 10
        ) {
            return;
        }

        setSignUpClicked(true);

        try {
            const useCredential = await createUserWithEmailAndPassword(
                auth,
                emailInputValue,
                passwordInputValue
            );
            // authentication
            const user = useCredential.user;
            updateProfile(auth?.currentUser!, {
                displayName: userNameInputValue,
            });

            const currentUser = {
                email: emailInputValue,
                userName: userNameInputValue,
                fullName: fullNameInputValue,
                timestamp: serverTimestamp(),
                userImg: "",
                caption: "",
                followers: [],
                following: [],
                search: [],
            };

            // // update user
            // const allUsers = doc(db, "allUsers", "allUsers");
            // await updateDoc(allUsers, { allUsers: arrayUnion(currentUser) });

            // update user
            await setDoc(doc(db, "allUsers", userNameInputValue), currentUser);

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="flex flex-col justify-start items-center w-full space-y-1.5">
            {/* email */}
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${!focusOnEmailInput && !emailInputValue && "hidden"} ${
                        emailInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    Email
                </span>
                <div
                    className={`${
                        !blurOnEmailInput && "opacity-0 -translate-y-1"
                    } absolute top-2 right-3 opacity-100 translate-y-0 duration-300`}
                >
                    <span className="cursor-default select-none">
                        {emailValidation.test(emailInputValue.trim()) &&
                        !emailInFirebase ? (
                            <AiOutlineCheckCircle className="w-6 h-6 text-success" />
                        ) : (
                            <AiOutlineCloseCircle className="w-6 h-6 text-darkRed rotate-90" />
                        )}
                    </span>
                </div>
                <input
                    type="email"
                    placeholder="Email"
                    value={emailInputValue}
                    onChange={changeEmailInputHandler}
                    onFocus={focusOnEmailInputHandler}
                    onBlur={blurOnEmailInputHandler}
                    spellCheck={false}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>

            {/* Full name */}
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${
                        !focusOnFullNameInput && !fullNameInputValue && "hidden"
                    } ${
                        fullNameInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    Full name
                </span>
                <div
                    className={`${
                        !blurOnFullNameInput && "opacity-0 -translate-y-1"
                    } absolute top-2 right-3 opacity-100 translate-y-0 duration-300`}
                >
                    <span className="cursor-default select-none">
                        {fullNameInputValue.trim().length >= 6 ? (
                            <AiOutlineCheckCircle className="w-6 h-6 text-success" />
                        ) : (
                            <AiOutlineCloseCircle className="w-6 h-6 text-darkRed rotate-90" />
                        )}
                    </span>
                </div>
                <input
                    type="text"
                    placeholder="Full name"
                    value={fullNameInputValue}
                    onChange={changeFullNameInputHandler}
                    onFocus={focusOnFullNameInputHandler}
                    onBlur={blurOnFullNameInputHandler}
                    spellCheck={false}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>

            {/* user name */}
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${
                        !focusOnUserNameInput && !userNameInputValue && "hidden"
                    } ${
                        userNameInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    username
                </span>
                <div
                    className={`${
                        fullNameInputValue.trim().length >= 6
                            ? "opacity-100"
                            : "opacity-0"
                    } absolute top-2 right-3 duration-300`}
                >
                    <button onClick={generateUsernameValueHandler}>
                        <BsArrowClockwise className="w-6 h-6 select-none text-lightBlue rotate-90" />
                    </button>
                </div>
                <div
                    className={`${
                        !blurOnUserNameInput && "opacity-0 -translate-y-1"
                    } absolute top-2 right-10 opacity-100 translate-y-0 duration-300`}
                >
                    <span className="cursor-default select-none">
                        {userNameInputValue.trim().length >= 6 &&
                        !userNameInFirebase ? (
                            <AiOutlineCheckCircle className="w-6 h-6 text-success" />
                        ) : (
                            <AiOutlineCloseCircle className="w-6 h-6 text-darkRed rotate-90" />
                        )}
                    </span>
                </div>
                <input
                    type="text"
                    placeholder="username"
                    value={userNameInputValue}
                    onChange={changeUserNameInputHandler}
                    onFocus={focusOnUserNameInputHandler}
                    onBlur={blurOnUserNameInputHandler}
                    spellCheck={false}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>
            <div
                className={`${
                    mode === "dark"
                        ? "bg-dark border-gray-500/50"
                        : "bg-gray-50 border-gray-300"
                } relative border-[1px] p-3 py-2 w-[70%] rounded-sm `}
            >
                <span
                    className={`${
                        mode === "dark" ? "text-white/50 " : "text-gray-400"
                    } ${
                        !focusOnPasswordInput && !passwordInputValue && "hidden"
                    } ${
                        passwordInputValue
                            ? "opacity-100 text-[10px] -translate-x-2 -translate-y-2"
                            : "opacity-0"
                    } absolute top-2 left-3 text-[12px] font-thin duration-300`}
                >
                    Password
                </span>
                <span
                    onClick={toggleShowHidePassword}
                    className={`${
                        mode === "dark" ? "text-white/90 " : "text-dark/50"
                    } ${
                        !passwordInputValue && "hidden"
                    } absolute right-3 text-[15px] cursor-pointer`}
                >
                    {showPassword ? "Hide" : "Show"}
                </span>
                <div
                    className={`${
                        !blurOnPasswordInput && "opacity-0 -translate-y-1"
                    } absolute top-2 right-14 opacity-100 translate-y-0 duration-300`}
                >
                    <span className="cursor-default select-none">
                        {passwordInputValue.trim().length >= 10 ? (
                            <AiOutlineCheckCircle className="w-6 h-6 text-success" />
                        ) : (
                            <AiOutlineCloseCircle className="w-6 h-6 text-darkRed rotate-90" />
                        )}
                    </span>
                </div>
                <input
                    type={showPassword ? "text" : "Password"}
                    placeholder="password"
                    value={passwordInputValue}
                    onChange={changePasswordInputHandler}
                    onFocus={focusOnPasswordInputHandler}
                    onBlur={blurOnPasswordInputHandler}
                    className={`${
                        mode === "dark"
                            ? "bg-dark placeholder:text-white/50 "
                            : "bg-gray-50 placeholder:text-gray-400"
                    } text-[13px] w-full placeholder:font-thin placeholder:text-[12px] focus:outline-none`}
                />
            </div>
            <p
                className={`${
                    mode === "dark" ? "text-white/50 " : "text-gray-400"
                } w-[73%] text-[12.5px] text-center`}
            >
                People who use our service may have uploaded your contact
                information to Instagram. Learn More
            </p>
            <p
                className={`${
                    mode === "dark" ? "text-white/50 " : "text-gray-400"
                } w-[73%] py-2 text-[12.5px] text-center`}
            >
                By signing up, you agree to our Terms , Privacy Policy and
                Cookies Policy .
            </p>
            {signUpClicked ? (
                <button
                    className={`${
                        emailValidation.test(emailInputValue.trim()) &&
                        fullNameInputValue.trim().length >= 6 &&
                        userNameInputValue.trim().length >= 6 &&
                        passwordInputValue.trim().length >= 10
                            ? "bg-lightBlue"
                            : "bg-lighertBlue/95 brightness-95 cursor-default"
                    } text-white relative p-3 py-1 w-[70%] rounded-md`}
                >
                    <div className="flex justify-center items-center">
                        <Spinner className="scale-[0.2] mb-1 w-8 h-5" />
                    </div>
                </button>
            ) : (
                <button
                    onClick={submitHandler}
                    className={`${
                        emailValidation.test(emailInputValue.trim()) &&
                        !emailInFirebase &&
                        fullNameInputValue.trim().length >= 6 &&
                        userNameInputValue.trim().length >= 6 &&
                        !userNameInFirebase &&
                        passwordInputValue.trim().length >= 10
                            ? "bg-lightBlue"
                            : "bg-lighertBlue/95 brightness-95 cursor-default"
                    } text-white relative p-3 py-1 w-[70%] rounded-md`}
                >
                    Sign up
                </button>
            )}
            {emailInFirebase && (
                <span className="text-darkRed text-center text-sm pt-2 w-[70%]">
                    Another account is using the same email.
                </span>
            )}
            {userNameInFirebase && (
                <span className="text-darkRed text-center text-sm pt-2 w-[70%]">
                    This username isn&#39;t available. Please try another.
                </span>
            )}
        </form>
    );
};

export default SignUpForm;
