const RegisterModal = () => {
    return (
        <div className="flex flex-col">
            <h2 className="text-4xl font-bold text-center mb-10">
                Hi, Nice to meet you!
            </h2>

            <form className="flex flex-col space-y-3 w-[90%] md:w-2/3 m-auto">
                <input
                    type="text"
                    id="fname"
                    name="firstName"
                    placeholder="First Name"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <input
                    type="text"
                    id="lname"
                    name="lastName"
                    placeholder="Last Name"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <input
                    type="text"
                    id="number"
                    name="studentNumber"
                    placeholder="UWA Student Number"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="UWA Email"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <input
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <input
                    type="text"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="border-2 border-gray-300 h-10 transform transition-transform duration-200 hover:scale-105"
                />

                <div className="flex flex-col space-y-2 justify-center md:flex-row md:space-x-5 md:space-y-0">
                    <button
                        type="submit"
                        className="bg-uwa-yellow text-black h-8 md:px-5 transform transition-transform duration-200 hover:scale-105"
                    >
                        Register
                    </button>
                </div>
            </form>

            <a
                href="#"
                className="text-center underline text-gray-600 font-bold mt-32"
            >
                I have an account
            </a>
        </div>
    );
};

export default RegisterModal;
