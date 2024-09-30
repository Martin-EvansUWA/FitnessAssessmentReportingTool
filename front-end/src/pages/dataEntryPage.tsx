import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { default as FormTemplate } from "../components/formTemplate";
import Layout from "../components/layout";
import { backEndUrl } from "../global_helpers/constants";
import { HelperFunctions } from "../global_helpers/helperFunctions";
import { FormTemplateJSON } from "../interface/formInterface";
import { SidebarData } from "../interface/sidebarInterface";
import Cookies from "js-cookie";

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
    const [subjectStudentNumber, setSubjectStudentNumber] =
        useState<string>("");
    const [createdAtDateTime, setCreatedAtDateTime] = useState<string>("");

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
        // Save the current date and time when the user starts the form
        setCreatedAtDateTime(new Date().toISOString());
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
        const access_token = Cookies.get("access_token");
        // Formatted form data to send to the backend
        const formattedFormData = {
            SubjectUserID: subjectStudentNumber,
            CreatedAt: createdAtDateTime,
            CompleteAt: new Date().toISOString(),
            IsComplete: false, //TODO: Add logic to check if the form is complete
            FormTemplateID: formContentObj.FormTemplateID,
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
        return axios
            .post(`${backEndUrl}/save_form_entry`, formattedFormData, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
              })
            .then((response) => {
                console.log("Success:", response.data);
                toast.success("Progress Saved Successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                return true;
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Failed To Save Progress!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                return false;
            });
    };

    const handleSaveAndExit = async () => {
        const saveSuccessful = await handleSave(); // Save the form data and wait for the result
        if (saveSuccessful) {
            navigate("/"); // Navigate to the home page if save was successful
        }
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
                        {formContentObj.UserID}
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
        <>
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
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    );
};

export default DataEntryPage;
