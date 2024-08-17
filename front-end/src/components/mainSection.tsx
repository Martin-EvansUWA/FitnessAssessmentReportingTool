import { ReactNode } from "react";

const MainSection = ({ content }: { content: ReactNode }) => {
    return <main className="main-section">{content}</main>;
};

export default MainSection;
