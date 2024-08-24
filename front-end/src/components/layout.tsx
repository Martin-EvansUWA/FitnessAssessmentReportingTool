import { useState } from "react";
import { LayoutProps } from "../interface/layoutInterface";
import MainSection from "./mainSection";
import MobileSideBar from "./mobileSideBar";
import NavigationBar from "./navigationBar";
import Sidebar from "./sidebar";

const Layout: React.FC<LayoutProps> = ({
    sidebarContent,
    mainContent,
    selectedSectionProp,
    setSelectedSectionProp,
}) => {
    const [isNavBarMenuOpen, setIsNavBarMenuOpen] = useState(false);

    const toggleNavBarMenu = () => {
        setIsNavBarMenuOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col h-screen">
            <NavigationBar
                className="z-50"
                setNavBarStatusProp={toggleNavBarMenu}
            />
            <MobileSideBar
                content={sidebarContent}
                className="flex md:hidden"
                isNavBarMenuOpen={isNavBarMenuOpen}
            />
            <div className="flex flex-1">
                <Sidebar
                    content={sidebarContent}
                    className="hidden md:flex w-96 ml-5 my-5"
                    selectedSectionProp={selectedSectionProp}
                    setSelectedSectionProp={setSelectedSectionProp}
                />
                <MainSection
                    content={mainContent}
                    className="w-full md:mx-5 md:my-5"
                />
            </div>
        </div>
    );
};

export default Layout;
