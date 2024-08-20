import { ReactNode } from "react";

const MainSection = ({
    content,
    className,
}: {
    content: ReactNode;
    className?: string;
}) => {
    return (
        <main className={"md:rounded-2xl p-5 bg-white" + " " + className}>
            {content}
        </main>
    );
};

export default MainSection;
