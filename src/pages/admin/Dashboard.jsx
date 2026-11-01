import "../../styles/admin/adminDash.css"
import { request } from "../../services/apiClient"
import { MessageSquareMore, School, UsersRound, Megaphone } from "lucide-react"
import { useEffect, useState, useContext } from "react"
import { capitalize } from "../../services/utils"
import { DataContext } from "../../context/DataContext"

import avtar from "../../assets/avtar.png"
import user from "../../assets/user.jpg"

import Loader from "../../components/Loader"
import { HeadingLg, HeadingMd } from "../../components/Headings"


function Stat({ border, Icon, iconStyle, headerStyle, statStyle, header, label }) {
    return (
        <div className={`stat ${border ? border : ""}`}>
            <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />
            <p className={`statHeader ${headerStyle ? headerStyle : ""}`}>{header}</p>
            <p className={`statNum ${statStyle ? statStyle : ""}`}>{label}</p>
        </div>
    )
}


export default function Dashboard() {
    const {teaching_assignment, fetchTeachingAssignment} = useContext(DataContext)
    const {students, fetchStudents} = useContext(DataContext)
    const {teachers, fetchTeachers} = useContext(DataContext)
    const {sections, fetchSections} = useContext(DataContext)
    const {notice, fetchNotice} = useContext(DataContext)
    const {parents, fetchParents} = useContext(DataContext)
    const {profile, fetchProfile} = useContext(DataContext)
    

    useEffect(()=>{
        fetchTeachingAssignment()
        if (!students){
            fetchStudents()
        }
        if (!teachers){
            fetchTeachers()
        }
        if (!sections){
            fetchSections()
        }
        if (!notice){
            fetchNotice()
        }
        if (!parents){
            fetchParents()
        }
        if (!profile){
            fetchProfile()
        }
    }, [])

    async function filterSec(e) {
        fetchTeachingAssignment(e)
    }

    return (
        <>
            <main className="dashboard_admin">
                <section className="nav">
                    <section className="profileBox animation_left">
                        <img
                            src={avtar} className="profileImg" />
                        <span className="profileInfo">
                            <p className="name">{profile ? `${profile.first_name} ${profile.last_name}` : ""}</p>
                            <p className="role">{profile ? `${capitalize(String(profile.role))}` : ""}</p>
                        </span>
                    </section>
                </section>

                <span className="dashboardIntro animation_right">
                    <p className="dashboard">Admin Dashboard</p>
                    <p className="dashboard_greet">Welcome back, Admin !</p>
                </span>

                <section className="statBoxContainer animation_right">
                    <div className="statBox">
                        <Stat border={"border_right"} Icon={UsersRound} iconStyle={"purple"} header={"Total Students"} label={students ? students.length : "N/A"} />
                        <Stat border={"border_right"} Icon={UsersRound} iconStyle={"blue"} header={"Total Parents"} label={parents ? parents.length : "N/A"} />
                        <Stat Icon={School} iconStyle={"green"} header={"Total Sections"} label={sections ? sections.length : "N/A"} />
                        <Stat border={"border_left"} Icon={UsersRound} iconStyle={"orange"} header={"Total Teachers"} label={teachers ? teachers.length : "N/A"} />
                    </div>
                </section>

                <section className="quickUpdateContainer">

                    <section className="assigned_teachersBox animation_right">
                        <div className="nav_asT">
                            <HeadingLg Icon={UsersRound} label={"Assigned Teachers"} />
                            <select className="filterBTN" onChange={e => filterSec(e)}>
                                <option className="option" value="all">All Sections</option>
                                {
                                    sections ? (
                                        sections.map(sec => {
                                            return <option className="option" key={sec.id} value={sec.section}>{sec.section}</option>
                                        })
                                    ) : (
                                        <option className="option" value="">Nothing at all</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className="listBox">
                            {
                                teaching_assignment ? (
                                    teaching_assignment.map(e => {
                                        return (
                                            <div className="assigned" key={e.id}>
                                                <div className="uHalf">
                                                    <p className="name">{e.teacher.user.first_name} {e.teacher.user.last_name}</p>
                                                    <img src={user} alt="logo" />
                                                </div>
                                                <div className="lHalf">
                                                    <p className="subject">{e.subject.subject}</p>
                                                    <p className="section">( {e.section.section} )</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <Loader />
                                )
                            }
                        </div>
                    </section>

                    <section className="rightBox animation_left">
                        <div className="nav_n">
                            <HeadingMd Icon={Megaphone} label={"Recent Notice"} />
                        </div>
                        <div className="noticeBox">
                            {
                                notice ? (
                                    notice.slice(0, 5).map(e => {
                                        return (
                                            <div className="notice" key={e.id}>
                                                <MessageSquareMore className="noticeIcon" />
                                                <div className="noticeInfo">
                                                    <p className="notice_header">{e.header}</p>
                                                    <p className="postedBy"><strong>Posted By:</strong> {e.posted_by}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <Loader />
                                )
                            }
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}