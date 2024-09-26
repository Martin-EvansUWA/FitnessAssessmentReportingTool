const RegisterModal = () => {
    return (
        <>
            <div>
                <h2 style={{ fontSize: "32px" }}>I'm a Student!</h2>
                <br />
                <form style={{ lineHeight: "0.5" }}>
                    <input
                        type="text"
                        id="fname"
                        name="firstName"
                        placeholder="First Name"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="lname"
                        name="lastName"
                        placeholder="Last Name"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="number"
                        name="studentNumber"
                        placeholder="UWA Student Number"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Password"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        placeholder="Confirm Password"
                        style={{ border: "2px solid #d9d9d9", padding: "5px" }}
                    />
                    <br />
                    <br />
                    <a
                        href="#"
                        style={{
                            textDecorationLine: "underline",
                            marginRight: "10px",
                            color: "#6C6363",
                            fontWeight: "bold",
                        }}
                    >
                        I have an account
                    </a>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#ffc220",
                            color: "#003087",
                            padding: "10px",
                        }}
                    >
                        Register
                    </button>
                </form>
            </div>
        </>
    );
};

export default RegisterModal;
