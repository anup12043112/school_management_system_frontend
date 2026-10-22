import "../styles/admin/adminNav.css"
import { Link, useLocation } from "react-router-dom"
import { UserRoundCheck, House, SquarePercent, MessageSquareMore, UserPen, School, BookText, UsersRound, LogOut } from "lucide-react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"


export default function AdminNavbar() {
    const loc = useLocation()

    const currentPath = loc.pathname
    const {logout} = useContext(AuthContext)


    return (
        <nav className="navigation fb-nav">
            <section className="navContainer fb-nav">

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/dashboard") ? "selectedNavBTN" : ""}`} to="/admin/dashboard">
                    <House className="navBTNIconStyle" />
                    <p className="navigationLabel" to="/admin/dashboard">Dashboard</p>
                </Link>

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/users") ? "selectedNavBTN" : ""}`} to="/admin/users">
                    <UsersRound className="navBTNIconStyle" />
                    <p className="navigationLabel">Users</p>
                </Link>

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/sections")? "selectedNavBTN" : ""}`} to="/admin/sections">
                    <School className="navBTNIconStyle" />
                    <p className="navigationLabel">Section & Subjects</p>
                </Link>

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/attendance")? "selectedNavBTN" : ""}`} to="/admin/attendance">
                    <BookText className="navBTNIconStyle" />
                    <p className="navigationLabel">Attendance</p>
                </Link>

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/marks")? "selectedNavBTN" : ""}`} to="/admin/marks">
                    <SquarePercent className="navBTNIconStyle" />
                    <p className="navigationLabel">Marks</p>
                </Link>

                <Link className={`navBTN fb-nav ${currentPath.includes("/admin/notice")? "selectedNavBTN" : ""}`} to="/admin/notice">
                    <MessageSquareMore className="navBTNIconStyle" />
                    <p className="navigationLabel">Notice</p>
                </Link>

            </section>
            <section className="navContainer fb-nav nav-logoutBTNBox">
                <button className="logoutBTN fb-nav" onClick={logout}>
                    <LogOut className="navBTNIconStyle" />
                    Logout
                    </button>
            </section>
        </nav>
    )
}