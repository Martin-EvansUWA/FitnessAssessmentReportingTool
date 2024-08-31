import { Link, useLocation } from "react-router-dom";

// Temporary links for testing purposes
const ConditionalLinks = ({ className }: { className: string }) => {
    const location = useLocation();

    return (
        <div className={className}>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/">Home</Link>
                    <Link to="/dashboardGenerator">Dashboard</Link>
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

export default ConditionalLinks;
