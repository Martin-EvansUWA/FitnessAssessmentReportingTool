import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
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
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${backEndUrl}/login_user`,
                {
                    grant_type: "", // Optional Field
                    username: userID, // Required Field
                    password: password, // Required Field
                    scope: "", // Optional Field
                    client_id: "", // Optional Field
                    client_secret: "", // Optional Field
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
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                switch (error.response.status) {
                    case 401:
                        setError("Incorrect username or password");
                        toast.error("Incorrect username or password", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                        });
                        break;
                    case 400:
                        setError("Bad request. Please check your input.");
                        toast.error("Bad request. Please check your input.", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                        });
                        break;
                    case 500:
                        setError(
                            "Internal server error. Please try again later."
                        );
                        toast.error(
                            "Internal server error. Please try again later.",
                            {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                transition: Bounce,
                            }
                        );
                        break;
                    default:
                        setError("Login failed. Please try again.");
                        toast.error("Login failed. Please try again.", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            transition: Bounce,
                        });
                }
            } else {
                setError("An unexpected error occurred. Please try again.");
                toast.error("An unexpected error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }
            console.log("Failed to Login: ", error);
        }
    };

    return (
        <>
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
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                    />

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-500 text-center mt-2 animate-pulse">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col space-y-2 justify-center md:flex-row md:space-x-5 md:space-y-0">
                        <button
                            type="submit"
                            className="bg-uwa-blue text-white h-8 md:px-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className="bg-uwa-yellow text-black h-8 md:px-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    );
};

export default LoginModal;
