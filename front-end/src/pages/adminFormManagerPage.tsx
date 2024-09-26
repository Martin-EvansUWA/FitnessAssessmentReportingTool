import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
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

const GetNewFormPage = () => {
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
        { student_id: number; submission_time: string }[]
    >([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [fetchedFormHistory, setFetchedFormHistory] = useState<
        formHistorySidebarInfoAdmin[]
    >([]);
    const [addNewFormSelected, setAddNewFormSelected] =
        useState<boolean>(false);

    const baseSidebar: SidebarData = {
        title: "My Form Templates",
        titleOnClick: () => {
            setSelectedFormId(null);
        },
        footer: [
            {
                text: "Add a new form",
                fontAwesomeIcon: faPlus,
                onClick: () => {
                    window.location.href = "/create-new-form-template";
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
        try {
            const response = await axios.get(
                `${backEndUrl}/forms/${formTemplateId}/submissions`
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
        responce_id: number,
        formId: number
    ) => {
        try {
            const response = await axios.get(
                `${backEndUrl}/specific_student_data/${responce_id}/${formId}`
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
        try {
            const response = await axios.get(
                `${backEndUrl}/retrieve_admin_sidebar_info/1`
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

    useEffect(() => {
        const fetchData = async () => {
            const formHistory = await getFormHistory();
            setSidebarData(buildSidebarData(formHistory));
        };
        fetchData();
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

        try {
            await axios.delete(
                `${backEndUrl}/forms/${formDetails.form_template_id}`
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
        const { student_id, submission_time } = submission;
        setSelectedSubmissions((prevSelected) => {
            const isSelected = prevSelected.some(
                (sub) =>
                    sub.student_id === student_id &&
                    sub.submission_time === submission_time
            );
            if (isSelected) {
                return prevSelected.filter(
                    (sub) =>
                        !(
                            sub.student_id === student_id &&
                            sub.submission_time === submission_time
                        )
                );
            } else {
                return [...prevSelected, { student_id, submission_time }];
            }
        });
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

        try {
            await axios.delete(`${backEndUrl}/forms/delete-submissions`, {
                data: { submissions: selectedSubmissions },
            });
            setFormSubmissions((prev) =>
                prev.filter(
                    (submission) =>
                        !selectedSubmissions.some(
                            (selected) =>
                                selected.student_id === submission.student_id &&
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

        try {
            const response = await axios.get(
                `${backEndUrl}/forms/${formDetails.form_template_id}/export`,
                {
                    responseType: "blob", // Important for file downloads
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

    return (
        <>
            <Layout
                sidebarContent={sidebarData}
                mainContent={
                    <div className="flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            <h1 className="text-2xl font-bold mb-5">
                                {formDetails
                                    ? formDetails.title
                                    : "Form Manager"}
                            </h1>
                            <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                            {formDetails && (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p>
                                            <strong>Form ID: </strong>{" "}
                                            {formDetails.form_template_id}
                                        </p>
                                        <p>
                                            <strong>Created At: </strong>{" "}
                                            {formDetails.created_at}
                                        </p>
                                        <p>
                                            <strong>Description: </strong>{" "}
                                            {formDetails.description}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleExport}
                                            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                                        >
                                            Export to Excel
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowDeleteOptions(
                                                    !showDeleteOptions
                                                )
                                            }
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            {showDeleteOptions
                                                ? "Cancel"
                                                : "Delete Response"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <br />

                            <div className="table-container">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            {showDeleteOptions && (
                                                <th>Select</th>
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
                                                key={`${submission.student_id}-${submission.submission_time}`}
                                                onDoubleClick={() =>
                                                    handleRowDoubleClick(
                                                        submission
                                                    )
                                                }
                                                className="hover:bg-gray-100 cursor-pointer"
                                            >
                                                {showDeleteOptions && (
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSubmissions.some(
                                                                (sub) =>
                                                                    sub.student_id ===
                                                                        submission.student_id &&
                                                                    sub.submission_time ===
                                                                        submission.submission_time
                                                            )}
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    submission
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                )}
                                                <td>{`${submission.first_name} ${submission.last_name}`}</td>
                                                <td>{submission.student_id}</td>
                                                <td>{submission.subject_ID}</td>
                                                <td>
                                                    {submission.submission_time}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {showDeleteOptions && (
                                    <button
                                        onClick={handleDeleteSelected}
                                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Confirm Deletion
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleDeleteTemplate}
                            className="mt-4 bg-red-800 text-white px-4 py-2 rounded self-end"
                        >
                            Delete Form Template
                        </button>

                        {/* Popup for specific student data */}
                        {showStudentPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-5 rounded-lg shadow-lg">
                                    <h2 className="font-bold text-lg">
                                        Student Details
                                    </h2>
                                    <hr className="w-20 border-t-2 border-uwa-yellow mt-1" />
                                    <br />
                                    {studentDataError ? (
                                        <p>{studentDataError}</p>
                                    ) : (
                                        specificStudentData &&
                                        Array.isArray(specificStudentData) &&
                                        specificStudentData.map(
                                            (
                                                item: Record<string, any>,
                                                index: number
                                            ) => {
                                                const studentDetails =
                                                    item["Student Details"];
                                                return (
                                                    <div key={index}>
                                                        <ul>
                                                            {Object.entries(
                                                                studentDetails
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    value,
                                                                ]) => (
                                                                    <li
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                key
                                                                            }
                                                                            :
                                                                        </strong>{" "}
                                                                        {String(
                                                                            value
                                                                        )}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                        )
                                    )}
                                    <br />
                                    <button
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() =>
                                            setShowStudentPopup(false)
                                        }
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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

export default GetNewFormPage;
