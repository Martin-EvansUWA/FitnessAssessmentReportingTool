import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    FormTemplate as FormTemplateInterface,
    MeasurementType,
} from "../interface/formInterface";

const FormTemplate = ({
    previousSection,
    nextSection,
    formTemplate,
    formData,
    onNextPage,
    onPreviousPage,
    onInputChange,
}: {
    previousSection: string | null;
    nextSection: string | null;
    formTemplate: FormTemplateInterface;
    formData: { [key: string]: { [key: string]: any } };
    onNextPage: () => void;
    onPreviousPage: () => void;
    onInputChange: (
        section: string,
        field: string,
        value: string | number | boolean | null
    ) => void;
}) => {
    const handleChange = (
        section: string,
        field: string,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { type, checked, value } = event.target;
        const parsedValue =
            type === "checkbox"
                ? checked
                : type === "number"
                ? parseFloat(value)
                : value;
        onInputChange(section, field, parsedValue);
    };

    return (
        <div className="flex flex-col min-h-full justify-between">
            <div className="overflow-y-auto max-h-[100%]">
                {Object.keys(formTemplate).map((section) => (
                    <div key={section}>
                        <h1 className="text-2xl font-bold mb-5">{section}</h1>
                        <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                        <ul>
                            {Object.keys(formTemplate[section]).map((field) => (
                                <li
                                    key={field}
                                    className="my-2 flex flex-row justify-between items-center md:w-2/3"
                                >
                                    <label className="font-bold">
                                        {field}:
                                    </label>
                                    <input
                                        type={
                                            formTemplate[section][field] ===
                                                MeasurementType.int ||
                                            formTemplate[section][field] ===
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
                                                ? formTemplate[section][field]
                                                : undefined
                                        }
                                        className={
                                            formTemplate[section][field] !==
                                            MeasurementType.bool
                                                ? "border border-gray-300 rounded-md p-1 w-1/3"
                                                : "border border-gray-300 rounded-md p-1 w-6 h-6"
                                        }
                                        checked={
                                            formTemplate[section][field] ===
                                            MeasurementType.bool
                                                ? formData[section]?.[field] ||
                                                  false
                                                : undefined
                                        }
                                        value={
                                            formTemplate[section][field] !==
                                            MeasurementType.bool
                                                ? formData[section]?.[field] ||
                                                  ""
                                                : undefined
                                        }
                                        onChange={(event) =>
                                            handleChange(section, field, event)
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="text-black w-full flex flex-row justify-between">
                <button
                    title="previous-section"
                    className={
                        previousSection === null
                            ? "font-bold invisible"
                            : "font-bold"
                    }
                    onClick={onPreviousPage}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="fa-2xl" />
                    {previousSection}
                </button>
                <button
                    title="next-section"
                    className={
                        nextSection === null
                            ? "font-bold invisible"
                            : "font-bold"
                    }
                    onClick={onNextPage}
                >
                    {nextSection}
                    <FontAwesomeIcon icon={faChevronRight} className="fa-2xl" />
                </button>
            </div>
        </div>
    );
};

export default FormTemplate;
