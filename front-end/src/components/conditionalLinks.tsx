import { Link, useLocation } from "react-router-dom";

// Temporary links for testing purposes
const ConditionalLinks = ({ className }: { className: string }) => {
    const location = useLocation();

    return (
        <div className={className}>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/">Home</Link>
                    <Link to="/dashboardPage">Dashboard [student]</Link>
                    <Link to="/form-history">
                        [Admin Workflow] Form mangaer, link to add form works 
                    </Link>
                    <Link to="/get-new-form">
                        [Student Workflow] Get New Form Template
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ConditionalLinks;
