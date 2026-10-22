import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar"
import ParentNavbar from "../components/ParentNavbar"
import TeacherStudentNavBar from "../components/TeacherStudentNavBar"

const appLayoutArrangement = {
    width:"100%",
    display: "flex",
    height: "100vh"
}
const navDimensions = {
    width:"20%",
    height:"100vh"
}

export default function AppLayout() {
    const {role} = useContext(AuthContext)
    
    if (role === null) {
        return (
            <h2>Loading</h2>
        )
    }
    if (role === "admin") {
        return (
            <main style={appLayoutArrangement}>
                <AdminNavbar />
                <Outlet />
            </main>
        )
    }
    if (role === "parent") {
        return (
            <main style={appLayoutArrangement}>
                <ParentNavbar />
                <Outlet />
            </main>
        )
    }
    if (role === "teacher" || role === "student") {
        return (
            <main style={appLayoutArrangement}>
                <TeacherStudentNavBar />
                <Outlet />
            </main>
        )
    }

}