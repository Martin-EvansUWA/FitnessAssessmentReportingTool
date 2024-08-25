import React from "react";
import { LoginAndRegisterLayoutProps } from "../interface/loginAndRegisterInterface";

const LoginAndRegisterLayout: React.FC<LoginAndRegisterLayoutProps> = ({
    loginContent = <></>,
    registerContent = <></>,
    className = "",
}) => {
    const [isLogin, setIsLogin] = React.useState(true);

    const toggleIsLogin = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div className={`${className}`}>
            <div className="flex flex-col h-4/5 w-full items-center mx-2 md:mx-0 md:w-[768px] md:h-3/4 relative overflow-hidden">
                {/* Login */}
                <div
                    className={`relative flex flex-col w-full h-full md:flex-row md:absolute ${
                        isLogin ? "z-20" : "z-10"
                    }`}
                >
                    <div
                        className={`transition-transform duration-500 ease-in-out ${
                            isLogin
                                ? "translate-x-0"
                                : "translate-x-full md:translate-x-1/2"
                        } bg-white h-[85%] rounded-3xl w-full md:w-2/3 md:h-full`}
                    >
                        {loginContent}
                    </div>
                    <div
                        className={`bg-uwa-blue h-[15%] w-4/5 flex flex-col items-center justify-center rounded-b-3xl md:rounded-none md:w-1/3 md:h-2/3 md:rounded-r-3xl absolute top-1/2 right-0 transform -translate-y-1/2 transition-opacity duration-500 ease-in-out ${
                            isLogin
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <p className="font-bold text-white text-xl my-2 md:text-2xl md:my-10">
                            Create new account?
                        </p>
                        <button
                            onClick={toggleIsLogin}
                            className="bg-uwa-yellow w-1/2 h-8 font-bold text-sm"
                        >
                            Register
                        </button>
                    </div>
                </div>
                {/* Register */}
                <div
                    className={`absolute flex flex-col md:flex-row-reverse w-full h-full  ${
                        isLogin ? "z-10" : "z-20"
                    }`}
                >
                    <div
                        className={`transition-transform duration-500 ease-in-out ${
                            isLogin ? "-translate-x-1/2" : "translate-x-0"
                        } bg-white h-[85%] rounded-3xl w-full md:w-2/3 md:h-full`}
                    >
                        {registerContent}
                    </div>
                    <div
                        className={`bg-uwa-blue h-[15%] w-4/5 flex flex-col items-center justify-center rounded-b-3xl md:rounded-none md:w-1/3 md:h-2/3 md:rounded-l-3xl absolute top-1/2 left-0 transform -translate-y-1/2 transition-opacity duration-500 ease-in-out ${
                            isLogin
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
                    >
                        <p className="font-bold text-white text-xl my-2 md:text-2xl md:my-10">
                            I have an account!
                        </p>
                        <button
                            onClick={toggleIsLogin}
                            className="bg-uwa-yellow w-1/2 h-8 font-bold text-sm"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAndRegisterLayout;
