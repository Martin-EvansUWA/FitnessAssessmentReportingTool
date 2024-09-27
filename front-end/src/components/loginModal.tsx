import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useState } from "react";
import { backEndUrl } from "../global_helpers/constants";

const text = "Hello Again!";
const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
};

const childVariants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
    },
    hidden: {
        opacity: 0,
        y: 20,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
    },
};

const LoginModal = ({
    toggleIsLoginCallBack,
}: {
    toggleIsLoginCallBack: () => void;
}) => {
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${backEndUrl}/login_user`,
                {
                    grant_type: "",
                    username: userID,
                    password: password,
                    scope: "",
                    client_id: "",
                    client_secret: "",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            Cookies.set("access_token", response.data["access_token"], {
                expires: 1,
            });
            console.log("Successful Login: ", response);
        } catch (error) {
            console.log("Failed to Login: ", error);
        }
    };

    return (
        <div className="flex flex-col">
            <motion.h2
                className="text-4xl font-bold text-center mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {text.split("").map((char, index) => (
                    <motion.span key={index} variants={childVariants}>
                        {char}
                    </motion.span>
                ))}
            </motion.h2>

            <form
                className="flex flex-col space-y-3 w-[90%] md:w-2/3 m-auto"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    id="userID"
                    name="userID"
                    placeholder="UWA ID"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex flex-col space-y-2 justify-center md:flex-row md:space-x-5 md:space-y-0">
                    <button
                        type="submit"
                        className="bg-uwa-blue text-white h-8 md:px-5 transform transition-transform duration-200 hover:scale-105"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="bg-uwa-yellow text-black h-8 md:px-5 transform transition-transform duration-200 hover:scale-105"
                        onClick={toggleIsLoginCallBack}
                    >
                        Register
                    </button>
                </div>
            </form>

            <a
                href="#"
                className="text-center underline text-gray-600 font-bold mt-5"
            >
                Forgot Password
            </a>
        </div>
    );
};

export default LoginModal;
