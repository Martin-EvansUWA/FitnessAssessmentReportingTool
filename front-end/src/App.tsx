import {
    Link,
    Route,
    BrowserRouter as Router,
    Routes,
    useLocation,
} from "react-router-dom";
import "./App.css";
import CreateNewFormTemplatePage from "./pages/createNewFormTemplatePage";
import DataEntryPage from "./pages/dataEntryPage";
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
                <Route path="/get-new-form" element={<GetNewFormPage />} />
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

// Temporary links for testing purposes
export const ConditionalLinks = ({ className }: { className: string }) => {
    const location = useLocation();

    return (
        <div className={className}>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/">Home</Link>
                    <Link to="/create-new-form-template">
                        Create New Form Template
                    </Link>
                    <Link to="/get-new-form">Get New Form</Link>
                    <Link to="/data-entry">Data Entry</Link>
                </div>
            )}
        </div>
    );
};

export default App;
