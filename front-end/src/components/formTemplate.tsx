import {
    FormTemplate as FormTemplateInterface,
    MeasurementType,
} from "../interface/formInterface";

const FormTemplate = ({
    formTemplate,
}: {
    formTemplate: FormTemplateInterface;
}) => {
    return (
        <div className="flex flex-col min-h-full">
            <div className="overflow-y-auto max-h-[100%]">
                {Object.keys(formTemplate).map((section, index) => (
                    <div key={index}>
                        <h1 className="text-2xl font-bold mb-5">{section}</h1>
                        <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                        <ul>
                            {Object.keys(formTemplate[section]).map(
                                (field, index) => (
                                    <li
                                        key={index}
                                        className="my-2 flex flex-row justify-between items-center md:w-1/2"
                                    >
                                        <label>{field}:</label>
                                        <input
                                            type={
                                                formTemplate[section][field] ===
                                                MeasurementType.int
                                                    ? "number"
                                                    : formTemplate[section][
                                                          field
                                                      ] ===
                                                      MeasurementType.float
                                                    ? "number"
                                                    : formTemplate[section][
                                                          field
                                                      ] === MeasurementType.bool
                                                    ? "checkbox"
                                                    : "text"
                                            }
                                            placeholder={
                                                formTemplate[section][field] !==
                                                MeasurementType.bool
                                                    ? formTemplate[section][
                                                          field
                                                      ]
                                                    : undefined
                                            }
                                            className={
                                                formTemplate[section][field] !==
                                                MeasurementType.bool
                                                    ? "border border-gray-300 rounded-md p-1 w-1/2"
                                                    : "border border-gray-300 rounded-md p-1 w-6 h-6"
                                            }
                                        />
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormTemplate;
