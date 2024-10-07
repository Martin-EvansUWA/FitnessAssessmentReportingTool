import { faHome } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import ChangePassword from "../components/changePassword";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const ProfilePage = () => {
    const [mainContent, setMainContent] = useState<JSX.Element | null>(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const adminStatus = Cookies.get("isAdmin");
        setIsAdmin(adminStatus === "true");
        const firstName = Cookies.get("user_first_name");
        setUserFirstName(firstName || "User");
        const lastName = Cookies.get("user_last_name");
        setUserLastName(lastName || "");
        const email = Cookies.get("user_email");
        setUserEmail(email || "");
    }, []);

    const defaultContent = (
        <>
            {isAdmin ? (
                <>
                    <p className="my-5">
                        Welcome to your profile, {userFirstName}! You have admin
                        privileges.
                    </p>
                    <p className="my-5">
                        Here you can view and edit your personal details and
                        manage admin privileges for other users.
                    </p>
                </>
            ) : (
                <>
                    <p className="my-5">
                        Welcome to your profile, {userFirstName}! Here you can
                        view and edit your personal details.
                    </p>
                </>
            )}
        </>
    );

    const userDetailContent = (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-5">My Details</h1>
                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                <div className="flex flex-col my-5">
                    <p>
                        <span className="font-bold">First Name:</span>{" "}
                        {userFirstName}
                    </p>
                    <p>
                        <span className="font-bold">Last Name:</span>{" "}
                        {userLastName}
                    </p>
                    <p>
                        <span className="font-bold">Email:</span> {userEmail}
                    </p>
                </div>
            </div>
        </div>
    );

    const adminControlContent = (
        <div className="flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-5">Admin Control</h1>
                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                <div className="my-5"></div>
            </div>
        </div>
    );

    const sidebarContent: SidebarData = {
        title: "My Profile",
        titleOnClick: () => {
            setMainContent(null);
        },
        footer: [
            {
                text: isAdmin
                    ? "Return to Form Template Manager"
                    : "Return to Form Manager",
                fontAwesomeIcon: faHome,
                onClick: () => {
                    isAdmin
                        ? navigate("/admin-form-manager")
                        : navigate("/student-form-manager");
                },
            },
        ],
        sections: [
            {
                "My Details": {
                    sectionName: "My Details",
                    sectionOnClick: () => {
                        setMainContent(userDetailContent);
                    },
                },
            },
            {
                "Change Password": {
                    sectionName: "Change Password",
                    sectionOnClick: () => {
                        setMainContent(<ChangePassword />);
                    },
                },
            },
            isAdmin
                ? {
                      "Admin Control": {
                          sectionName: "Admin Control",
                          sectionOnClick: () => {
                              setMainContent(adminControlContent);
                          },
                      },
                  }
                : {},
        ],
    };

    return (
        <>
            <Layout
                sidebarContent={sidebarContent}
                mainContent={
                    mainContent || (
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-5">
                                    {isAdmin
                                        ? "Admin Profile"
                                        : "Student Profile"}
                                </h1>
                                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                                <div className="my-5">{defaultContent}</div>
                            </div>
                        </div>
                    )
                }
            />
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

export default ProfilePage;
