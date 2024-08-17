import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormTemplate, MeasurementType } from "../interface/formInterface";

const initialTemplate: FormTemplate = {
    "Student Details": {
        Name: MeasurementType.str,
        Age: MeasurementType.int,
        Height: MeasurementType.float,
        Weight: MeasurementType.float,
        "Is Student": MeasurementType.bool,
    },
};

const FormTemplateGenerator = () => {
    const [template, setTemplate] = useState<FormTemplate>(initialTemplate);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [newMeasurements, setNewMeasurements] = useState<{
        [key: string]: { name: string; type: string };
    }>({});

    useEffect(() => {
        console.log("Template updated:", template);
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

    const categories = useMemo(() => Object.keys(template), [template]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">Create New Form</h1>
            <div>
                {categories.map((category, index) => (
                    <div key={index} className="my-6">
                        <div>
                            <span className="text-lg font-bold mr-5">
                                {category}
                            </span>
                            <button onClick={() => removeCategory(category)}>
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
                                                <b>{measurement}:</b>
                                            </span>
                                            <span className="basis-1/4">
                                                {
                                                    template[category][
                                                        measurement
                                                    ]
                                                }
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeMeasurement(
                                                        category,
                                                        measurement
                                                    )
                                                }
                                                className="basis-1/4"
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
                                        newMeasurements[category]?.name || ""
                                    }
                                    onChange={(e) =>
                                        handleMeasurementChange(
                                            category,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="border-solid border border-black mr-2 my-1"
                                />
                                <select
                                    aria-label="Measurement Type"
                                    value={
                                        newMeasurements[category]?.type || ""
                                    }
                                    onChange={(e) =>
                                        handleMeasurementChange(
                                            category,
                                            "type",
                                            e.target.value
                                        )
                                    }
                                    className="border-solid border border-black mr-2 my-1"
                                >
                                    <option disabled value="">
                                        - select type -
                                    </option>
                                    <option value={MeasurementType.int}>
                                        Integer
                                    </option>
                                    <option value={MeasurementType.str}>
                                        String
                                    </option>
                                    <option value={MeasurementType.float}>
                                        Float
                                    </option>
                                    <option value={MeasurementType.bool}>
                                        Boolean
                                    </option>
                                </select>
                                <button
                                    onClick={() => addNewMeasurement(category)}
                                    className="my-1"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </li>
                        </ul>
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border-solid border border-black mr-2"
                />
                <button onClick={() => addNewCategory(newCategoryName)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    );
};

export default FormTemplateGenerator;
