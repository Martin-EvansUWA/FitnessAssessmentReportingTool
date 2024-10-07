import { useEffect, useState } from "react";

const AdmiinControl = () => {
    const [uwaIdGrant, setuwaIdGrant] = useState<string>("");
    const [uwaIdRevoke, setuwaIdRevoke] = useState<string>("");
    const [adminUserIds, setAdminUserIds] = useState<number[]>([]);

    useEffect(() => {
        // Fetch admin users
        console.log("Fetching admin users");
    }, []);

    const handleAdminPreivilegesGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Admin privileges granted");
    };
    const handleAdminPreivilegesRevoke = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Admin privileges revoked");
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
                            {adminUserIds.map((id) => (
                                <option key={id} value={id}>
                                    {id}
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
