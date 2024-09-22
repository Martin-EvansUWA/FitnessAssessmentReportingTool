import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import StudentFormManager from "../components/studentFormManager";
import { FormTemplateJSON } from "../interface/formInterface";
import { SidebarData, SidebarSection } from "../interface/sidebarInterface";

// What I will need:
// 1) Send current user ID to backend
// 2) Backend queries the fact_user_form table to get all forms filled out by the user or assigned to the user
// 3) Backend returns:
//      - FactUserFormID
//      - UserFormResponseID
//      - FormTemplateID
//      - FormTemplateTitle
//      - StudentID
//      - SubjectStudentID
//      - IsComplete
//      - CreatedAt
//      - CompletedAt
// 4) Frontend maps the response to the sidebar sections by assigning the FormTemplateID as the key and FormTemplateID+CreatedAt as the sectionName
// 5) Frontend also assigns a sectionOnClick function to each section that sets the selectedForm state to the FormTemplateID
// 6) When user clicks on a section, Frontend will send a GET request with the FormTemplateID to get the form details
//     - Form details will include: Title, Description, staffID
// 7) Frontend will then render the form details in the main content

// Dummy data starts here ------------------------------------------------------

const dummyBackendResponse1 = [
    {
        FactUserFormID: 1,
        UserFormResponseID: 101,
        FormTemplateID: 1,
        title: "SSEH2201 - Sem 1 2024",
        StudentID: 123456,
        SubjectStudentID: 654321,
        IsComplete: true,
        CreatedAt: "2023-01-15T10:00:00Z",
        CompletedAt: "2023-01-20T10:00:00Z",
    },
    {
        FactUserFormID: 2,
        UserFormResponseID: 102,
        FormTemplateID: 2,
        title: "SSEH3301 - Sem 2 2023",
        StudentID: 123456,
        SubjectStudentID: 654322,
        IsComplete: false,
        CreatedAt: "2023-02-15T10:00:00Z",
        CompletedAt: null,
    },
    {
        FactUserFormID: 3,
        UserFormResponseID: 103,
        FormTemplateID: 3,
        title: "SSEH3302 - Sem 1 2023",
        StudentID: 123456,
        SubjectStudentID: 654323,
        IsComplete: true,
        CreatedAt: "2023-03-15T10:00:00Z",
        CompletedAt: "2023-03-20T10:00:00Z",
    },
];

const dummyBackendResponse2: FormTemplateJSON[] = [
    {
        FormTemplateID: 1,
        StaffID: 987654,
        Title: "SSEH2201 - Sem 1 2024",
        Description: "This is a description for SSEH2201 - Sem 1 2024",
        CreatedAt: "2023-01-01T10:00:00Z",
        FormTemplate: {
            "1": {
                "Question 1": "What is your name?",
                "Question 2": "What is your student ID?",
                "Question 3": "What is your email?",
            },
        },
    },
    {
        FormTemplateID: 2,
        StaffID: 987654,
        Title: "SSEH3301 - Sem 2 2023",
        Description: "This is a description for SSEH3301 - Sem 2 2023",
        CreatedAt: "2023-02-01T10:00:00Z",
        FormTemplate: {
            "1": {
                "Question 1": "What is your name?",
                "Question 2": "What is your student ID?",
                "Question 3": "What is your email?",
            },
        },
    },
    {
        FormTemplateID: 3,
        StaffID: 987654,
        Title: "SSEH3302 - Sem 1 2023",
        Description: "This is a description for SSEH3302 - Sem 1 2023",
        CreatedAt: "2023-03-01T10:00:00Z",
        FormTemplate: {
            "1": {
                "Question 1": "What is your name?",
                "Question 2": "What is your student ID?",
                "Question 3": "What is your email?",
            },
        },
    },
];

// Dummy data ends here --------------------------------------------------------

const StudentFormManagerPage = () => {
    const [selectedForm, setSelectedForm] = useState<number | null>(null);
    const [formDetails, setFormDetails] = useState<FormTemplateJSON | null>(
        null
    );

    const navigate = useNavigate();

    const baseSidebar: SidebarData = {
        title: "My Forms",
        titleOnClick: () => {
            setSelectedForm(null);
        },
        footer: [
            {
                text: "Add a new form",
                fontAwesomeIcon: faPlus,
                onClick: () => {
                    // Navigate to get new form page
                    navigate("/get-new-form");
                },
            },
        ],
        sections: [] as SidebarSection[],
    };

    const [sidebarData, setSidebarData] = useState<SidebarData>({
        ...baseSidebar,
        sections: [] as SidebarSection[],
    });

    const getFormHistory = () => {
        // TODO: Send GET request to backend to get form history (detail of forms filled out by current student)
        // Simulate backend response with dummy data - TODO: Replace with actual backend response
        return dummyBackendResponse1.map((form) => ({
            [`${form.FormTemplateID} - ${form.CreatedAt}`]: {
                sectionName: `${form.title} [${form.CreatedAt}]`,
                sectionOnClick: () => {
                    setSelectedForm(form.FormTemplateID);
                    fetchFormDetails(form.FormTemplateID);
                },
            },
        }));
    };

    const fetchFormDetails = (formTemplateID: number) => {
        // Simulate GET request to get form details - TODO: Replace with actual backend response
        const formDetail = dummyBackendResponse2.find(
            (form) => form.FormTemplateID === formTemplateID
        );
        if (formDetail) {
            setFormDetails(formDetail as FormTemplateJSON);
        } else {
            setFormDetails(null);
        }
    };

    const buildSidebarData = (formHistory: any) => {
        return {
            ...baseSidebar,
            sections: formHistory,
        };
    };

    useEffect(() => {
        const formHistory = getFormHistory();
        setSidebarData(buildSidebarData(formHistory));
    }, []);

    const startingMainContent = (
        <div>
            <h1 className="text-2xl font-bold mb-5">Form Manager</h1>
            <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
            <p className="font-bold my-5">
                Select a form from the sidebar to view or edit it.
            </p>
            <p className="font-bold my-5">
                Otherwise, if you want to fill out a new form, click "Add a new
                form".
            </p>
        </div>
    );

    return (
        <Layout
            sidebarContent={sidebarData}
            mainContent={
                selectedForm ? <StudentFormManager /> : startingMainContent
            }
        ></Layout>
    );
};

export default StudentFormManagerPage;
