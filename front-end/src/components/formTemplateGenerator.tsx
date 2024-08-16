import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { FormTemplate } from "../interface/formInterface";

const initialTemplate: FormTemplate = {
    "Student Details": {
        Name: "str",
        Age: "int",
        Height: "int",
        Mass: "int",
    },
};

const FormTemplateGenerator = () => {
    const [template, setTemplate] = useState(initialTemplate);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newMeasurementName, setNewMeasurementName] = useState("");
    const [newMeasurementType, setNewMeasurementType] = useState("int");

    // useEffect runs when the template state is updated
    useEffect(() => {
        console.log("Template updated:", template);
    }, [template]);

    // Function to add new category to the form template
    const addNewCategory = (categoryName: string) => {
        setTemplate({
            ...template,
            [categoryName]: {},
        });
    };

    // Function to remove category from the form template
    const removeCategory = (categoryName: string) => {
        const newTemplate = { ...template };
        delete newTemplate[categoryName];
        setTemplate(newTemplate);
    };

    // Function to add new measurement to the form template
    const addNewMeasurement = (
        categoryName: string,
        measurementName: string,
        measurementType: string
    ) => {
        setTemplate({
            ...template,
            [categoryName]: {
                ...template[categoryName],
                [measurementName]: measurementType,
            },
        });
    };

    // Function to remove measurement from the form template
    const removeMeasurement = (
        categoryName: string,
        measurementName: string
    ) => {
        const newTemplate = { ...template };
        delete newTemplate[categoryName][measurementName];
        setTemplate(newTemplate);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Create New Form</h1>
            <div>
                <div>
                    {Object.keys(template).map((category, index) => (
                        <div key={index}>
                            <h3 className="text-lg font-bold">{category}</h3>
                            <button onClick={() => removeCategory(category)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <ul>
                                {Object.keys(template[category]).map(
                                    (measurement, index) => (
                                        <li key={index}>
                                            <div>
                                                <span>
                                                    <b>{measurement}:</b>
                                                </span>
                                                <span>
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
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
                                        </li>
                                    )
                                )}
                                <li>
                                    <input
                                        type="text"
                                        placeholder="New Measurement"
                                        value={newMeasurementName}
                                        onChange={(e) =>
                                            setNewMeasurementName(
                                                e.target.value
                                            )
                                        }
                                        className="border-solid border-2 rounded-lg border-black"
                                    />
                                    <select
                                        aria-label="Measurement Type"
                                        onChange={(e) =>
                                            setNewMeasurementType(
                                                e.target.value
                                            )
                                        }
                                        className="border-solid border-2 rounded-lg border-black  mx-3"
                                    >
                                        <option value="int">Integer</option>
                                        <option value="str">String</option>
                                    </select>
                                    <button
                                        onClick={() =>
                                            addNewMeasurement(
                                                category,
                                                newMeasurementName,
                                                newMeasurementType
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="border-solid border-2 rounded-lg border-black"
                />
                <button onClick={() => addNewCategory(newCategoryName)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    );
};

export default FormTemplateGenerator;
