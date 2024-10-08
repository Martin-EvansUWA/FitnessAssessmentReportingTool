import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bounce, toast } from "react-toastify";
import { backEndUrl } from "../global_helpers/constants";

const ResetStudentPassword = () => {
    const [studentId, setStudentId] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        // Input validation: Check if fields are empty
        if (!studentId || !newPassword) {
            toast.error("Please fill in both the Student ID and New Password fields.", {
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
            return; // Do not proceed if validation fails
        }

        try {
            const access_token = Cookies.get("access_token");
            if (!access_token) {
                throw new Error("Access token not found");
            }

            const response = await axios.post(
                `${backEndUrl}/reset_student_password`,
                { student_id: studentId, new_password: newPassword },  
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            

            if (response.status === 200) {
                toast.success("Student password reset successfully!", {
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
                setStudentId("");
                setNewPassword(""); // Clear inputs after success
            }
        } catch (error) {
            console.error("Error resetting student password:", error);
            toast.error("Failed to reset student password. Please try again.", {
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
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-5">Reset Student Password</h1>
                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                <form
                    className="flex flex-col mt-5 w-full md:w-[20rem]"
                    onSubmit={handlePasswordReset}
                >
                    <label htmlFor="studentId" className="font-bold">
                        Enter Student ID:
                    </label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        placeholder="Student ID"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                    <label htmlFor="newPassword" className="font-bold mt-4">
                        Enter New Password:
                    </label>
                    <input
                        type="text"
                        id="newPassword"
                        name="newPassword"
                        placeholder="New Password"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-uwa-yellow font-bold h-8 mt-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetStudentPassword;
