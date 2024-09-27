import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import FormHistory from "./pages/adminFormManagerPage";
import DataEntryPage from "./pages/dataEntryPage";
import FormResults from "./pages/formResults";
import LandingPage from "./pages/landingPage";
import StudentFormManagerPage from "./pages/studentFormManagerPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Add all the routes here */}
                <Route path="/" element={<LandingPage />} />
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
