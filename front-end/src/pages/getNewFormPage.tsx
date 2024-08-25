import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddNewForm from "../components/addNewForm";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummySidebarData: SidebarData = {
    title: "My Forms",
    footer: [
        {
            text: "Add a new form",
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
                sectionOnClick: () => {
                    console.log("SSEH2201 - Sem 1 2024 clicked");
                },
            },
        },
        {
            "SSEH3301 - Sem 2 2023": {
                sectionName: "SSEH3301 - Sem 2 2023",
                sectionOnClick: () => {
                    console.log("SSEH3301 - Sem 2 2023 clicked");
                },
            },
        },
        {
            "SSEH3301 - Sem 1 2023": {
                sectionName: "SSEH3301 - Sem 1 2023",
                sectionOnClick: () => {
                    console.log("SSEH3301 - Sem 1 2023 clicked");
                },
            },
        },
    ],
};

const GetNewFormPage = () => {
    return (
        <Layout
            sidebarContent={dummySidebarData}
            mainContent={<AddNewForm />}
        ></Layout>
    );
};

export default GetNewFormPage;