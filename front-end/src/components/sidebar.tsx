import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarData } from "../interface/sidebarInterface";

const dummySidebarData: SidebarData = {
    title: "Form Manager",
    footer: {
        text: "Create a new form",
        fontAwesomeIcon: faPlus,
        onClick: () => {
            console.log("Footer button clicked");
        },
    },
    sections: [
        {
            "SSEH2201 - Sem 1 2024": {
                sectionName: "SSEH2201 - Sem 1 2024",
                sectionLink: "/get-form-content/SSEH2201-Sem1-2024",
                sectionOnClick: () => {
                    console.log("SSEH2201 - Sem 1 2024 clicked");
                },
            },
            "SSEH3301 - Sem 2 2023": {
                sectionName: "SSEH3301 - Sem 2 2023",
                sectionLink: "/get-form-content/SSEH3301-Sem2-2023",
                sectionOnClick: () => {
                    console.log("SSEH3301 - Sem 2 2023 clicked");
                },
            },
        },
    ],
};

const Sidebar = ({
    content,
    className,
}: {
    content: SidebarData;
    className?: string;
}) => {
    return (
        <aside
            className={
                "sidebar w-full rounded-2xl p-5 bg-uwa-blue grid grid-rows-10 grid-flow-col gap-4" +
                " " +
                className
            }
        >
            <div className="row-start-1 row-end-10">
                <h2 className="text-white font-bold">{content.title}</h2>
                <hr className="w-28 border-t-2 border-uwa-yellow my-2" />
                <div>
                    {content.sections.map((section, index) => (
                        <ul key={index}>
                            {Object.entries(section).map(([key, value]) => (
                                <li key={key} className="my-3">
                                    <button
                                        onClick={value.sectionOnClick}
                                        className="text-white"
                                    >
                                        {value.sectionName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
            <div className="row-start-10">
                <hr className="w-28 border-t-2 border-uwa-yellow my-2" />
                <button
                    onClick={content.footer.onClick}
                    className="text-white font-bold flex items-end"
                >
                    {content.footer.text}
                    <FontAwesomeIcon
                        icon={content.footer.fontAwesomeIcon}
                        className="ml-2 text-xl"
                    />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
