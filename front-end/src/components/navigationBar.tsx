import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uwaLogo from "../assets/uwa_logo.png";
import { NavigationBarProps } from "../interface/navigationBarInterface";

const NavigationBar: React.FC<NavigationBarProps> = ({
    className = "",
    setNavBarStatusProp,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [homePage, setHomePage] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const access_token = Cookies.get("access_token");
        if (access_token) {
            setIsLoggedIn(true);
            const isAdmin = Cookies.get("isAdmin");
            if (isAdmin === "true") {
                setHomePage("/admin-form-manager");
            } else {
                setHomePage("/student-form-manager");
            }

            const firstName = Cookies.get("user_first_name");
            setUserFirstName(firstName || "User");
        }
    }, [navigate]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
        setNavBarStatusProp && setNavBarStatusProp();
    };

    const handleLogout = async () => {
        try {
            Cookies.remove("access_token");
            Cookies.remove("isAdmin");
            Cookies.remove("user_first_name");
            Cookies.remove("user_last_name");
            navigate("/");
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <div className={`${className}`}>
            <nav className="top-0 left-0 flex justify-between items-center pl-4 bg-white font-bold w-full h-16 z-10">
                <div className="flex items-center">
                    <Link to={homePage} className="inline-flex items-center">
                        <img src={uwaLogo} alt="UWA Logo" className="h-8" />
                        <span className="ml-5 text-uwa-blue text-sm md:text-base mr-10">
                            Fitness Assessment Reporting Tool
                        </span>
                    </Link>
                </div>
                {isLoggedIn && (
                    <>
                        <div className="hidden md:flex space-x-5 h-full items-center">
                            <button
                                className="text-uwa-blue text-sm md:text-base"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <a className="flex flex-row items-center space-x-2 bg-uwa-blue h-full rounded-l-full pl-5">
                                <span className="text-white text-sm md:text-base">
                                    Hello, {userFirstName}!
                                </span>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-3xl text-white pr-5"
                                />
                            </a>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button
                                title="navigation-button"
                                onClick={toggleMenu}
                                className="focus:outline-none text-uwa-blue m-5"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </nav>
            {isMenuOpen && (
                <div className="md:hidden flex flex-col bg-uwa-blue mt-16 p-4 space-y-5 absolute top-0 right-0 z-10 w-full items-end">
                    <span className="text-white text-sm font-bold">
                        Hello, {userFirstName}!
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-white"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavigationBar;
