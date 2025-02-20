import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import FormTemplateGenerator from "../components/formTemplateGenerator";
import Layout from "../components/layout";
import { backEndUrl } from "../global_helpers/constants";
import {
    FormDetails,
    formHistorySidebarInfoAdmin,
    FormSubmission,
    SidebarData,
    SidebarSection,
    SpecificStudentData,
} from "../interface/sidebarInterface";

const AdminFormManagerPage = () => {
    const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(
        []
    );
    const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
    const [specificStudentData, setSpecificStudentData] =
        useState<SpecificStudentData | null>(null);
    const [showStudentPopup, setShowStudentPopup] = useState(false);
    const [studentDataError, setStudentDataError] = useState<string | null>(
        null
    );
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [selectedSubmissions, setSelectedSubmissions] = useState<
        { user_id: number; submission_time: string }[]
    >([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [fetchedFormHistory, setFetchedFormHistory] = useState<
        formHistorySidebarInfoAdmin[]
    >([]);
    const [addNewFormSelected, setAddNewFormSelected] =
        useState<boolean>(false);
    const [createNewFormTemplateView, setCreateNewFormTemplateView] =
        useState<boolean>(false);

    const viewAdminFormManagerDefault = () => {
        setSelectedFormId(null);
        setFormDetails(null);
        setCreateNewFormTemplateView(false);
    };
    const [selectAll, setSelectAll] = useState(false);

    const baseSidebar: SidebarData = {
        title: "My Form Templates",
        titleOnClick: () => {
            viewAdminFormManagerDefault();
        },
        footer: [
            {
                text: "Create new form template",
                fontAwesomeIcon: faPlus,
                onClick: () => {
                    setCreateNewFormTemplateView(true);
                },
            },
        ],
        sections: [] as SidebarSection[],
    };

    const [sidebarData, setSidebarData] = useState<SidebarData>({
        ...baseSidebar,
        sections: [] as SidebarSection[],
    });

    const fetchFormData = async (formTemplateId: number) => {
        const access_token = Cookies.get("access_token");
        try {
            const response = await axios.get(
                `${backEndUrl}/read_form_submissions/${formTemplateId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setFormDetails(response.data.form_details as FormDetails);
            setFormSubmissions(response.data.submissions as FormSubmission[]);
        } catch (error) {
            console.error(
                "Error fetching form details and submissions:",
                error
            );
            toast.error("Failed to fetch form details and submissions!", {
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
        }
    };

    const fetchSpecificStudentData = async (
        subject_ID: number,
        formId: number
    ) => {
        const access_token = Cookies.get("access_token");
        try {
            const response = await axios.get(
                `${backEndUrl}/specific_student_data_pop_up/${subject_ID}/${formId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (response.data) {
                setSpecificStudentData(response.data);
                setStudentDataError(null);
            } else {
                setStudentDataError("No data available for this student.");
                setSpecificStudentData(null);
            }
            setShowStudentPopup(true);
        } catch (error) {
            console.error("Error fetching specific student data:", error);
            toast.error("Failed to fetch student data!", {
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
            setStudentDataError(
                "Error fetching student data. Please try again later."
            );
            setSpecificStudentData(null);
            setShowStudentPopup(true);
        }
    };

    const handleRowDoubleClick = (submission: FormSubmission) => {
        if (formDetails) {
            fetchSpecificStudentData(
                submission.subject_ID,
                formDetails.form_template_id
            );
        }
    };

    const getFormHistory = async () => {
        const access_token = Cookies.get("access_token");
        try {
            const response = await axios.get(
                `${backEndUrl}/retrieve_admin_sidebar_info`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setFetchedFormHistory(response.data);
            console.log("Fetched form history:", response.data);

            const sections: SidebarSection[] = response.data.map(
                (form: formHistorySidebarInfoAdmin) => ({
                    [form.FormTemplateID]: {
                        sectionName: `${form.Title} [${new Date(
                            form.CreatedAt
                        ).toLocaleString()}]`,
                        sectionOnClick: () => {
                            setAddNewFormSelected(false);
                            setSelectedFormId(form.FormTemplateID);
                            setFormSubmissions([]); // Clear previous submissions
                            fetchFormData(form.FormTemplateID); // Fetch form data for the selected form ID
                        },
                    },
                })
            );

            return sections;
        } catch (error) {
            console.error("Error fetching form history:", error);
            toast.error("Failed to fetch your form history!", {
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
            return [];
        }
    };

    const buildSidebarData = (formHistory: SidebarSection[]) => {
        return {
            ...baseSidebar,
            sections: formHistory,
        };
    };

    // Callback function to be used when user clicks on a form in the sidebar
    const viewIndividualForm = (formId: string) => {
        setSelectedFormId(parseInt(formId));
        setFormSubmissions([]); // Clear previous submissions
        fetchFormData(parseInt(formId)); // Fetch form data for the selected form ID
        setCreateNewFormTemplateView(false);
    };

    const updateFormTemplateHistory = async () => {
        const formHistory = await getFormHistory();
        const newFormHistory = formHistory.map((form) => {
            const formId = Object.keys(form)[0];
            return {
                [formId]: {
                    ...form[formId],
                    sectionOnClick: () => {
                        viewIndividualForm(formId);
                    },
                },
            };
        });
        setSidebarData(buildSidebarData(newFormHistory));
    };

    useEffect(() => {
        updateFormTemplateHistory();
    }, []);

    const handleDeleteTemplate = async () => {
        if (!formDetails) return;

        if (
            !window.confirm(
                "Are you sure you want to delete this form template and all attached responses?"
            )
        ) {
            return;
        }

        const access_token = Cookies.get("access_token");
        try {
            await axios.delete(
                `${backEndUrl}/form-template-delete/${formDetails.form_template_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            setFormDetails(null);
            setFormSubmissions([]);
        } catch (error) {
            console.error("Error deleting form template:", error);
            toast.error("Failed to delete form template!", {
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
        }
    };

    const handleCheckboxChange = (submission: FormSubmission) => {
        const { user_id, submission_time } = submission;
        setSelectedSubmissions((prevSelected) => {
            const isSelected = prevSelected.some(
                (sub) =>
                    sub.user_id === user_id &&
                    sub.submission_time === submission_time
            );
            if (isSelected) {
                return prevSelected.filter(
                    (sub) =>
                        !(
                            sub.user_id === user_id &&
                            sub.submission_time === submission_time
                        )
                );
            } else {
                return [...prevSelected, { user_id, submission_time }];
            }
        });
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedSubmissions([]);
        } else {
            setSelectedSubmissions(
                formSubmissions.map((submission) => ({
                    user_id: submission.user_id,
                    submission_time: submission.submission_time,
                }))
            );
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = async () => {
        if (
            selectedSubmissions.length === 0 ||
            !window.confirm(
                "Are you sure you want to delete the selected responses?"
            )
        ) {
            return;
        }

        const access_token = Cookies.get("access_token");
        try {
            // Extract only student IDs from the selected submissions
            const studentIds = selectedSubmissions.map(
                (submission) => submission.user_id
            );
            console.log("My Value:", studentIds);

            await axios.delete(`${backEndUrl}/forms/delete-submissions`, {
                data: {
                    user_ids: studentIds, // Send the array directly
                    form_template_id: selectedFormId, // Use the selectedFormId
                },
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            // Filter out the deleted submissions from the state
            setFormSubmissions((prev) =>
                prev.filter(
                    (submission) =>
                        !selectedSubmissions.some(
                            (selected) =>
                                selected.user_id === submission.user_id &&
                                selected.submission_time ===
                                    submission.submission_time
                        )
                )
            );
            setSelectedSubmissions([]);
            setShowDeleteOptions(false);
        } catch (error) {
            console.error("Error deleting selected submissions:", error);
            toast.error("Failed to delete selected submissions!", {
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
        }
    };

    const handleExport = async () => {
        if (!formDetails) return;
        const access_token = Cookies.get("access_token");
        try {
            const response = await axios.get(
                `${backEndUrl}/forms/${formDetails.form_template_id}/export`,
                {
                    responseType: "blob", // Important for file downloads
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "form_responses.xlsx");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting form data:", error);
            toast.error("Failed to export form data!", {
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
        }
    };

    const defaultMainContentView = (
        <>
            <p className="my-5">
                Welcome to your Form Template Manager! Here you can view the
                form templates you have created or create a new one.
            </p>
            <p className="my-5">
                Select a form from the sidebar to view or edit it. Otherwise, if
                you want to create a new form template, click "Create new form
                template".
            </p>
        </>
    );

    const formTemplateView = (
        <>
            <div className="flex flex-col">
                <div className="mt-5">
                    <p>
                        <strong>Form Template ID: </strong>
                        {formDetails?.form_template_id}
                    </p>
                    <p>
                        <strong>Description: </strong>{" "}
                        {formDetails?.description}
                    </p>
                    <p>
                        <strong>Created On: </strong>
                        {formDetails?.created_at &&
                            new Date(formDetails.created_at).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                    </p>
                </div>
            </div>
            <div className="my-5 flex flex-col-reverse md:flex-row md:justify-between">
                <button
                    onClick={() => setShowDeleteOptions(!showDeleteOptions)}
                    className="bg-red-600 text-white px-2 py-2 rounded-xl transform transition-transform duration-200 hover:scale-105"
                >
                    {showDeleteOptions ? "Cancel" : "Delete Response(s)"}
                </button>
                <div className="flex justify-between md:justify-end my-2 space-x-2 md:my-0">
                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-white px-2 py-2 rounded-xl duration-200 transform transition-transform duration-200 hover:scale-105"
                    >
                        Export to Excel
                    </button>
                    <button
                        onClick={handleDeleteTemplate}
                        className="bg-red-600 text-white px-2 py-2 rounded-xl duration-200 transform transition-transform duration-200 hover:scale-105"
                    >
                        Delete Form Template
                    </button>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            {showDeleteOptions && (
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                            )}
                            <th>Name</th>
                            <th>Student ID</th>
                            <th>Subject ID</th>
                            <th>Submission Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formSubmissions.map((submission) => (
                            <tr
                                key={`${submission.user_id}-${submission.submission_time}`}
                                onDoubleClick={() =>
                                    handleRowDoubleClick(submission)
                                }
                                className="hover:bg-gray-100 cursor-pointer"
                            >
                                {showDeleteOptions && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedSubmissions.some(
                                                (sub) =>
                                                    sub.user_id ===
                                                        submission.user_id &&
                                                    sub.submission_time ===
                                                        submission.submission_time
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(submission)
                                            }
                                        />
                                    </td>
                                )}
                                <td>{`${submission.first_name} ${submission.last_name}`}</td>
                                <td>{submission.user_id}</td>
                                <td>{submission.subject_ID}</td>
                                <td>
                                    {format(
                                        new Date(submission.submission_time),
                                        "MMMM dd, yyyy HH:mm:ss"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDeleteOptions && (
                    <button
                        onClick={handleDeleteSelected}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded transform transition-transform duration-200 hover:scale-105"
                    >
                        Confirm Deletion
                    </button>
                )}
            </div>
        </>
    );

    return (
        <>
            <Layout
                sidebarContent={sidebarData}
                mainContent={
                    createNewFormTemplateView ? (
                        <FormTemplateGenerator
                            updateFormTemplateHistory={
                                updateFormTemplateHistory
                            }
                            viewAdminFormManagerDefault={
                                viewAdminFormManagerDefault
                            }
                        />
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-5">
                                    {formDetails
                                        ? formDetails.title
                                        : "Form Template Manager"}
                                </h1>
                                <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                                {formDetails
                                    ? formTemplateView
                                    : defaultMainContentView}
                            </div>

                            {/* Popup for specific student data */}
                            {showStudentPopup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full">
                                        <h2 className="font-bold text-lg">Responce Details</h2>
                                        <hr className="w-20 border-t-2 border-uwa-yellow mt-1" />

                                        {studentDataError ? (
                                            <p>{studentDataError}</p>
                                        ) : (
                                            specificStudentData &&
                                            Array.isArray(specificStudentData) &&
                                            specificStudentData.map((item: Record<string, any>, index: number) => {
                                                return (
                                                    <div key={index} className="mt-4">
                                                        {/* Loop through all keys in each item */}
                                                        {Object.entries(item).map(([categoryKey, categoryValue]) => (
                                                            <div key={categoryKey} className="mb-4">
                                                                <h3 className="font-bold text-md mb-2">{categoryKey}</h3>
                                                                <ul>
                                                                    {/* Loop through the details of each category */}
                                                                    {Object.entries(categoryValue).map(([key, value]) => (
                                                                        <li key={key}>
                                                                            <strong>{key}:</strong> {String(value)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })
                                        )}

                                        <button
                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                                            onClick={() => setShowStudentPopup(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    )
                }
            />

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

export default AdminFormManagerPage;
