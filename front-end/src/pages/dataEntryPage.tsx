import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FormTemplate from "../components/formTemplate";
import Layout from "../components/layout";
import { FormTemplateJSON } from "../interface/formInterface";
import { SidebarData } from "../interface/sidebarInterface";

const DataEntryPage = () => {
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [previousSection, setPreviousSection] = useState<number | null>(null);
    const [nextSection, setNextSection] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [sidebarSections, setSidebarSections] = useState<
        {
            [name: string]: { sectionName: string; sectionOnClick: () => void };
        }[]
    >([]);

    const location = useLocation();
    const formContentObj: FormTemplateJSON = location.state?.data || {}; // Get the form template data from the location state

    const getSectionsFromFormTemplate = (formTemplate: any) => {
        return Object.keys(formTemplate).map((section) => ({
            [section]: {
                sectionName: section,
                sectionOnClick: () => {},
            },
        }));
    };

    const sidebarContentJSON: SidebarData = {
        title: formContentObj.Title,
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
                    handleSaveAndExit();
                },
            },
        ],
        sections: [],
    };

    useEffect(() => {
        // Update sections before rendering the component
        const sections = getSectionsFromFormTemplate(
            formContentObj.FormTemplate
        );
        setSidebarSections(sections); // Set the sidebar sections
    }, [formContentObj]);

    const formContentJSON = formContentObj.FormTemplate;
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
        sections: sidebarSections.map((section, index) => {
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

    const handleSaveAndExit = () => {
        console.log("Form Data:", formData);
        // TODO: Implement the save and exit functionality and connect with the backend
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
            previousSection={
                previousSection !== null ? sections[previousSection] : null
            }
            nextSection={nextSection !== null ? sections[nextSection] : null}
            formTemplate={
                selectedSection !== null
                    ? {
                          [sections[selectedSection]]:
                              formContentJSON[sections[selectedSection]],
                      }
                    : {}
            }
            formData={formData}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onInputChange={handleInputChange}
        />
    );

    return (
        <Layout
            sidebarContent={sidebarContent}
            mainContent={
                selectedSection !== null
                    ? selectedSectionComponent
                    : introComponent
            }
            selectedSectionProp={selectedSection}
            setSelectedSectionProp={setSelectedSection}
        />
    );
};

export default DataEntryPage;
