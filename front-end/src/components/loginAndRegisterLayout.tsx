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
                className={`flex items-center w-[768px] h-3/4 border-2 border-black ${
                    isLogin ? "flex-row" : "flex-row-reverse"
                }`}
            >
                <div className="bg-white h-full w-2/3 rounded-3xl shadow-2xl">
                    {isLogin ? loginContent : registerContent}
                </div>
                <div
                    className={`bg-uwa-blue h-2/3 w-1/3 shadow-2xl flex flex-col items-center justify-center ${
                        isLogin ? "rounded-r-3xl" : "rounded-l-3xl"
                    }`}
                >
                    <p className="font-bold text-white my-10 text-2xl">
                        {isLogin ? "Create new account?" : "I have an account!"}
                    </p>
                    <button
                        onClick={toggleIsLogin}
                        className="bg-uwa-yellow w-1/2 h-8 font-bold"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginAndRegisterLayout;
