import { ReactNode } from "react";

const MainSection = ({ content }: { content: ReactNode }) => {
    return (
        <main className="border-2 border-black rounded-lg p-5 bg-white">
            {content}
        </main>
    );
};

export default MainSection;
