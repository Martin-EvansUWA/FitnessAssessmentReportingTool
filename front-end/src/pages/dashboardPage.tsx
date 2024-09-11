import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

// Static dummy sidebar data
const dummySidebarData: SidebarData = {
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
    sections: [
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
    ],
};

const DashboardPage = () => {
    const navigate = useNavigate(); // Use useNavigate hook for routing

    // Modify the onClick handlers after defining the static structure
    const modifiedSidebarData: SidebarData = {
        ...dummySidebarData,
        sections: dummySidebarData.sections.map((section) => {
            const sectionName = Object.keys(section)[0];
            return {
                [sectionName]: {
                    ...section[sectionName],
                    sectionOnClick: () => {
                        navigate(`/form-results`); // Navigate to the corresponding form results page
                    },
                },
            };
        }),
    };

    return (
        <Layout
            sidebarContent={modifiedSidebarData}
            mainContent={
                <div style={{ padding: "20px" }}>
                    <h1 className="text-3xl font-bold mb-4">
                        Dashboard
                        <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
                    </h1>
                    <p>To get started, add a new form:</p>
                    <button
                        onClick={() => navigate("/get-new-form")}
                        className="bg-uwa-yellow p-2 rounded-lg font-semibold text-sm hover:bg-[#ecab00]"
                    >
                        + Add new form
                    </button>
                    <p style={{ marginTop: "20px" }}>
                        Forms are displayed on the right. To enter data, click
                        the name of the form on the sidebar.
                    </p>
                </div>
            }
        />
    );
};

export default DashboardPage;
