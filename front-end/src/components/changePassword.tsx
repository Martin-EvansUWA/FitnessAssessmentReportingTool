import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { backEndUrl } from "../global_helpers/constants";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match. Please try again.", {
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
            return;
        }

        try {
            const access_token = Cookies.get("access_token");
            const response = await axios.post(
                `${backEndUrl}/change_password`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Password changed successfully!", {
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
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            }
        } catch (error) {
            console.log("Error changing password:", error);
            toast.error("Failed to change password. Please try again.", {
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
                <h1 className="text-2xl font-bold mb-5">Change Password</h1>
                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                <form
                    className="flex flex-col mt-5 w-full md:w-[20rem]"
                    onSubmit={handleChangePassword}
                >
                    <label htmlFor="currentPassword" className="font-bold">
                        Current Password:
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Current Password"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={currentPassword}
                        onChange={(e) => {
                            setCurrentPassword(e.target.value);
                        }}
                    />
                    <label htmlFor="newPassword" className="font-bold">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="New Password"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label htmlFor="confirmNewPassword" className="font-bold">
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        placeholder="Confirm New Password"
                        className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-uwa-yellow font-bold h-8 md:px-5 mt-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
