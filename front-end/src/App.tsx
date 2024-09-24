import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateNewFormTemplatePage from "./pages/createNewFormTemplatePage";
import DashboardPage from "./pages/DashboardPage";
import DataEntryPage from "./pages/dataEntryPage";
import FormHistory from "./pages/FormManager";
import FormResults from "./pages/formResults";
import GetNewFormPage from "./pages/getNewFormPage";
import LandingPage from "./pages/landingPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/create-new-form-template"
                    element={<CreateNewFormTemplatePage />}
                />
                <Route path="/form-results" element={<FormResults />} />
                <Route path="/get-new-form" element={<GetNewFormPage />} />
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="/form-history" element={<FormHistory />} />
                <Route path="/dashboardPage" element={<DashboardPage />} />
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
