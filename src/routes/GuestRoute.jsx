import {Navigate, Outlet} from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function GuestRoute(){
    const {role} = useContext(AuthContext)
    if (role === null){
        return <h2>Loading</h2>
    }
    if(!role){
        return <Outlet />
    }

    return <Navigate to={`/${role}/dashboard/`}/>
}