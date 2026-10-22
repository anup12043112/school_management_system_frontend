import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({allowedRole}) {
    const {role} = useContext(AuthContext)
    if (role !== allowedRole){
        return <Navigate to="/" replace/>
    }
    return <Outlet />
}