// Interface for form template JSON
export interface FormTemplate {
    [key: string]: {
        [key: string]: string;
    };
}

export const MeasurementType: { [key: string]: string } = {
    int: "Integer",
    str: "String",
    float: "Float",
    bool: "Boolean",
};

export interface FormTemplateCreateResponse {
    FormTemplateID: number;
}
