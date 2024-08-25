import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { MobileSideBarProps } from "../interface/mobileSidebarInterface";
import Sidebar from "./sidebar";

const MobileSideBar: React.FC<MobileSideBarProps> = ({
    content,
    className = "",
    isNavBarMenuOpen = false,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isNavBarMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [isNavBarMenuOpen]);

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center justify-between h-14 bg-uwa-blue text-white font-bold z-20">
                <button
                    onClick={toggleMenu}
                    className="flex flex-col items-center justify-center w-full h-full"
                >
                    {content.title}
                    <FontAwesomeIcon
                        icon={isMenuOpen ? faCaretUp : faCaretDown}
                        className="ml-2 text-xl"
                    />
                </button>
            </div>
            {isMenuOpen && (
                <div>
                    <div className="absolute flex-grow overflow-y-auto w-full z-20">
                        <Sidebar content={content} />
                    </div>
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-10 cursor-pointer"
                        onClick={toggleMenu}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default MobileSideBar;
