import {
    faChartSimple,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for making requests
import Cookies from "js-cookie"; // For handling tokens
import { toast } from "react-toastify"; // For notifications
import { backEndUrl } from "../global_helpers/constants"; // Assuming your backend URL is stored here

const StudentFormManager = ({
    formTitle,
    formDescription,
    formStartDate,
    formCompletionDate,
    formCreatedBy,
    formCreatedFor,
    factUserFormID,
}: {
    formTitle: string;
    formDescription: string;
    formStartDate: string;
    formCompletionDate: string;
    formCreatedBy: string;
    formCreatedFor: string;
    factUserFormID: number | null;
}) => {
    const navigate = useNavigate();

    const goToFormResults = () => {
        navigate("/form-results", { state: { factUserFormID, formTitle } });
    };

    // Function to handle deletion of the form response
    const deleteFormResponse = async () => {
        if (!factUserFormID) return;

        const access_token = Cookies.get("access_token");
        
        // Ask for user confirmation before deleting
        const confirmed = window.confirm("Are you sure you want to delete this form response?");
        if (!confirmed) return;

        try {
            await axios.delete(`${backEndUrl}/delete_form_response/${factUserFormID}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            toast.success("Form response deleted successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // Optionally, navigate to another page or refresh the form list
            navigate("/form-manager"); // Assuming you have a form manager page
        } catch (error) {
            console.error("Error deleting form response:", error);
            toast.error("Failed to delete form response!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-full justify-between">
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
                        <span className="font-bold">Completed/Updated:</span>{" "}
                        {formCompletionDate}
                    </p>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <button className="flex flex-col transform transition-transform duration-200 hover:scale-105">
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="text-2xl md:text-4xl"
                    />
                    <span className="invisible md:visible font-bold">Edit</span>
                </button>
                <button
                    className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105"
                    onClick={goToFormResults}
                >
                    <FontAwesomeIcon
                        icon={faChartSimple}
                        className="text-2xl md:text-4xl"
                    />
                    <span className="invisible md:visible font-bold">
                        Dashboard
                    </span>
                </button>
                <button
                    className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105"
                    onClick={deleteFormResponse}
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="text-2xl md:text-4xl text-red-500"
                    />
                    <span className="invisible md:visible font-bold text-red-500">
                        Delete
                    </span>
                </button>
            </div>
        </div>
    );
};

export default StudentFormManager;
