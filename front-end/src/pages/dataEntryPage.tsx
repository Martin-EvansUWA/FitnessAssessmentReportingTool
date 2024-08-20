import { faSave, faSignOut } from "@fortawesome/free-solid-svg-icons";
import FormTemplate from "../components/formTemplate";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummyFormTemplateJSON: SidebarData = {
    title: "SSEH2201 Peer Fitness Testing Recording Sheet  - 2024 Sem 1",
    footer: [
        {
            text: "Save",
            fontAwesomeIcon: faSave,
            onClick: () => {
                console.log("Save button clicked");
            },
        },
        {
            text: "Save & Exit",
            fontAwesomeIcon: faSignOut,
            onClick: () => {
                console.log("Save & Exit button clicked");
            },
        },
    ],
    sections: [],
};

const DataEntryPage = () => {
    return (
        <Layout
            sidebarContent={dummyFormTemplateJSON}
            mainContent={<FormTemplate />}
        ></Layout>
    );
};

export default DataEntryPage;
