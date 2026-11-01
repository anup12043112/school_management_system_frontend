import { createContext } from "react";
import { useState, useEffect } from "react";
import { request } from "../services/apiClient"
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


    return (
        <AuthContext.Provider value={{ role, setRole, logout }}>
            {children}
        </AuthContext.Provider>
    )
}