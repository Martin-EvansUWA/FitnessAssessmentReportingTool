import { ReactNode } from "react";

const Sidebar = ({ content }: { content: ReactNode }) => {
    return <aside className="sidebar">{content}</aside>;
};

export default Sidebar;
