import { ReactNode } from "react";
import { SidebarData } from "./sidebarInterface";

export interface LayoutProps {
    sidebarContent: SidebarData;
    mainContent: ReactNode;
    selectedSectionProp?: number | null; // Optional prop for external control
    setSelectedSectionProp?: (index: number) => void; // Optional callback when a section is selected
}
