import { useState } from "react";

const FormTemplate = () => {
    const [formTemplate, setFormTemplate] = useState<{
        [key: string]: {
            [key: string]: string;
        };
    } | null>(null);

    // Dummy JSON data to represent the form template
    const dummyFormTemplateJSON = {
        "Student Details": {
            Name: "str",
            Age: "int",
            Height: "int",
            Mass: "int",
        },
        Flexibility: {
            "Sit & Reach Test": "int",
        },
        "Muscular Strength": {
            "Grip Strength": "int",
            "Bench Press": "int",
            "Leg Press": "int",
        },
        "Cardiovascular Endurance": {
            "12-minute Run": "int",
        },
    };

    // Function to recieve the form template JSON and set it to the state
    const getFormTemplate = () => {
        // TODO: Fetch the form template JSON from the server in the future
        setFormTemplate(dummyFormTemplateJSON);
    };

    return (
        <div>
            <button onClick={getFormTemplate}>Get Form Template</button>
            {formTemplate && (
                <div>
                    {Object.keys(formTemplate).map((section, index) => (
                        <div key={index}>
                            <h2 className="text-xl font-bold">{section}</h2>
                            <ul>
                                {Object.keys(formTemplate[section]).map(
                                    (field, index) => (
                                        <li
                                            key={index}
                                            className="grid justify-items-start "
                                        >
                                            <label>{field}</label>
                                            <input
                                                type={
                                                    formTemplate[section][
                                                        field
                                                    ] === "int"
                                                        ? "number"
                                                        : "text"
                                                }
                                                placeholder={
                                                    formTemplate[section][field]
                                                }
                                                className="border border-gray-300 rounded-md p-1 w-40"
                                            />
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormTemplate;
