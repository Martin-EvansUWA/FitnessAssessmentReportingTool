import "./App.css";
import FormTemplateGenerator from "./components/formTemplateGenerator";
import Layout from "./components/layout";

function App() {
    return (
        <>
            <Layout
                sidebarContent={<div></div>}
                mainContent={<FormTemplateGenerator />}
            ></Layout>
        </>
    );
}

export default App;
