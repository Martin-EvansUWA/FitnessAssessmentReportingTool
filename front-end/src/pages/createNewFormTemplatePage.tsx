import FormTemplateGenerator from "../components/formTemplateGenerator";
import Layout from "../components/layout";

const CreateNewFormTemplatePage = () => {
    return (
        <Layout
            sidebarContent={<div></div>}
            mainContent={<FormTemplateGenerator />}
        ></Layout>
    );
};

export default CreateNewFormTemplatePage;
