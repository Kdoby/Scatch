import Login from '../login/Login';
import Signup from '../login/Signup';

export default function AuthPage({ type }) {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                margin: 0,
                padding: 0,
                height: "100%"
            }}>
                <div style={{ backgroundColor: "#d9d9d9", }}>
                    <div style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "35px", fontWeight: "bold" }}>Scatch</div>
                    </div>
                </div>

                <div style={{ width: "70%", margin: "auto" }}>
                    {type === "login" ? <Login /> : <></>}
                    {type === "signup" ? <Signup /> : <></>}
                </div>
            </div>
        </div>
    );
}
