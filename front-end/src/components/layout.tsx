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
        <div className="layout">
            <Sidebar content={sidebarContent} />
            <NavigationBar />
            <MainSection content={mainContent} />
        </div>
    );
};

export default Layout;
