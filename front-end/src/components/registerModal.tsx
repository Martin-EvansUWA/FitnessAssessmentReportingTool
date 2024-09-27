import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { backEndUrl } from "../global_helpers/constants";

const text = "Hi, Nice to meet you!";
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

const RegisterModal = ({
    toggleIsLoginCallBack,
}: {
    toggleIsLoginCallBack: () => void;
}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userID, setUserID] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post(`${backEndUrl}/register`, {
                FirstName: firstName,
                LastName: lastName,
                UserID: userID,
                email: email,
                password: password,
            });
            if (response.status === 200) {
                console.log("Successful Registration: ", response);
                // Handle successful registration (e.g., redirect, show success message)
            }
        } catch (error) {
            // TODO: Place better error messages (eg. error id 409)
            console.log("Register failed: ", error);
            setError("Registration failed");
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
                    id="fname"
                    name="firstName"
                    placeholder="First Name"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    type="text"
                    id="lname"
                    name="lastName"
                    placeholder="Last Name"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    type="text"
                    id="number"
                    name="userID"
                    placeholder="UWA Student Number"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                />

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="UWA Email"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="flex flex-col space-y-2 justify-center md:flex-row md:space-x-5 md:space-y-0">
                    <button
                        type="submit"
                        className="bg-uwa-yellow text-black h-8 md:px-5 transform transition-transform duration-200 hover:scale-105"
                    >
                        Register
                    </button>
                </div>
            </form>

            <a
                href="#"
                className="text-center underline text-gray-600 font-bold mt-5"
                onClick={toggleIsLoginCallBack}
            >
                I have an account
            </a>
        </div>
    );
};

export default RegisterModal;
