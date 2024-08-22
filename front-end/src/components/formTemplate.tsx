import { FormTemplate as FormTemplateInterface } from "../interface/formInterface";

const FormTemplate = ({
    formTemplate,
}: {
    formTemplate: FormTemplateInterface;
}) => {
    return (
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
                                            formTemplate[section][field] ===
                                            "int"
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
    );
};

export default FormTemplate;
