import { faHome } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const ProfilePageSidebarSection = {
    MY_DETAILS: 0,
    CHANGE_PASSWORD: 1,
    ADMIN_CONTROL: 2,
};

const ProfilePage = () => {
    const [mainContent, setMainContent] = useState<JSX.Element | null>(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const firstName = Cookies.get("user_first_name");
        setUserFirstName(firstName || "User");
        const adminStatus = Cookies.get("isAdmin");
        setIsAdmin(adminStatus === "true");
    }, []);

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
                        setMainContent(
                            <div>
                                <p>My Details</p>
                            </div>
                        );
                    },
                },
            },
            {
                "Change Password": {
                    sectionName: "Change Password",
                    sectionOnClick: () => {
                        setMainContent(
                            <div>
                                <p>Change Password</p>
                            </div>
                        );
                    },
                },
            },
            isAdmin
                ? {
                      "Admin Control": {
                          sectionName: "Admin Control",
                          sectionOnClick: () => {
                              setMainContent(
                                  <div>
                                      <p>Admin Control</p>
                                  </div>
                              );
                          },
                      },
                  }
                : {},
        ],
    };

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

    return (
        <>
            <Layout
                sidebarContent={sidebarContent}
                mainContent={
                    <div className="flex flex-col">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-5">
                                {isAdmin ? "Admin Profile" : "Student Profile"}
                            </h1>
                            <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                            <div className="my-5">
                                {mainContent || defaultContent}
                            </div>
                        </div>
                    </div>
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
