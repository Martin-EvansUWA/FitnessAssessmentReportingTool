import { faPlus } from "@fortawesome/free-solid-svg-icons";
import FormTemplateGenerator from "../components/formTemplateGenerator";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummySidebarData: SidebarData = {
    title: "Form Manager",
    footer: [
        {
            text: "Create a new form",
            fontAwesomeIcon: faPlus,
            onClick: () => {
                console.log("Footer button clicked");
            },
        },
    ],
    sections: [
        {
            "SSEH2201 - Sem 1 2024": {
                sectionName: "SSEH2201 - Sem 1 2024",
                sectionLink: "/get-form-content/SSEH2201-Sem1-2024",
                sectionOnClick: () => {
                    console.log("SSEH2201 - Sem 1 2024 clicked");
                },
            },
            "SSEH3301 - Sem 2 2023": {
                sectionName: "SSEH3301 - Sem 2 2023",
                sectionLink: "/get-form-content/SSEH3301-Sem2-2023",
                sectionOnClick: () => {
                    console.log("SSEH3301 - Sem 2 2023 clicked");
                },
            },
            "SSEH3301 - Sem 1 2023": {
                sectionName: "SSEH3301 - Sem 1 2023",
                sectionLink: "/get-form-content/SSEH3301-Sem1-2023",
                sectionOnClick: () => {
                    console.log("SSEH3301 - Sem 1 2023 clicked");
                },
            },
        },
    ],
};

const CreateNewFormTemplatePage = () => {
    return (
        <Layout
            sidebarContent={dummySidebarData}
            mainContent={<FormTemplateGenerator />}
        ></Layout>
    );
};

export default CreateNewFormTemplatePage;
