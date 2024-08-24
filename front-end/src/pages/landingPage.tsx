import { ConditionalLinks } from "../App";
import uwaSportScienceImg from "../assets/uwa-sport-science.jpg";
import NavigationBar from "../components/navigationBar";

const LandingPage = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavigationBar className="" />
            <div className="flex flex-1 flex-row justify-between w-full">
                <div className="w-3/5">
                    <ConditionalLinks />
                </div>
                <img
                    src={uwaSportScienceImg}
                    alt="UWA Sport Science"
                    className="hidden md:flex object-cover w-2/5"
                />
            </div>
        </div>
    );
};

export default LandingPage;
