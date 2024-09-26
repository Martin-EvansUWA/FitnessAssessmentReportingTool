const LoginModal = () => {
    return (
        <>
            <div>
                <h2 className="text-4xl">I'm a Student!</h2>
                <br />
                <form>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="UWA Email"
                        className="border-2 border-gray-300 p-1"
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="border-2 border-gray-300 p-1"
                    />
                    <br />
                    <br />
                    <button
                        type="submit"
                        className="bg-yellow-400 text-blue-900 mr-2 p-1"
                    >
                        Register
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-900 text-white p-1"
                    >
                        Login
                    </button>
                </form>
                <br />
                <a
                    href="#"
                    className="text-right underline text-gray-600 font-bold"
                >
                    Forgot Password
                </a>
            </div>
        </>
    );
};

export default LoginModal;
