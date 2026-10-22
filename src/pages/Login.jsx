import "../styles/components/loginForm.css"
import { User, CircleUser, LockKeyhole, LogIn, X } from "lucide-react"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Login({ closeForm }) {
    const { login } = useContext(AuthContext)
    const [username, setUSername] = useState(null)
    const [password, setPassword] = useState(null)

    async function submitCredentials(){
        const logDetails = await login(username, password)
        console.log(logDetails)
    }

    return (
        <main className="formBody fb-loginForm">
            <div className="closeBTNBox fb-loginForm">
                <button className="closeBTN fb-loginForm" onClick={() => closeForm()}>
                    <X className="closeIconStyle" />
                </button>
            </div>
            <section className="loginHeader fb-loginForm">
                <CircleUser className="headerIconStyle" />
                <p className="loginHeadLabel">Login</p>
            </section>

            <form className="form fb-loginForm">
                <div className="inputField fb-loginForm">
                    <User className="inputIconStyle" />
                    <input
                        required
                        type="text"
                        className="input"
                        onChange={(e)=> setUSername(e.target.value)}
                        placeholder="Username" />
                </div>

                <div className="inputField fb-loginForm">
                    <LockKeyhole className="inputIconStyle" />
                    <input
                        required
                        type="password"
                        className="input"
                        onChange={(e)=> setPassword(e.target.value)}
                        placeholder="Password" />
                </div>

                <button
                    type="button"
                    className="loginBTN fb-loginForm"
                    onClick={submitCredentials}
                >Login <LogIn className="loginIcon" /></button>
            </form>
        </main>
    )
}