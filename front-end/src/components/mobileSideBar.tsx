import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarData } from "../interface/sidebarInterface";

const MobileSideBar = ({
    content,
    className,
}: {
    content: SidebarData;
    className?: string;
}) => {
    return (
        <div
            className={
                "flex-col items-center justify-center h-14 bg-uwa-blue text-white font-bold" +
                " " +
                className
            }
        >
            <button>
                {content.title}
                <FontAwesomeIcon
                    icon={faChevronCircleDown}
                    className="ml-2 text-xl"
                />
            </button>
        </div>
    );
};

export default MobileSideBar;
