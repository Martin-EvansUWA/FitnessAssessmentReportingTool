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
    Test3: {
        "Test Measurement 1": "Integer",
        "Test Measurement 2": "String",
        "Test Measurement 3": "Float",
        "Test Measurement 4": "Boolean",
    },
    Test4: {
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
    return Object.keys(formTemplate).map((section) => ({
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
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [previousSection, setPreviousSection] = useState<number | null>(null);
    const [nextSection, setNextSection] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});

    const sidebarContentJSON = dummySidebarTemplateJSON; // TODO: Fetch sidebar data from the backend
    const formContentJSON = dummyFormTemplateJSON; // TODO: Fetch form data from the backend
    
    const sections = Object.keys(formContentJSON);

    const updateSectionNavigation = (currentIndex: number) => {
        setPreviousSection(currentIndex > 0 ? currentIndex - 1 : null);
        setNextSection(
            currentIndex < sections.length - 1 ? currentIndex + 1 : null
        );
    };

    // Update the onClick handlers to set the selected section
    const sidebarContent = {
        ...sidebarContentJSON,
        sections: sidebarContentJSON.sections.map((section, index) => {
            const sectionName = Object.keys(section)[0];
            return {
                [sectionName]: {
                    ...section[sectionName],
                    sectionOnClick: () => {
                        setSelectedSection(index);
                        updateSectionNavigation(index);
                    },
                },
            };
        }),
    };

    const handleNextPage = () => {
        if (nextSection !== null) {
            setSelectedSection(nextSection);
            updateSectionNavigation(nextSection);
        }
    };

    const handlePreviousPage = () => {
        if (previousSection !== null) {
            setSelectedSection(previousSection);
            updateSectionNavigation(previousSection);
        }
    };

    const handleInputChange = (section: string, field: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value,
            },
        }));
    };

    // TODO: Implement the save and exit functionality and connect with the backend
    const handleSaveAndExit = () => {
        console.log("Form Data:", formData);
    };

    const introComponent = (
        <>
            <h1 className="text-2xl font-bold mb-5">Data Entry Page</h1>
            <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
            <div className="my-5 font-bold">
                Start by selecting a section from the sidebar!
            </div>
        </>
    );

    const checkTruthy = (value: any) => {
        return (value !== null && value !== undefined) || value === 0;
    };

    const selectedSectionComponent = (
        <FormTemplate
            previousSection={
                checkTruthy(previousSection) ? sections[previousSection!] : null
            }
            nextSection={
                checkTruthy(nextSection) ? sections[nextSection!] : null
            }
            formTemplate={
                checkTruthy(selectedSection)
                    ? {
                          [sections[selectedSection!]]:
                              formContentJSON[sections[selectedSection!]],
                      }
                    : {}
            }
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onInputChange={handleInputChange} // Pass the input change handler
        />
    );

    return (
        <Layout
            sidebarContent={sidebarContent}
            mainContent={
                checkTruthy(selectedSection)
                    ? selectedSectionComponent
                    : introComponent
            }
            selectedSectionProp={selectedSection} // Pass selectedSection to Layout
            setSelectedSectionProp={setSelectedSection} // Pass setSelectedSection to Layout
        ></Layout>
    );
};

export default DataEntryPage;
