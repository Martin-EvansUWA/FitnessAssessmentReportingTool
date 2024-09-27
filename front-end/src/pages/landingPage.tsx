import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uwaSportScienceImg2 from "../assets/uwa-sport-science-2.jpg";
import uwaSportScienceImg3 from "../assets/uwa-sport-science-3.jpg";
import uwaSportScienceImg from "../assets/uwa-sport-science.jpg";
import LoginAndRegisterLayout from "../components/loginAndRegisterLayout";
import NavigationBar from "../components/navigationBar";

const LandingPage = () => {
    const imgCss = "object-cover w-1/3 border-8 rounded-3xl border-[#e0e0e0]";

    const navigate = useNavigate();

    useEffect(() => {
        const access_token = Cookies.get("access_token");
        // If the user is already logged in, redirect them to the correct page
        if (access_token) {
            const isAdmin = Cookies.get("isAdmin");
            if (isAdmin === "true") {
                navigate("/admin-form-manager");
            } else {
                navigate("/student-form-manager");
            }
        }
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen">
            <NavigationBar className="relative w-full h-16" />
            <LoginAndRegisterLayout className="flex md:absolute h-full w-full justify-center items-center" />
            <div className="hidden md:flex flex-1 flex-row justify-between w-full border-8 border-[#e0e0e0]">
                <img
                    src={uwaSportScienceImg}
                    alt="UWA Sport Science"
                    className={imgCss}
                />
                <img
                    src={uwaSportScienceImg2}
                    alt="UWA Sport Science"
                    className={imgCss}
                />
                <img
                    src={uwaSportScienceImg3}
                    alt="UWA Sport Science"
                    className={imgCss}
                />
            </div>
        </div>
    );
};

export default LandingPage;
