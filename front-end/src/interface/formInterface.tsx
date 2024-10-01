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

export interface FormTemplateJSON {
    FormTemplateID: number;
    UserID: number;
    FormTemplate: FormTemplate;
    Title: string;
    Description: string;
    CreatedAt: string;
}

export interface EditFormTemplateJSON extends FormTemplateJSON {
    SubjectUserID: string;
    FormStartedAt: string;
    UserFormResponse: { [key: string]: any };
}

export interface formTemplateTitleAndDescription {
    FormTemplateID: number;
    Title: string;
    Description: string;
}
