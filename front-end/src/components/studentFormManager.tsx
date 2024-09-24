import {
    faChartSimple,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StudentFormManager = ({
    formTitle,
    formDescription,
    formStartDate,
    formCompletionDate,
    formCreatedBy,
    formCreatedFor,
}: {
    formTitle: string;
    formDescription: string;
    formStartDate: string;
    formCompletionDate: string;
    formCreatedBy: string;
    formCreatedFor: string;
}) => {
    return (
        <div className="flex flex-col min-h-full justify-between">
            <div>
                <div>
                    <h1 className="text-2xl font-bold mb-5">{formTitle}</h1>
                    <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                    <div className="my-5">
                        <p className="font-bold">Description:</p>
                        <p>{formDescription}</p>
                    </div>
                    <div className="my-5 flex flex-col">
                        <p>
                            <span className="font-bold">Recorded By:</span>{" "}
                            {formCreatedBy}
                        </p>
                        <p>
                            <span className="font-bold">Recorded For:</span>{" "}
                            {formCreatedFor}
                        </p>
                    </div>
                    <div className="my-5 flex flex-col">
                        <p>
                            <span className="font-bold">Started:</span>{" "}
                            {formStartDate}
                        </p>
                        <p>
                            <span className="font-bold">
                                Completed/Updated:
                            </span>{" "}
                            {formCompletionDate}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <button className="flex flex-col">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="text-2xl md:text-4xl"
                    />
                    <span className="invisible md:visible font-bold">Edit</span>
                </button>
                <button className="flex flex-col items-center">
                    <FontAwesomeIcon
                        icon={faChartSimple}
                        className="text-2xl md:text-4xl"
                    />
                    <span className="invisible md:visible font-bold">
                        Dashboard
                    </span>
                </button>
                <button className="flex flex-col items-center">
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="text-2xl md:text-4xl"
                    />
                    <span className="invisible md:visible font-bold">
                        Delete
                    </span>
                </button>
            </div>
        </div>
    );
};

export default StudentFormManager;