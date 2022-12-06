import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { ClassNameInterface } from "../../../interfaces/interfaces";
import { ModeInterFace } from "../../../interfaces/interfaces";

//
declare module "framer-motion" {
    export interface AnimatePresenceProps {
        children?: React.ReactNode;
    }
}

const LeftSide = (props: ClassNameInterface & ModeInterFace) => {
    const { className, mode } = props;

    const [imgNumber, setImgNumber] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (imgNumber < 4) {
                setImgNumber((prevState) => prevState + 1);
            } else {
                setImgNumber(1);
            }
        }, 5000);
    }, [imgNumber]);

    return (
        <div className={`${className} h-full w-full`}>
            <div className="w-full h-full flex justify-end items-start">
                <div className=" w-96 h-[670px] relative">
                    <Image
                        src={`/images/signin/light_mode_signin.png`}
                        layout="fill"
                        className="object-contain"
                        alt={"sinin model"}
                        priority
                    />
                    <div className="absolute right-5 top-[71px] w-[250px] h-[538px] rounded-3xl overflow-hidden">
                        <div className="absolute top-6 left-0 w-full h-full bg-dark"></div>
                        <div className="relative h-full w-full">
                            <Image
                                src={`/images/signin/${imgNumber}.png`}
                                layout="fill"
                                className="object-contain"
                                alt={"sign in image"}
                                priority
                            />
                            <AnimatePresence>
                                {imgNumber === 1 && (
                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                        }}
                                    >
                                        {imgNumber === 1 && (
                                            <Image
                                                src={`/images/signin/1.png`}
                                                layout="fill"
                                                className="object-contain zeroOpacit"
                                                alt={"sign in image"}
                                                priority
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {imgNumber === 2 && (
                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                        }}
                                    >
                                        {imgNumber === 2 && (
                                            <Image
                                                src={`/images/signin/2.png`}
                                                layout="fill"
                                                className="object-contain zeroOpacit"
                                                alt={"sign in image"}
                                                priority
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {imgNumber === 3 && (
                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                        }}
                                    >
                                        {imgNumber === 3 && (
                                            <Image
                                                src={`/images/signin/3.png`}
                                                layout="fill"
                                                className="object-contain zeroOpacit"
                                                alt={"sign in image"}
                                                priority
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {imgNumber === 4 && (
                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 1.5,
                                        }}
                                    >
                                        {imgNumber === 4 && (
                                            <Image
                                                src={`/images/signin/4.png`}
                                                layout="fill"
                                                className="object-contain zeroOpacit"
                                                alt={"sign in image"}
                                                priority
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSide;
