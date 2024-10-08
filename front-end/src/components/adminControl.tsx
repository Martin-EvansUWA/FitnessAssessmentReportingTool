import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { backEndUrl } from "../global_helpers/constants";

interface AdminDetails {
    FirstName: string;
    LastName: string;
    UserID: number;
    Email: string;
}

const AdmiinControl = () => {
    const [uwaIdGrant, setuwaIdGrant] = useState<string>("");
    const [uwaIdRevoke, setuwaIdRevoke] = useState<string>("");
    const [adminUsers, setAdminUsers] = useState<AdminDetails[]>([]);

    useEffect(() => {
        const fetchAdminUsers = async () => {
            // Fetch admin users
            try {
                const access_token = Cookies.get("access_token");
                if (!access_token) {
                    throw new Error("Access token not found");
                }
                const response = await axios.get<AdminDetails[]>(
                    `${backEndUrl}/get_all_admin_users`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                console.log("Admin users:", response.data);
                setAdminUsers(response.data);
            } catch (error) {
                console.error("Error fetching admin users", error);
                toast.error("Error fetching admin user details.", {
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

        fetchAdminUsers();
    }, []);

    const handleAdminPreivilegesGrant = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const access_token = Cookies.get("access_token");
            if (!access_token) {
                throw new Error("Access token not found");
            }
            const response = await axios.post(
                `${backEndUrl}/grant_admin_access/${uwaIdGrant}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Admin privileges granted successfully!", {
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
                setuwaIdGrant("");
            }
        } catch (error) {
            console.error("Error granting admin privileges:", error);
            toast.error("Failed to grant admin privileges. Please try again.", {
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

    const handleAdminPreivilegesRevoke = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const access_token = Cookies.get("access_token");
            if (!access_token) {
                throw new Error("Access token not found");
            }
            const response = await axios.post(
                `${backEndUrl}/revoke_admin_access/${uwaIdRevoke}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Admin privileges revoked successfully!", {
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
                setuwaIdRevoke("");
            }
        } catch (error) {
            console.error("Error revoking admin privileges:", error);
            toast.error(
                "Failed to revoke admin privileges. Please try again.",
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
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-5">Admin Control</h1>
                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                <div className="my-5">
                    <p>
                        This is a page for admin control. It is only accessible
                        to users with admin privileges.
                    </p>
                    <form
                        className="flex flex-col mt-5 w-full md:w-[20rem]"
                        onSubmit={handleAdminPreivilegesGrant}
                    >
                        <label htmlFor="adminPrivileges" className="font-bold">
                            Grant Admin Privileges to User:
                        </label>
                        <input
                            type="text"
                            id="adminPrivilegesGrant"
                            name="adminPrivilegesGrant"
                            placeholder="UWA ID"
                            className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                            value={uwaIdGrant}
                            onChange={(e) => setuwaIdGrant(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-uwa-yellow font-bold h-8 mt-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        >
                            Grant Admin Privileges
                        </button>
                    </form>

                    <form
                        className="flex flex-col mt-5 w-full md:w-[20rem]"
                        onSubmit={handleAdminPreivilegesRevoke}
                    >
                        <label
                            htmlFor="adminPrivilegesRevoke"
                            className="font-bold"
                        >
                            Revoke Admin Privileges from User:
                        </label>
                        {/* Dropdown */}
                        <select
                            id="adminPrivilegesRevoke"
                            name="adminPrivilegesRevoke"
                            className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                            value={uwaIdRevoke}
                            onChange={(e) => setuwaIdRevoke(e.target.value)}
                        >
                            <option disabled value="">
                                - select admin -
                            </option>
                            {adminUsers.map((adminUser) => (
                                <option
                                    key={adminUser.UserID}
                                    value={adminUser.UserID}
                                >
                                    {adminUser.FirstName} {adminUser.LastName} (
                                    {adminUser.Email})
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="bg-uwa-blue text-white font-bold h-8 mt-5 transform transition-transform duration-200 hover:scale-105 rounded-xl"
                        >
                            Revoke Admin Privileges
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AdmiinControl;
