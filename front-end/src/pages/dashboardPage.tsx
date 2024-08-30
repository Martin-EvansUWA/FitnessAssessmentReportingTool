import DashboardGenerator from "../components/dashboardGenerator";
import Layout from "../components/layout";
import { SidebarData } from "../interface/sidebarInterface";

const dummySidebarData: SidebarData = {
    title: "SSEH2201 - 2024 Sem1",
    footer: [],
    sections: [
        {
            "Body Composition": {
                sectionName: "Body Composition",
                
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
            mainContent={<DashboardGenerator />}
        ></Layout>
    );
};

export default DashboardPage;