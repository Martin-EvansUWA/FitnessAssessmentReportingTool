import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { backEndUrl } from "../global_helpers/constants";
import ForgotPassword from "./ForgotPassword";

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
    const [forgotPassword, setForgotPassword] = useState(false);

    const navigate = useNavigate();

    const redirectHandler = (isAdmin: boolean) => {
        if (isAdmin) {
            navigate("/admin-form-manager");
        } else {
            navigate("/student-form-manager");
        }
    };

    const cookieHandler = (response: {
        data: {
            access_token: string;
            isAdmin: boolean;
            user_first_name: string;
            user_last_name: string;
            user_email: string;
        };
    }) => {
        Cookies.set("access_token", response.data["access_token"], {
            expires: 1,
        });
        Cookies.set("isAdmin", response.data["isAdmin"].toString(), {
            expires: 1,
        });
        Cookies.set("user_first_name", response.data["user_first_name"], {
            expires: 1,
        });
        Cookies.set("user_last_name", response.data["user_last_name"], {
            expires: 1,
        });
        Cookies.set("user_email", response.data["user_email"], {
            expires: 1,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${backEndUrl}/login_user`,
                {
                    username: userID,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            cookieHandler(response);
            redirectHandler(response.data["isAdmin"]);
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
            {forgotPassword ? (
                <div className="flex justify-center items-center w-full h-full p-4">
                    <ForgotPassword setForgotPassword={setForgotPassword} />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full h-full p-4">
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
                        className="flex flex-col space-y-3 w-full md:w-[90%] md:w-2/3"
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
                                className="bg-uwa-blue font-bold text-white h-8 md:px-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="bg-uwa-yellow font-bold text-black h-8 md:px-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                                onClick={toggleIsLoginCallBack}
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    <a
                        href="#"
                        className="text-center underline text-gray-600 font-bold mt-5"
                        onClick={() => setForgotPassword(true)}
                    >
                        Forgot Password
                    </a>
                </div>
            )}

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
