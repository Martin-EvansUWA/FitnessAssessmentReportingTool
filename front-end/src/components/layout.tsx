import { ReactNode } from "react";
import { SidebarData } from "../interface/sidebarInterface";
import MainSection from "./mainSection";
import MobileSideBar from "./mobileSideBar";
import NavigationBar from "./navigationBar";
import Sidebar from "./sidebar";

// Generic layout component that takes in sidebar content and main content to create a page layout
const Layout = ({
    sidebarContent,
    mainContent,
}: {
    sidebarContent: SidebarData;
    mainContent: ReactNode;
}) => {
    return (
        <div className="flex flex-col h-screen">
            <NavigationBar className="" />
            <MobileSideBar
                content={sidebarContent}
                className="flex md:hidden"
            />
            <div className="flex flex-1 md:mx-[5%] lg:mx-[10%]">
                <Sidebar
                    content={sidebarContent}
                    className="hidden md:flex w-96 ml-5 my-5"
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
