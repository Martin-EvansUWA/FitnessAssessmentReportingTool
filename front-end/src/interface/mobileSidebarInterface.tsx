import { SidebarData } from "./sidebarInterface";

export interface MobileSideBarProps {
    content: SidebarData;
    className?: string;
    isNavBarMenuOpen?: boolean; // Optional prop for external control
}
