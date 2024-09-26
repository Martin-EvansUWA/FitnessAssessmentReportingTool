const LoginModal = () => {
    return(
        <>
        <div style={{border: "2px solid #d9d9d9", borderRadius: "8px", backgroundColor: "white", textAlign: "center", width: "340px", height: "419px", position: "absolute", left: "37.5%", top: "25%", paddingTop: "73.5px"}}>
            <h2 style={{fontSize: "32px"}}>I'm a Student!</h2><br/>
            <form>
                <input type="email"  id="email" name="email" placeholder="Email" style={{border: "2px solid #d9d9d9", padding: "5px"}}/><br/><br/>
                <input type="text" id="password" name="password" placeholder="Password" style={{border: "2px solid #d9d9d9", padding: "5px"}}/><br/><br/>
                <button type="submit" style={{backgroundColor: "#ffc220", color: "#003087", marginRight: "10px", padding: "5px"}}>Register</button>
                <button type="submit" style={{backgroundColor: "#003087", color: "white", padding: "5px"}}>Login</button>
            </form><br/>
            <a href="#" style={{textAlign: "right", textDecorationLine: "underline", color: "#6C6363", fontWeight: "bold"}}>Forgot Password</a>
        </div>
        </>
    );
};

export default LoginModal