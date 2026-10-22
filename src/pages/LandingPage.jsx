import { useState, useEffect } from "react"

import {GraduationCap, ShieldCheck, User, UsersRound, UserRoundGroup} from "lucide-react"

import "../styles/landingPage.css"
import Login from "./Login"
import hero1 from "../assets/hero1.webp"


export default function LandingPage() {
    const [showLogin, setShowLogin] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    function closeForm() {
        setIsFormClosing(true)

        setTimeout(() => {
            setShowLogin(false)
            setIsFormClosing(false)
        }, 300);
    }
    return (
        <>
            <main className="main fb-landingPage">
                <main className="landingPage fb-landingPage">
                    <nav className="nav-landingPage fb-landingPage">
                        <GraduationCap className="navIcon"/>
                        <p className="navTitle">EduConnect</p>
                    </nav>
                    <section className="body-landingPage fb-landingPage">

                        <p className="mainHeading">Better Learning for a <span>Bright Future</span></p>
                        <p className="desc-landingPage">Stay connected with your school, track progress and build a stronger tomorrow together</p>

                        <div className="roleBox fb-landingPage">

                            <div className="role-Admin role fb-landingPage">
                                <ShieldCheck className="roleAdminIcon"/>
                                <p className="roleLabel">Admin</p>
                            </div>

                            <div className="role-Teacher role fb-landingPage">
                                <User className="roleTeacherIcon"/>
                                <p className="roleLabel">Teacher</p>
                            </div>

                            <div className="role-Student role fb-landingPage">
                                <UsersRound className="roleStudentIcon"/>
                                <p className="roleLabel">Student</p>
                            </div>

                            <div className="role-Parent role fb-landingPage">
                                <UserRoundGroup className="roleParentIcon"/>
                                <p className="roleLabel">Parent</p>
                            </div>

                        </div>
                    <button className="showLoginBTN fb-landingPage" onClick={() => setShowLogin(true)}>Login</button>
                    </section>
                    {
                        showLogin && <div className={`overlayform fb-landingPage ${isFormClosing ? "closingForm" : ""}`}><Login closeForm={closeForm} /></div>
                    }
                </main>
                <img src={hero1} alt="" className="backgroundImg" />

            </main>
        </>
    )
}