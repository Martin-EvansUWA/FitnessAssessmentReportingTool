import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import uwaLogo from "../assets/uwa_logo.png";
import { NavigationBarProps } from "../interface/navigationBarInterface";

const NavigationBar: React.FC<NavigationBarProps> = ({
    className = "",
    setNavBarStatusProp,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
        setNavBarStatusProp && setNavBarStatusProp();
    };

    return (
        <div className={`${className}`}>
            <nav className="top-0 left-0 flex justify-between items-center pl-4 bg-white font-bold w-full h-16 z-10">
                <div className="flex items-center">
                    <Link to="/" className="inline-flex items-center">
                        <img src={uwaLogo} alt="UWA Logo" className="h-8" />
                        <span className="ml-5 text-uwa-blue text-sm md:text-base mr-10">
                            Fitness Assessment Reporting Tool
                        </span>
                    </Link>
                </div>
                <div className="hidden md:flex space-x-5 h-full items-center">
                    <a
                        href="#tutorial"
                        className="text-uwa-blue text-sm md:text-base"
                    >
                        Tutorial
                    </a>
                    <a
                        href="#about"
                        className="text-uwa-blue text-sm md:text-base"
                    >
                        Logout
                    </a>
                    <a className="flex flex-row items-center space-x-2 bg-uwa-blue h-full rounded-l-full pl-5">
                        <span className="text-white text-sm md:text-base">
                            Hello, Placeholder!
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
            </nav>
            {isMenuOpen && (
                <div className="md:hidden flex flex-col bg-uwa-blue mt-16 p-4 space-y-5 absolute top-0 right-0 z-10 w-full items-end">
                    <span className="text-white text-sm font-bold">
                        Hello, Placeholder!
                    </span>
                    <a
                        href="#tutorial"
                        onClick={toggleMenu}
                        className="text-sm text-white"
                    >
                        Tutorial
                    </a>
                    <a
                        href="#about"
                        onClick={toggleMenu}
                        className="text-sm text-white"
                    >
                        Logout
                    </a>
                </div>
            )}
        </div>
    );
};

export default NavigationBar;
