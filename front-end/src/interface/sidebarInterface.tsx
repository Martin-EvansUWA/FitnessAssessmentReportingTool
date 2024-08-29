import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface SidebarSection {
    [key: string]: {
        sectionName: string;
        sectionLink: string;
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
    footer: SideBarFooterButton | undefined;
    sections: SidebarSection[];
}
