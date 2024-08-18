import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SidebarData } from "../interface/sidebarInterface";

const MobileSideBar = ({
    content,
    className,
}: {
    content: SidebarData;
    className?: string;
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((isMenuOpen) => !isMenuOpen);
    };

    return (
        <div
            className={
                "flex-col items-center justify-center h-14 bg-uwa-blue text-white font-bold" +
                " " +
                className
            }
        >
            <button
                onClick={toggleMenu}
                className="flex flex-col justify-center items-center w-full h-full"
            >
                {content.title}
                {isMenuOpen && (
                    <FontAwesomeIcon
                        icon={faCaretUp}
                        className="ml-2 text-xl"
                    />
                )}
                {!isMenuOpen && (
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        className="ml-2 text-xl"
                    />
                )}
            </button>
        </div>
    );
};

export default MobileSideBar;
