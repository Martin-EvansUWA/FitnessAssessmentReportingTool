import { ReactNode } from "react";
import { SidebarData } from "../interface/sidebarInterface";
import MainSection from "./mainSection";
import NavigationBar from "./navigationBar";
import Sidebar from "./sidebar";

const Layout = ({
    sidebarContent,
    mainContent,
}: {
    sidebarContent: SidebarData;
    mainContent: ReactNode;
}) => {
    return (
        <div className="flex flex-col h-screen">
            <NavigationBar />
            <div className="flex flex-1">
                <Sidebar content={sidebarContent} className="w-1/4" />
                <MainSection content={mainContent} className="w-3/4" />
            </div>
        </div>
    );
};

export default Layout;
