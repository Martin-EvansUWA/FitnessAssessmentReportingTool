import { ReactNode } from "react";
import MainSection from "./mainSection";
import Sidebar from "./sidebar";

const Layout = ({
    sidebarContent,
    mainContent,
}: {
    sidebarContent: ReactNode;
    mainContent: ReactNode;
}) => {
    return (
        <div className="layout">
            <Sidebar content={sidebarContent} />
            <MainSection content={mainContent} />
        </div>
    );
};

export default Layout;
