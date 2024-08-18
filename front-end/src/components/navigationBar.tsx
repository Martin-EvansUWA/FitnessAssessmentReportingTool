import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import uwaLogo from "../assets/uwa_logo.png";

const NavigationBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((isMenuOpen) => !isMenuOpen);
    };

    return (
        <>
            <div className="relative w-full h-16">
                <nav className="flex justify-between items-center px-4 bg-uwa-blue rounded-full font-bold w-full h-16">
                    <div className="ml-auto flex items-center space-x-2">
                        <span className="text-white">
                            Hello, Placeholder12345678!
                        </span>
                        <FontAwesomeIcon
                            icon={faUser}
                            className="text-3xl text-white"
                        />
                    </div>
                </nav>
                <nav className="absolute top-0 left-0 flex justify-between items-center px-4 bg-white rounded-full font-bold lg:w-[80%] h-16 z-10">
                    <div className="flex items-center">
                        <a
                            href="#landing-page"
                            className="inline-flex items-center"
                        >
                            <img src={uwaLogo} alt="UWA Logo" className="h-8" />
                            <span className="ml-5 text-uwa-blue">
                                Fitness Assessment Reporting Tool
                            </span>
                        </a>
                    </div>
                    <div className="hidden md:flex space-x-10 h-full items-center">
                        <a href="#tutorial" className="text-uwa-blue">
                            Tutorial
                        </a>
                        <a href="#about" className="text-uwa-blue">
                            Logout
                        </a>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            title="navigation-button"
                            onClick={toggleMenu}
                            className="focus:outline-none"
                        >
                            {/* Asset from W3C for menu icon. Change in future if needed */}
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
                    <div className="md:hidden flex flex-col items-center bg-white border-solid border-2 border-black rounded-lg mt-2 p-4 space-y-4 float-right mx-1">
                        <a href="#tutorial" onClick={toggleMenu}>
                            Tutorial
                        </a>
                        <a href="#about" onClick={toggleMenu}>
                            Logout
                        </a>
                    </div>
                )}
            </div>
        </>
    );
};

export default NavigationBar;
