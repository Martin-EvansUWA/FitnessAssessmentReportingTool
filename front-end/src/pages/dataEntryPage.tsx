import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { default as FormTemplate } from "../components/formTemplate";
import Layout from "../components/layout";
import { backEndUrl, dataEntryRedirectType } from "../global_helpers/constants";
import { HelperFunctions } from "../global_helpers/helperFunctions";
import {
    EditFormTemplateJSON,
    FormTemplateJSON,
} from "../interface/formInterface";
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
    const [subjectStudentNumber, setSubjectStudentNumber] =
        useState<string>("");
    const [formStartedAt, setFormStartedAt] = useState<string>("");

    const location = useLocation();
    const formContentObj: FormTemplateJSON | EditFormTemplateJSON =
        location.state?.data || {}; // Get the form template data from the location state
    const formContentType: string = location.state?.type || ""; // Get the form type from the location state

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
        if (formContentType === dataEntryRedirectType.NEW_FORM) {
            setFormStartedAt(new Date().toISOString());
        } else {
            // If the formContentType is not NEW_FORM, then it is an existing form
            // and the formStartedAt is already set in the formContentObj
            if ("FormStartedAt" in formContentObj) {
                setFormStartedAt(formContentObj.FormStartedAt);
            }
        }

        // Update sections before rendering the component
        const sections = getSectionsFromFormTemplate(
            formContentObj.FormTemplate
        );
        setSidebarSections(sections); // Set the sidebar sections

        // Pre-fill form data if editing a previously submitted form
        if (formContentType === dataEntryRedirectType.EDIT_FORM) {
            const previousData =
                "UserFormResponse" in formContentObj
                    ? formContentObj.UserFormResponse
                    : {};
            setFormData(previousData);
            if ("SubjectUserID" in formContentObj) {
                setSubjectStudentNumber(formContentObj.SubjectUserID);
            }
        }
    }, [formContentObj, formContentType]);

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

    const isFormComplete = () => {
        for (const section of Object.keys(formContentJSON)) {
            for (const field of Object.keys(formContentJSON[section])) {
                if (
                    !formData[section] ||
                    formData[section][field] === "" ||
                    formData[section][field] === null ||
                    formData[section][field] === undefined
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleSave = () => {
        const access_token = Cookies.get("access_token");
        // Formatted form data to send to the backend
        const formattedFormData = {
            SubjectUserID: subjectStudentNumber,
            CreatedAt: formStartedAt,
            CompleteAt: new Date().toISOString(),
            IsComplete: isFormComplete(),
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
                <h1 className="text-2xl font-bold">
                    {formContentType === dataEntryRedirectType.NEW_FORM
                        ? "Data Entry Page"
                        : "Data Edit Page"}
                </h1>
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
                        {HelperFunctions.prettierDate(formContentObj.CreatedAt)}
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
                        className="h-7 border-2 border-gray-300 rounded max-w-[15rem] transform transition-transform duration-200 hover:scale-105"
                        aria-label="subject student number"
                        placeholder="UWA Student Number"
                        onKeyDown={HelperFunctions.handleKeyDown}
                        onPaste={HelperFunctions.handlePaste}
                        onChange={handleSubjectStudentIdChange}
                        value={subjectStudentNumber}
                    />
                </div>
                <h2 className="text-lg font-semibold my-3 text-gray-700">
                    <span className="text-gray-900 font-bold">
                        Form Started At:
                    </span>{" "}
                    {HelperFunctions.prettierDate(formStartedAt)}
                </h2>
            </div>
            <button
                className="bg-uwa-yellow font-bold h-10 w-36 rounded self-end transform transition-transform duration-200 hover:scale-105"
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
