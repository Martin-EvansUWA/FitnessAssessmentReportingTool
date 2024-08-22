import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SidebarData } from "../interface/sidebarInterface";

const Sidebar = ({
    content,
    className,
}: {
    content: SidebarData;
    className?: string;
}) => {
    const [selectedSection, setSelectedSection] = useState<number | null>(null);

    const toggleSelectedSection = (index: number) => {
        setSelectedSection(index);
    };

    const selectedSectionStyling: string =
        "bg-uwa-yellow text-black font-bold rounded-md my-3";

    return (
        <aside
            className={
                "sidebar md:rounded-2xl p-5 bg-uwa-blue flex-col" +
                " " +
                className
            }
        >
            <div className="flex-grow">
                <h2 className="text-white font-bold">{content.title}</h2>
                <hr className="w-28 border-t-2 border-uwa-yellow my-2" />
                <div className="overflow-y-auto max-h-[42rem]">
                    {content.sections.map((section, index) => (
                        <ul key={index}>
                            {Object.entries(section).map(([key, value]) => (
                                <li
                                    key={key}
                                    className={
                                        selectedSection === index
                                            ? selectedSectionStyling
                                            : "my-3"
                                    }
                                >
                                    <button
                                        onClick={() => {
                                            toggleSelectedSection(index);
                                            value.sectionOnClick();
                                        }}
                                        className={
                                            selectedSection === index
                                                ? "text-black p-1"
                                                : "text-white p-1"
                                        }
                                    >
                                        {value.sectionName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
            <div className="mt-auto">
                <hr className="w-28 border-t-2 border-uwa-yellow my-2" />
                {content.footer.map((footerButton, index) => (
                    <button
                        key={index}
                        onClick={footerButton.onClick}
                        className="flex items-center text-white"
                    >
                        <FontAwesomeIcon icon={footerButton.fontAwesomeIcon} />
                        <p className="ml-2">{footerButton.text}</p>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
