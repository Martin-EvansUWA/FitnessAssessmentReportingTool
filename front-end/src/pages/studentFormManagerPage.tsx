import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import StudentFormManager from "../components/studentFormManager";
import { SidebarData, SidebarSection } from "../interface/sidebarInterface";

const baseSidebar: SidebarData = {
    title: "My Forms",
    footer: [
        {
            text: "Add a new form",
            fontAwesomeIcon: faPlus,
            onClick: () => {
                console.log("Footer button clicked");
            },
        },
    ],
    sections: [] as SidebarSection[],
};

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
    const [sidebarData, setSidebarData] = useState<SidebarData>({
        ...baseSidebar,
        sections: [] as SidebarSection[],
    });

    const getFormHistory = () => {
        // TODO: Send GET request to backend to get form history (detail of forms filled out by current student)
        // Some code here ...
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

    return (
        <Layout
            sidebarContent={sidebarData}
            mainContent={<StudentFormManager />}
        ></Layout>
    );
};

export default StudentFormManagerPage;
