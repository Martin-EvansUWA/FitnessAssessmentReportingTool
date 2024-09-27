import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface SidebarSection {
    [key: string]: {
        sectionName: string;
        sectionOnClick: () => void;
    };
}

export interface SideBarFooterButton {
    text: string;
    fontAwesomeIcon: IconProp;
    onClick: () => void;
}

export interface SidebarData {
    title: string;
    titleOnClick?: () => void; // Optional button click event
    footer: SideBarFooterButton[];
    sections: SidebarSection[];
}

export interface formHistorySidebarInfo {
    FactUserFormID: number;
    UserFormResponseID: number;
    FormTemplateID: number;
    title: string;
    UserID: number;
    SubjectUserID: number;
    IsComplete: boolean;
    CreatedAt: string;
    CompletedAt: string;
}

export interface formHistorySidebarInfoAdmin {
    FormTemplateID: number;
    Title: string;
    CreatedAt: string;
}


export interface FormSubmission {
    student_id: number;
    first_name: string;
    last_name: string;
    subject_ID: number;
    submission_time: string;
}

export interface FormDetails {
    form_template_id: number;
    title: string;
    description: string;
    created_at: string;
}

export interface SpecificStudentData {
    student_id: number;
    first_name: string;
    last_name: string;
    responce_id: number;
    responses: any; // Modify as per actual structure
}