import "../../styles/admin/adminDash.css"
import { UserRoundCheck, House, SquarePercent, MessageSquareMore, UserPen, School, BookText, UsersRound, LogOut, CircleUser } from "lucide-react"
import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { DataContext } from "../../context/DataContext"
import { capitalize } from "../../services/utils"


export default function Dashboard(){
    const {profile} = useContext(DataContext)
    useEffect(()=>(
        console.log(profile)
    ), [])
    
    return (
        <main className="dashBody">
            <nav className="dashBodyNav">
                <CircleUser className="avtar"/>
                <div className="userInfoBox">
                    <p className="userName">{profile ? `${profile.first_name} ${profile.last_name}` : ""}</p>
                    <p className="userRole">{profile ? capitalize(String(profile.role)) : ""}</p>
                </div>
            </nav>
            <section className="dashBodySection"></section>
        </main>
    )
}