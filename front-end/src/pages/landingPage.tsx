import uwaSportScienceImg2 from "../assets/uwa-sport-science-2.jpg";
import uwaSportScienceImg3 from "../assets/uwa-sport-science-3.jpg";
import uwaSportScienceImg from "../assets/uwa-sport-science.jpg";
import ConditionalLinks from "../components/conditionalLinks";
import NavigationBar from "../components/navigationBar";

const LandingPage = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavigationBar className="" />
            <div className="absolute top-1/2 w-full bg-uwa-blue">
                <p className="text-lg text-center font-bold text-white">
                    This is a temporary landing page. In the future, this page
                    will include the login/register components.
                </p>
                <ConditionalLinks className="text-white" />
            </div>
            <div className="flex flex-1 flex-row justify-between w-full">
                <img
                    src={uwaSportScienceImg}
                    alt="UWA Sport Science"
                    className="hidden md:flex object-cover w-1/3"
                />
                <img
                    src={uwaSportScienceImg2}
                    alt="UWA Sport Science"
                    className="hidden md:flex object-cover w-1/3"
                />
                <img
                    src={uwaSportScienceImg3}
                    alt="UWA Sport Science"
                    className="hidden md:flex object-cover w-1/3"
                />
            </div>
        </div>
    );
};

export default LandingPage;
