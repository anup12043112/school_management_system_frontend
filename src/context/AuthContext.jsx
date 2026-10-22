import { createContext } from "react";
import { useState, useEffect } from "react";
import { request } from "../services/apiClient"
import { saveTokens } from "../services/utils";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [role, setRole] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        if (token) {
            const getRole = async () => {
                const req = await request({ url: "/api/auth/me/", method: "GET" })
                if (req.status && req.data.role) {
                    setRole(req.data.role)
                }
            }
            getRole()
        }
    }, [])

    function logout() {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setRole(null)
        navigate("/")
    }

    async function login(username, password) {
        logout()
        const req = await request({ url: "/api/access/", method: "POST", body: { username, password } })
        if (req.data.access && req.data.refresh) {
            console.log(req.data)
            saveTokens(req.data.access, req.data.refresh)
            const req2 = await request({ url: "/api/auth/me/", method: "GET" })
            if (req2.status && req2.data.role) {
                setRole(req2.data.role)
                console.log("Role: ", req2.data.role)
                console.log(`Navigating to: /${req2.data.role}/dashboard`)
                navigate(`/${req2.data.role}/dashboard`)
            } else {
                console.log({ caution: "No active accound found with given cridentials" })
                return (
                    { caution: "No active accound found with given cridentials" }
                )
            }
        } else {
            console.log({ caution: "No active accound found with given cridentials" })
            return (
                { caution: "No active accound found with given cridentials" }
            )
        }

    }

    return (
        <AuthContext.Provider value={{ role, setRole, logout, login }}>
            {children}
        </AuthContext.Provider>
    )
}