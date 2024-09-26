const RegisterModal = () => {
    return (
        <>
            <div>
                <h2 className="text-4xl">I'm a Student!</h2>
                <br />
                <form className="leading-tight">
                    <input
                        type="text"
                        id="fname"
                        name="firstName"
                        placeholder="First Name"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="lname"
                        name="lastName"
                        placeholder="Last Name"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="number"
                        name="studentNumber"
                        placeholder="UWA Student Number"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Confirm Password"
                        className="border-2 border-gray-300 p-1.5"
                    />
                    <br />
                    <br />
                    <a
                        href="#"
                        className="underline mr-2.5 text-gray-600 font-bold"
                    >
                        I have an account
                    </a>
                    <button
                        type="submit"
                        className="bg-yellow-400 text-blue-900 p-2.5"
                    >
                        Register
                    </button>
                </form>
            </div>
        </>
    );
};

export default RegisterModal;
