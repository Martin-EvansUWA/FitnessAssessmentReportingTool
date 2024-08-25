import uwaSportScienceImg2 from "../assets/uwa-sport-science-2.jpg";
import uwaSportScienceImg3 from "../assets/uwa-sport-science-3.jpg";
import uwaSportScienceImg from "../assets/uwa-sport-science.jpg";
import ConditionalLinks from "../components/conditionalLinks";
import LoginAndRegisterLayout from "../components/loginAndRegisterLayout";
import NavigationBar from "../components/navigationBar";

const temporaryLoginContent = (
    <div className="flex items-center justify-center h-full">
        <div>
            <p className="font-bold text-2xl text-center m-20">
                This is placeholder login component. Below are the links to
                different pages for testing purposes.
            </p>
            <ConditionalLinks className={"font-bold mx-10"} />
        </div>
    </div>
);

const temporaryRegisterContent = (
    <div className="flex items-center justify-center h-full">
        <div>
            <p className="font-bold text-2xl text-center m-20">
                This is placeholder register component. Below are the links to
                different pages for testing purposes.
            </p>
            <ConditionalLinks className={"font-bold mx-10"} />
        </div>
    </div>
);

const LandingPage = () => {
    const imgCss =
        "hidden md:flex object-cover w-1/3 border-8 rounded-3xl border-[#e0e0e0]";

    return (
        <div className="flex flex-col h-screen">
            <NavigationBar className="relative w-full h-16" />
            <LoginAndRegisterLayout
                loginContent={temporaryLoginContent}
                registerContent={temporaryRegisterContent}
                className="absolute h-full w-full flex flex-row justify-center items-center"
            />
            <div className="flex flex-1 flex-row justify-between w-full border-8 border-[#e0e0e0]">
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
