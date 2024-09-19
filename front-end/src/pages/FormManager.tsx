import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";
import { backEndUrl } from '../global_helpers/constants';

// Define the interface for form submissions and form details
interface FormSubmission {
    student_id: number;
    first_name: string;
    last_name: string;
    submission_time: string;
}

interface FormDetails {
    form_template_id: number;
    title: string;
    description: string;
    created_at: string;
}

interface SpecificStudentData {
    // Define the structure of the specific student data returned from the API
    // For example:
    student_id: number;
    first_name: string;
    last_name: string;
    responses: any; // Modify as per actual structure
}

const GetNewFormPage = () => {
    const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
    const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
    const [specificStudentData, setSpecificStudentData] = useState<SpecificStudentData | null>(null);
    const [showStudentPopup, setShowStudentPopup] = useState(false);
    const [studentDataError, setStudentDataError] = useState<string | null>(null);
    const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);

    const fetchFormData = async (formTemplateId: number) => {
        try {
            const response = await axios.get(`${backEndUrl}/forms/${formTemplateId}/submissions`);
            setFormDetails(response.data.form_details as FormDetails);
            setFormSubmissions(response.data.submissions as FormSubmission[]);
        } catch (error) {
            console.error('Error fetching form details and submissions:', error);
        }
    };

    const fetchSpecificStudentData = async (studentId: number, formId: number) => {
        try {
            const response = await axios.get(`${backEndUrl}/specific_student_data/${studentId}/${formId}`);
            if (response.data) {
                setSpecificStudentData(response.data);
                setStudentDataError(null);
            } else {
                setStudentDataError('No data available for this student.');
                setSpecificStudentData(null);
            }
            setShowStudentPopup(true);
        } catch (error) {
            console.error('Error fetching specific student data:', error);
            setStudentDataError('Error fetching student data. Please try again later.');
            setSpecificStudentData(null);
            setShowStudentPopup(true);
        }
    };

    const handleRowDoubleClick = (submission: FormSubmission) => {
        if (formDetails) {
            fetchSpecificStudentData(submission.student_id, formDetails.form_template_id);
        }
    };

    const handleDeleteTemplate = async () => {
        if (!formDetails) return;

        if (!window.confirm('Are you sure you want to delete this form template and all attached responses?')) {
            return;
        }

        try {
            await axios.delete(`${backEndUrl}/forms/${formDetails.form_template_id}`);
            setFormDetails(null);
            setFormSubmissions([]);
        } catch (error) {
            console.error('Error deleting form template:', error);
        }
    };

    const handleCheckboxChange = (studentId: number) => {
        setSelectedSubmissions(prevSelected => 
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedSubmissions.length === 0 || !window.confirm('Are you sure you want to delete the selected responses?')) {
            return;
        }

        try {
            await axios.delete(`${backEndUrl}/forms/delete-submissions`, { data: { student_ids: selectedSubmissions } });
            setFormSubmissions(prev => prev.filter(submission => !selectedSubmissions.includes(submission.student_id)));
            setSelectedSubmissions([]);
            setShowDeleteOptions(false);
        } catch (error) {
            console.error('Error deleting selected submissions:', error);
        }
    };

    const dummySidebarData: SidebarData = {
        title: "Form Manager",
        footer: [
            {
                text: "Add a new form",
                fontAwesomeIcon: faPlus,
                onClick: () => {
                    window.location.href = '/create-new-form-template';
                },
            },
        ],
        sections: [
            {
                "SSEH2201 - Sem 1 2024": {
                    sectionName: "SSEH2201 - Sem 1 2024",
                    sectionOnClick: () => {
                        fetchFormData(3);
                    },
                },
            },
            {
                "SSEH3301 - Sem 2 2023": {
                    sectionName: "SSEH3301 - Sem 2 2023",
                    sectionOnClick: () => {
                        fetchFormData(3);
                    },
                },
            },
            {
                "SSEH3301 - Sem 1 2023": {
                    sectionName: "SSEH3301 - Sem 1 2023",
                    sectionOnClick: () => {
                        fetchFormData(3);
                    },
                },
            },
        ],
    };

    return (
        <Layout
            sidebarContent={dummySidebarData}
            mainContent={
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px', maxHeight: 'calc(100vh - 150px)' }}>
                    <div style={{ flex: '1', overflowY: 'auto' }}>
                        <h1 className="text-3xl font-bold mb-4">{formDetails ? formDetails.title : "Form Manager"}
                        <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                        </h1>
                        {formDetails && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p><strong>Form ID: </strong> {formDetails.form_template_id}</p>
                                    <p><strong>Created At: </strong> {formDetails.created_at}</p>
                                    <p><strong>Description: </strong>{formDetails.description}</p>
                                </div>
                                <button onClick={() => setShowDeleteOptions(!showDeleteOptions)} className="bg-red-500 text-white px-4 py-2 rounded">
                                    {showDeleteOptions ? 'Cancel' : 'Delete Response'}
                                </button>
                            </div>
                        )}

                        <br />

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {showDeleteOptions && <th>Select</th>}
                                        <th>Name</th>
                                        <th>Student ID</th>
                                        <th>Submission Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formSubmissions.map((submission) => (
                                        <tr key={submission.student_id} onDoubleClick={() => handleRowDoubleClick(submission)}>
                                            {showDeleteOptions && (
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedSubmissions.includes(submission.student_id)} 
                                                        onChange={() => handleCheckboxChange(submission.student_id)} 
                                                    />
                                                </td>
                                            )}
                                            <td>{`${submission.first_name} ${submission.last_name}`}</td>
                                            <td>{submission.student_id}</td>
                                            <td>{submission.submission_time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {showDeleteOptions && (
                                <button onClick={handleDeleteSelected} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                                    Confirm Deletion
                                </button>
                            )}
                        </div>
                    </div>

                    <button onClick={handleDeleteTemplate} className="mt-4 bg-red-800 text-white px-4 py-2 rounded self-end">
                        Delete Form Template
                    </button>

                    {/* Popup for specific student data */}
                    {showStudentPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2 style={{ fontWeight: 'bold' , fontSize: '1.2em'}}>Student Details</h2> 
                                <hr className="w-20 border-t-2 border-uwa-yellow mt-1" />
                                <br></br>
                                {studentDataError ? (
                                    <p>{studentDataError}</p>
                                ) : (
                                    specificStudentData && Array.isArray(specificStudentData) && (
                                        specificStudentData.map((item: Record<string, any>, index: number) => {
                                            const studentDetails = item["Student Details"];
                                            return (
                                                <div key={index}>
                                                    <h3 style={{ fontWeight: 'bold' }}>{studentDetails?.Name || "Unnamed Student"}</h3>
                                                    <ul>
                                                        {Object.entries(studentDetails).map(([key, value]) => (
                                                            <li key={key}>
                                                                <strong>{key}:</strong> {String(value)} {/* Convert value to string */}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }) as React.ReactNode // Type assertion here
                                    )
                                )}
                                <br></br>
                                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"  onClick={() => setShowStudentPopup(false)}>Close</button>
                            </div>
                        </div>
                    )}

                </div>
            }
        />
    );
};

export default GetNewFormPage;
