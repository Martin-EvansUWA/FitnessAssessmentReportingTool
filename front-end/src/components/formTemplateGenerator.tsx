import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { backEndUrl } from "../global_helpers/constants";
import {
    FormTemplate,
    FormTemplateCreateResponse,
    MeasurementType,
} from "../interface/formInterface";

const initialTemplate: FormTemplate = {
    "Student Details": {
        Name: MeasurementType.str,
        Age: MeasurementType.int,
        Height: MeasurementType.float,
        Weight: MeasurementType.float,
    },
};

const FormTemplateGenerator = () => {
    const [template, setTemplate] = useState<FormTemplate>(initialTemplate);
    const [formTemplateTitle, setFormTemplateName] = useState<string>("");
    const [formTemplateDescription, setFormTemplateDescription] =
        useState<string>("");
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [newMeasurements, setNewMeasurements] = useState<{
        [key: string]: { name: string; type: string };
    }>({});
    const [responseData, setResponseData] =
        useState<FormTemplateCreateResponse | null>(null); // State to store response data

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("Template updated:", template);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [template]);

    const addNewCategory = useCallback((categoryName: string) => {
        if (!categoryName.trim()) return; // Prevent adding empty categories
        setTemplate((prevTemplate) => ({
            ...prevTemplate,
            [categoryName]: {},
        }));
        setNewCategoryName(""); // Clear input after adding
    }, []);

    const removeCategory = useCallback((categoryName: string) => {
        setTemplate((prevTemplate) => {
            const newTemplate = { ...prevTemplate };
            delete newTemplate[categoryName];
            return newTemplate;
        });
        setNewMeasurements((prevMeasurements) => {
            const newMeasurementsCopy = { ...prevMeasurements };
            delete newMeasurementsCopy[categoryName];
            return newMeasurementsCopy;
        });
    }, []);

    const addNewMeasurement = useCallback(
        (categoryName: string) => {
            if (!newMeasurements[categoryName]) return; // Prevent adding empty measurements
            if (
                !Object.keys(newMeasurements[categoryName]).includes("type") ||
                !Object.keys(newMeasurements[categoryName]).includes("name") ||
                !newMeasurements[categoryName].name.trim() ||
                !newMeasurements[categoryName].type.trim()
            ) {
                return; // Prevent adding measurements without both type and name
            }
            const { name, type } = newMeasurements[categoryName];
            setTemplate((prevTemplate) => ({
                ...prevTemplate,
                [categoryName]: {
                    ...prevTemplate[categoryName],
                    [name]: type,
                },
            }));
            // Reset new measurements after adding
            setNewMeasurements((prevMeasurements) => ({
                ...prevMeasurements,
                [categoryName]: { name: "", type: "" },
            }));
        },
        [newMeasurements]
    );

    const removeMeasurement = useCallback(
        (categoryName: string, measurementName: string) => {
            setTemplate((prevTemplate) => {
                const newTemplate = { ...prevTemplate };
                delete newTemplate[categoryName][measurementName];
                return newTemplate;
            });
        },
        []
    );

    const handleMeasurementChange = useCallback(
        (categoryName: string, field: string, value: string) => {
            setNewMeasurements((prevMeasurements) => ({
                ...prevMeasurements,
                [categoryName]: {
                    ...prevMeasurements[categoryName],
                    [field]: value,
                },
            }));
        },
        []
    );

    const saveFormTemplate = () => {
        const formTemplate = {
            Title: formTemplateTitle,
            Description: formTemplateDescription,
            StaffID: 1, // TODO: Replace with actual StaffID from session when implemented in backend
            FormTemplate: template,
            CreatedAt: new Date().toISOString(),
        };

        // Send form template to backend
        axios
            .post(`${backEndUrl}/create_form`, formTemplate, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Success:", response.data);
                setResponseData(response.data as FormTemplateCreateResponse); // Update responseData with the response data
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    // Display the Form Template ID after saving
    const showFormTemplateIdScreen = (
        <>
            <h1 className="text-2xl font-bold mb-5">Form Template Created</h1>
            <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
            <div className="mt-5 font-bold w-full text-center space-y-5">
                <p>Share this Form Template ID with your students!</p>
                <p className="text-xl">
                    FormTemplateID: {responseData?.FormTemplateID}
                </p>
            </div>
        </>
    );

    const formMetaData = (
        <>
            <div className="flex">
                <div className="flex flex-col w-full md:w-[30rem] space-y-3">
                    <div className="flex flex-row justify-between">
                        <label className="font-bold" htmlFor="formTitle">
                            Form Title:
                        </label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="border-2 border-gray-300 rounded-md h-7"
                            onChange={(e) =>
                                setFormTemplateName(e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="font-bold" htmlFor="formDescription">
                            Form Description:
                        </label>
                        <textarea
                            placeholder="Description"
                            className="border-2 border-gray-300 rounded-md resize h-7 min-h-7"
                            onChange={(e) =>
                                setFormTemplateDescription(e.target.value)
                            }
                        ></textarea>
                    </div>
                </div>
            </div>
            <hr className="w-full border-t-2 border-gray-300 mt-2" />
        </>
    );

    const returnToFormManagerButton = (
        <button
            onClick={() => setResponseData(null)} // TODO: Once Form Manager page is implemented, replace this with a redirect
            className="bg-uwa-yellow p-2 rounded-lg font-semibold text-sm hover:bg-[#ecab00]"
        >
            Return to Form Manager
        </button>
    );

    // Save Form button
    const saveFormTemplateButton = (
        <button
            onClick={() => saveFormTemplate()}
            className="bg-uwa-yellow p-2 rounded-lg font-semibold text-sm hover:bg-[#ecab00]"
        >
            Save Form
        </button>
    );

    const categories = useMemo(() => Object.keys(template), [template]);

    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-grow">
                {responseData ? (
                    showFormTemplateIdScreen
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-5">
                            Create New Form
                        </h1>
                        <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                        <p className="font-bold my-5">
                            Create a new form template by adding categories and
                            measurements.
                        </p>
                        {formMetaData}
                        <div>
                            {categories.map((category, index) => (
                                <div key={index} className="my-5">
                                    <div>
                                        <span className="text-lg font-bold mr-5">
                                            {category}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeCategory(category)
                                            }
                                            className="hover:text-uwa-yellow text-uwa-blue p-0 m-0"
                                            style={{
                                                background: "none",
                                                border: "none",
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                    <ul className="w-full md:w-80">
                                        {Object.keys(template[category]).map(
                                            (measurement, index) => (
                                                <li
                                                    key={index}
                                                    className="ml-2 md:ml-14 my-2"
                                                >
                                                    <div className="flex flex-row items-center justify-between">
                                                        <span className="text-sm basis-1/4">
                                                            <b>
                                                                {measurement}:
                                                            </b>
                                                        </span>
                                                        <span className="basis-1/4">
                                                            {
                                                                template[
                                                                    category
                                                                ][measurement]
                                                            }
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                removeMeasurement(
                                                                    category,
                                                                    measurement
                                                                )
                                                            }
                                                            className="hover:text-uwa-yellow text-uwa-blue p-0 m-0"
                                                            style={{
                                                                background:
                                                                    "none",
                                                                border: "none",
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                            />
                                                        </button>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                        <li className="ml-2 md:ml-14">
                                            <input
                                                type="text"
                                                placeholder="New Measurement"
                                                value={
                                                    newMeasurements[category]
                                                        ?.name || ""
                                                }
                                                onChange={(e) =>
                                                    handleMeasurementChange(
                                                        category,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-solid border border-uwa-blue mr-2 my-1"
                                            />
                                            <select
                                                aria-label="Measurement Type"
                                                value={
                                                    newMeasurements[category]
                                                        ?.type || ""
                                                }
                                                onChange={(e) =>
                                                    handleMeasurementChange(
                                                        category,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-solid border border-uwa-blue mr-2 my-1"
                                            >
                                                <option disabled value="">
                                                    - select type -
                                                </option>
                                                <option
                                                    value={MeasurementType.int}
                                                >
                                                    Integer
                                                </option>
                                                <option
                                                    value={MeasurementType.str}
                                                >
                                                    String
                                                </option>
                                                <option
                                                    value={
                                                        MeasurementType.float
                                                    }
                                                >
                                                    Float
                                                </option>
                                                <option
                                                    value={MeasurementType.bool}
                                                >
                                                    Boolean
                                                </option>
                                            </select>
                                            <button
                                                onClick={() =>
                                                    addNewMeasurement(category)
                                                }
                                                className="text-xl my-1 text-uwa-yellow hover:text-uwa-blue"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="New Category"
                                            value={newCategoryName}
                                            onChange={(e) =>
                                                setNewCategoryName(
                                                    e.target.value
                                                )
                                            }
                                            className="border-solid border border-uwa-blue mr-2"
                                        />
                                        <button
                                            onClick={() =>
                                                addNewCategory(newCategoryName)
                                            }
                                            className="text-xl text-uwa-yellow hover:text-uwa-blue"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div ref={bottomRef} />
            <div className="flex justify-end p-5">
                {responseData
                    ? returnToFormManagerButton
                    : saveFormTemplateButton}
            </div>
        </div>
    );
};

export default FormTemplateGenerator;
