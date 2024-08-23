import FormTemplateGenerator from "../components/formTemplateGenerator";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummySidebarData: SidebarData = {
    title: "SSEH2201 - 2024 Sem1",
    footer: undefined,
    sections: [
        {
            "Body Composition": {
                sectionName: "Body Composition",
                sectionLink: "",
                sectionOnClick: () => {
                    console.log("Body Composition");
                },
            },
        },
    ],
};

const DashboardPage = () => {
    return (
        <Layout
            sidebarContent={dummySidebarData}
            mainContent={<FormTemplateGenerator />}
        ></Layout>
    );
};

export default DashboardPage;
