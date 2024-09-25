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
    StudentID: number;
    SubjectStudentID: number;
    IsComplete: boolean;
    CreatedAt: string;
    CompletedAt: string;
}
