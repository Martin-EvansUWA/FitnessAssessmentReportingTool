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
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="*" element={<LandingPage />} />
            </Routes>
            <ConditionalLinks />
        </Router>
    );
}

// Temporary links for testing purposes
const ConditionalLinks = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/">Home</Link>
                    <Link to="/create-new-form-template">
                        Create New Form Template
                    </Link>
                    <Link to="/data-entry">Data Entry</Link>
                </div>
            )}
        </>
    );
};

export default App;
