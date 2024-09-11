import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { default as FormTemplate } from "../components/formTemplate";
import Layout from "../components/layout";
import { backEndUrl } from "../global_helpers/constants";
import { HelperFunctions } from "../global_helpers/helperFunctions";
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
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [subjectStudentNumber, setSubjectStudentNumber] =
        useState<string>("");

    const location = useLocation();
    const formContentObj: FormTemplateJSON = location.state?.data || {}; // Get the form template data from the location state

    const navigate = useNavigate(); // Used for navigation

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
        titleOnClick: () => {
            setSelectedSection(null);
        },
        footer: [
            {
                text: "Save",
                fontAwesomeIcon: faSave,
                onClick: () => {
                    handleSave();
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

    const handleSave = () => {
        // Formatted form data to send to the backend
        const formattedFormData = {
            StudentID: 12345678, //TODO: Replace Dummy Student ID with actual student ID
            SubjectStudentID: subjectStudentNumber,
            IsComplete: false, //TODO: Add logic to check if the form is complete
            UserFormResponse: formData,
        };

        console.log(
            "Saved Form For: ",
            subjectStudentNumber,
            "\n",
            "Saved Form Data:",
            formData
        );
        // Send form response data to backend
        axios
            .post(`${backEndUrl}/save_form_entry`, formattedFormData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Success:", response.data);
                setSaveSuccess(true); // TODO: Create a success message for the user to see
            })
            .catch((error) => {
                console.error("Error:", error);
                setSaveSuccess(false);
            });
    };

    const handleSaveAndExit = () => {
        handleSave(); // Save the form data
        navigate("/"); // Navigate to the home page after saving
    };

    const handleSubjectStudentIdChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSubjectStudentNumber(e.target.value);
        },
        []
    );

    const introComponent = (
        <div className="h-full flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold">Data Entry Page</h1>
                <hr className="w-28 border-t-2 border-uwa-yellow my-5" />
                <div className="mt-5">
                    <h2 className="text-lg font-semibold my-3 text-gray-700">
                        <span className="text-gray-900 font-bold">Title:</span>{" "}
                        {formContentObj.Title}
                    </h2>
                    <h2 className="text-lg font-semibold my-3 text-gray-700">
                        <span className="text-gray-900 font-bold">
                            Description:
                        </span>{" "}
                        {formContentObj.Description}
                    </h2>
                    <h2 className="text-lg font-semibold my-3 text-gray-700">
                        <span className="text-gray-900 font-bold">
                            Created By:
                        </span>{" "}
                        {formContentObj.StaffID}
                    </h2>
                    <h2 className="text-lg font-semibold my-3 text-gray-700">
                        <span className="text-gray-900 font-bold">
                            Created At:
                        </span>{" "}
                        {formContentObj.CreatedAt}
                    </h2>
                </div>
                <hr className="w-28 border-t-2 border-uwa-yellow my-5" />
                <div className="flex flex-col md:flex-row md:space-x-10">
                    <label className="text-lg font-semibold text-gray-700">
                        <span className="text-gray-900 font-bold">
                            I am completing this form for:
                        </span>
                    </label>
                    <input
                        type="text"
                        className="h-7 border-2 border-gray-300 rounded max-w-[15rem]"
                        aria-label="subject student number"
                        placeholder="UWA Student Number"
                        onKeyDown={HelperFunctions.handleKeyDown}
                        onPaste={HelperFunctions.handlePaste}
                        onChange={handleSubjectStudentIdChange}
                        value={subjectStudentNumber}
                    />
                </div>
            </div>
            <button
                className="bg-uwa-yellow font-bold h-10 w-36 rounded self-end"
                onClick={() => {
                    setSelectedSection(0);
                    updateSectionNavigation(0);
                }}
            >
                Start Data Entry
            </button>
        </div>
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
