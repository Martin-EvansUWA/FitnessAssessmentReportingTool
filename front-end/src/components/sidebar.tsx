import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarData } from "../interface/sidebarInterface";

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
                "sidebar w-full md:rounded-2xl p-5 bg-uwa-blue flex-col" +
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
            <div className="mt-auto">
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
