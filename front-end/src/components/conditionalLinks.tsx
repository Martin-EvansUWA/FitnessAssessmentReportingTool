import { Link, useLocation } from "react-router-dom";

// Temporary links for testing purposes
const ConditionalLinks = ({ className }: { className: string }) => {
    const location = useLocation();

    return (
        <div className={className}>
            {location.pathname === "/" && (
                <div className="flex space-x-10 justify-center">
                    <Link to="/create-new-form-template">
                        Create New Form Template
                    </Link>
                    <Link to="/get-new-form">Get New Form</Link>
                </div>
            )}
        </div>
    );
};

export default ConditionalLinks;
