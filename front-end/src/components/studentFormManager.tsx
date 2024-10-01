import {
    faChartSimple,
    faEdit,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { backEndUrl, dataEntryRedirectType } from "../global_helpers/constants";
import { HelperFunctions } from "../global_helpers/helperFunctions";

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

    const goToDataEntryPage = () => {
        const access_token = Cookies.get("access_token");
        if (factUserFormID) {
            const response = axios
                .get(
                    `${backEndUrl}/retrieve_user_form_response_from_fact_table/${factUserFormID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                )
                .then((response) => {
                    console.log("Success:", response.data);
                    navigate("/data-entry", {
                        state: {
                            type: dataEntryRedirectType.EDIT_FORM,
                            data: response.data,
                        },
                    }); // Redirect and pass form response data
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast.error("Failed to fetch form response!", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                    });
                });
        }
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
        <>
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
                                {HelperFunctions.prettierDate(formStartDate)}
                            </p>
                            <p>
                                <span className="font-bold">
                                    Completed/Updated:
                                </span>{" "}
                                {HelperFunctions.prettierDate(
                                    formCompletionDate
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <button
                        className="flex flex-col transform transition-transform duration-200 hover:scale-105"
                        onClick={goToDataEntryPage}
                    >
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="text-2xl md:text-4xl"
                        />
                        <span className="invisible md:visible font-bold">
                            Edit
                        </span>
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
                    <button className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105"
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    );
};

export default StudentFormManager;
