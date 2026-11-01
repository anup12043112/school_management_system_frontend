import "../styles/components/loginForm.css"
import { User, CircleUser, LockKeyhole, LogIn, X, Heading3 } from "lucide-react"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { saveTokens } from "../services/utils"
import { request } from "../services/apiClient"
import { useNavigate } from "react-router-dom"
import { ActionButton } from "../components/Buttons"

function LoginInput({ Icon, type, placeholder, onChange }) {
    return (
        <div className="input_login">
            <Icon className="loginIcon" />
            <input type={type ? type : "text"} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}


export default function Login({ closeForm }) {
    const { setRole } = useContext(AuthContext)
    const { logout } = useContext(AuthContext)

    const [username, setUSername] = useState(null)
    const [password, setPassword] = useState(null)

    const [showBar, setShowBar] = useState(false)
    const [msg, setMsg] = useState("")



    const navigate = useNavigate()
    async function login() {
        logout()
        if (username===null || password === null){
            setMsg("You must fill all the fields.")
            return
        }
        setShowBar(true)

        const req = await request({ url: "/api/access/", method: "POST", body: { username, password } })
        if (req.data.access && req.data.refresh) {
            saveTokens(req.data.access, req.data.refresh)
            const req2 = await request({ url: "/api/auth/me/", method: "GET" })
            if (req2.status && req2.data.role) {
                setRole(req2.data.role)
                setMsg(`Welcome Back, ${username} !`)
                setShowBar(false)
                setTimeout(()=>{
                    navigate(`/${req2.data.role}/dashboard`)
                }, 1000)
            } else {
                setMsg("No active accound found with given cridentials")
                setShowBar(false)
                return
            }
        } else {
            setMsg("No active accound found with given cridentials")
            setShowBar(false)
            return
        }

    }

    return (
        <>
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
                            onChange={(e) => setUSername(e.target.value)}
                            placeholder="Username" />
                    </div>

                    <div className="inputField fb-loginForm">
                        <LockKeyhole className="inputIconStyle" />
                        <input
                            required
                            type="password"
                            className="input"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password" />
                    </div>

                    <button
                        type="button"
                        className="loginBTN fb-loginForm"
                        onClick={login}
                    >Login <LogIn className="loginIcon" /></button>
                </form>
            </main>
            <main className="loginForm">
                <section className="login_firstHalf">
                    <div className="img"></div>
                    <div className="closeBTNBox">
                        <ActionButton Icon={X} onClick={closeForm} iconStyle={"closeBTN"} />
                    </div>
                </section>
                <section className="login_secondHalf">
                    <form className="form">
                        <div className="formInputs">
                            <LoginInput Icon={User} placeholder={"Username"} onChange={(e) => setUSername(e.target.value)} />
                            <LoginInput Icon={LockKeyhole} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} type={"password"} />
                        </div>
                        <div className="formButtons">
                            <button type="button" className="loginBTN" onClick={login}>
                                {
                                    showBar ? (
                                        <div className="loginLoader"></div>
                                    ) : (
                                        <>Login <LogIn className="loginBTNIcon" /></>
                                    )
                                }
                            </button>
                        </div>
                    </form>
                    <div className="loginStatus">
                        {
                            msg && <p>{msg}</p>
                        }
                    </div>
                </section>
            </main>
        </>
    )
}