import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { backEndUrl } from "../global_helpers/constants";

const text = "Reset Your Password!";
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

const ForgotPassword = ({ setForgotPassword }: { setForgotPassword: (state: boolean) => void }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [studentEmail, setStudentEmail] = useState("");

    const handleResetPassword = async () => {
        if (!firstName || !lastName || !studentNumber || !studentEmail) {
            toast.error("Please fill in all fields before submitting.");
            return;
        }

        try {
            const response = await axios.post(
                `${backEndUrl}/reset_password`,
                {
                    first_name: firstName,
                    last_name: lastName,
                    student_number: studentNumber,
                    student_email: studentEmail,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("access_token")}`,
                    },
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full p-4">
            {/* Title */}
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

            {/* Form Fields */}
            <input
                type="text"
                placeholder="First Name"
                className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl mb-4 w-full md:w-[70%]"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl mb-4 w-full md:w-[70%]"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Student Number"
                className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl mb-4 w-full md:w-[70%]"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
            />
            <input
                type="email"
                placeholder="Student Email"
                className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl mb-4 w-full md:w-[70%]"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
            />

            {/* Reset Password Button */}
            <button
                onClick={handleResetPassword}
                className="bg-uwa-yellow text-black font-bold text-sm w-1/2 h-8 rounded-xl transform transition-transform duration-200 hover:scale-105 mb-4"
            >
                Reset Password
            </button>

            {/* Return to Login */}
            <button
                className="text-uwa-blue underline mt-4"
                onClick={() => setForgotPassword(false)}
            >
                Return to Login
            </button>
        </div>
    );
};

export default ForgotPassword;
