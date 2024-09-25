import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CreateNewFormTemplatePage from "./pages/createNewFormTemplatePage";
import DataEntryPage from "./pages/dataEntryPage";
import FormHistory from "./pages/FormManager";
import FormResults from "./pages/formResults";
import LandingPage from "./pages/landingPage";
import StudentFormManagerPage from "./pages/studentFormManagerPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Add all the routes here */}
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/create-new-form-template"
                    element={<CreateNewFormTemplatePage />}
                />
                <Route path="/form-results" element={<FormResults />} />
                <Route
                    path="/student-form-manager"
                    element={<StudentFormManagerPage />}
                />
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="/form-history" element={<FormHistory />} />
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
