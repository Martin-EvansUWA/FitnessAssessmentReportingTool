import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import FormTemplate, { formContext } from "../components/formTemplate";
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
    const [previousSection, setPreviousSection] = useState<string | null>(null);
    const [nextSection, setNextSection] = useState<string | null>(null);
    const [fullFormState, setFullFormState] = useState<{
        [key: string]: string;
    }>({});
    const currFormContext = useContext(formContext);

    const sections = Object.keys(dummyFormTemplateJSON);

    const updateSectionNavigation = (sectionName: string) => {
        const currentIndex = sections.indexOf(sectionName);
        setPreviousSection(
            currentIndex > 0 ? sections[currentIndex - 1] : null
        );
        setNextSection(
            currentIndex < sections.length - 1
                ? sections[currentIndex + 1]
                : null
        );
    };

    // Update the onClick handlers to set the selected section
    const sidebarContent = {
        ...dummySidebarTemplateJSON,
        sections: dummySidebarTemplateJSON.sections.map((section, index) => {
            const sectionName = Object.keys(section)[0];
            return {
                [sectionName]: {
                    ...section[sectionName],
                    sectionOnClick: () => {
                        setSelectedSection(sectionName);
                        updateSectionNavigation(sectionName);
                    },
                },
            };
        }),
    };

    const handleNextPage = () => {
        if (nextSection) {
            setSelectedSection(nextSection);
            updateSectionNavigation(nextSection);
        }
    };

    const handlePreviousPage = () => {
        if (previousSection) {
            setSelectedSection(previousSection);
            updateSectionNavigation(previousSection);
        }
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

    const selectedSectionComponent = (
        <FormTemplate
            previousSection={previousSection as string}
            nextSection={nextSection as string}
            formTemplate={{
                [selectedSection as string]:
                    dummyFormTemplateJSON[selectedSection as string],
            }}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
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
