import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateNewFormTemplatePage from "./pages/createNewFormTemplatePage";
import DataEntryPage from "./pages/dataEntryPage";
import GetNewFormPage from "./pages/getNewFormPage";
import LandingPage from "./pages/landingPage";
import DashboardPage from "./pages/dashboardPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/create-new-form-template"
                    element={<CreateNewFormTemplatePage />}
                />
                <Route path="/get-new-form" element={<GetNewFormPage />} />
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>

    );
}

export default App;
