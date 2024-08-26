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
            <div
                className={`flex flex-col h-4/5 w-full items-center mx-2 md:mx-0 md:w-[768px] md:h-3/4 ${
                    isLogin ? "md:flex-row" : "md:flex-row-reverse"
                }`}
            >
                <div className="bg-white h-[85%] rounded-3xl w-full shadow-2xl md:w-2/3 md:h-full">
                    {isLogin ? loginContent : registerContent}
                </div>
                <div
                    className={`bg-uwa-blue shadow-2xl h-[15%] w-4/5 flex flex-col items-center justify-center rounded-b-3xl md:rounded-none md:w-1/3 md:h-2/3 ${
                        isLogin ? "md:rounded-r-3xl" : "md:rounded-l-3xl"
                    }`}
                >
                    <p className="font-bold text-white text-xl my-2 md:text-2xl md:my-10">
                        {isLogin ? "Create new account?" : "I have an account!"}
                    </p>
                    <button
                        onClick={toggleIsLogin}
                        className="bg-uwa-yellow w-1/2 h-8 font-bold text-sm"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginAndRegisterLayout;
