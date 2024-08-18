import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SidebarData } from "../interface/sidebarInterface";
import Sidebar from "./sidebar";

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
        <div className={"flex flex-col " + className}>
            <div className="flex items-center justify-between h-14 bg-uwa-blue text-white font-bold">
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
                <div className="absolute flex-grow overflow-y-auto w-full mt-14">
                    <Sidebar content={content} />
                </div>
            )}
        </div>
    );
};

export default MobileSideBar;
