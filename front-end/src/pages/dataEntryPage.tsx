import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import FormTemplate from "../components/formTemplate";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummyFormTemplateJSON: { [key: string]: { [key: string]: string } } = {
    "Student Details": {
        Name: "String",
        Age: "Integer",
        Height: "Float",
        Weight: "Float",
    },
    Test: {
        "Test Measurement 1": "Integer",
        "Test Measurement 2": "String",
        "Test Measurement 3": "Float",
        "Test Measurement 4": "Boolean",
    },
    Test2: {
        "Test Measurement 1": "Integer",
        "Test Measurement 2": "String",
        "Test Measurement 3": "Float",
        "Test Measurement 4": "Boolean",
    },
};

const dummySidebarTemplateJSON: SidebarData = {
    title: "SSEH2201 Peer Fitness Testing Recording Sheet  - 2024 Sem 1",
    footer: [
        {
            text: "Save",
            fontAwesomeIcon: faSave,
            onClick: () => {
                console.log("Save button clicked");
            },
        },
        {
            text: "Save & Exit",
            fontAwesomeIcon: faSignOut,
            onClick: () => {
                console.log("Save & Exit button clicked");
            },
        },
    ],
    sections: [],
};

const getSectionsFromFormTemplate = (formTemplate: any) => {
    return Object.keys(formTemplate).map((section, index) => ({
        [section]: {
            sectionName: section,
            sectionOnClick: () => {},
        },
    }));
};

// Update sections before rendering the component
dummySidebarTemplateJSON.sections = getSectionsFromFormTemplate(
    dummyFormTemplateJSON
);

const DataEntryPage = () => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    // Update the onClick handlers to set the selected section
    const sidebarContent = {
        ...dummySidebarTemplateJSON,
        sections: dummySidebarTemplateJSON.sections.map((section) => {
            const sectionName = Object.keys(section)[0];
            return {
                [sectionName]: {
                    ...section[sectionName],
                    sectionOnClick: () => {
                        setSelectedSection(sectionName);
                    },
                },
            };
        }),
    };

    const introComponent = (
        <>
            <h1 className="text-2xl font-bold mb-5">Data Entry Page</h1>
            <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
            <div className="my-5">
                Start by selecting a section from the sidebar!
            </div>
        </>
    );
    const selectedSectionComponent = (
        <FormTemplate
            formTemplate={{
                [selectedSection as string]:
                    dummyFormTemplateJSON[selectedSection as string],
            }}
        />
    );

    return (
        <Layout
            sidebarContent={sidebarContent}
            mainContent={
                selectedSection ? selectedSectionComponent : introComponent
            }
        ></Layout>
    );
};

export default DataEntryPage;
