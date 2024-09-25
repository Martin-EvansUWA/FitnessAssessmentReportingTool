import { Link, useLocation } from "react-router-dom";

// Temporary links for testing purposes
const ConditionalLinks = ({ className }: { className: string }) => {
    const location = useLocation();

    return (
        <div className={className}>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/form-history">
                        [Admin Workflow] Form mangaer, link to add form works
                    </Link>
                    <Link to="/student-form-manager">
                        [Student Workflow] Student Form Manager Page
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ConditionalLinks;
