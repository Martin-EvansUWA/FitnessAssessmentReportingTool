import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import StudentFormManager from "../components/studentFormManager";
import { SidebarData, SidebarSection } from "../interface/sidebarInterface";

const dummySidebarData: SidebarSection[] = [
    {
        "SSEH2201 - Sem 1 2024": {
            sectionName: "SSEH2201 - Sem 1 2024",
            sectionOnClick: () => {
                console.log("SSEH2201 - Sem 1 2024 clicked");
            },
        },
    },
    {
        "SSEH3301 - Sem 2 2023": {
            sectionName: "SSEH3301 - Sem 2 2023",
            sectionOnClick: () => {
                console.log("SSEH3301 - Sem 2 2023 clicked");
            },
        },
    },
    {
        "SSEH3301 - Sem 1 2023": {
            sectionName: "SSEH3301 - Sem 1 2023",
            sectionOnClick: () => {
                console.log("SSEH3301 - Sem 1 2023 clicked");
            },
        },
    },
];

const StudentFormManagerPage = () => {
    const [selectedForm, setSelectedForm] = useState<string | null>(null);

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
        // Some code here ...
        // What I will need:
        // 1) Send current user ID to backend
        // 2) Backend queries the fact_user_form table to get all forms filled out by the user or assigned to the user
        // 3) Backend returns:
        //      - FactUserFormID
        //      - UserFormResponseID
        //      - FormTemplateID
        //      - StudentID
        //      - SubjectStudentID
        //      - IsComplete
        //      - CreatedAt
        //      - CompletedAt
        // 4) Frontend maps the response to the sidebar sections by assigning the FormTemplateID as the key and FormTemplateID+CreatedAt as the sectionName
        // 5) Frontend also assigns a sectionOnClick function to each section that sets the selectedForm state to the FormTemplateID
        // 6) When user clicks on a section, Frontend will send a GET request with the FormTemplateID to get the form details
        // 7) Frontend will then render the form details in the main content
        return dummySidebarData; // TODO: Replace with actual data
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
