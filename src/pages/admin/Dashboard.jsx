import "../../styles/admin/adminDash.css"
import { request } from "../../services/apiClient"
import { MessageSquareMore, UserPen, School, UsersRound, CircleUser, User2, UserRoundPlus, Ban, UserRound } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../context/DataContext"
import { capitalize } from "../../services/utils"
import { Link } from "react-router-dom"
import avtar from "../../assets/avtar.png"
import Loader from "../../components/Loader"


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
    const [selectedSection, setSelectedSection] = useState("all")
    const { profile } = useContext(DataContext)
    const { subjects } = useContext(DataContext)
    const { students } = useContext(DataContext)
    const { parents } = useContext(DataContext)
    const { teachers } = useContext(DataContext)
    const { sections } = useContext(DataContext)
    const { notice } = useContext(DataContext)
    const [teaching_assignment, setTeaching_assignment] = useState("")

    useEffect(() => {
        const getData = async () => {
            const teaching_assignment = await request({ url: "/api/teaching-assignments/", method: "GET" })
            if (teaching_assignment.status) {
                // console.log(teaching_assignment.data)
                setTeaching_assignment(teaching_assignment.data)
            }
        }
        getData()
    }, [])

    async function filterSec(e) {
        const val = e.target.value
        setSelectedSection(val)
        if (val === "all") {
            const req = await request({ url: "/api/teaching-assignments/", method: "GET" })
            if (req.status) {
                setTeaching_assignment(req.data)
            }
        } else {
            const req = await request({ url: `/api/teaching-assignments/?section=${val}`, method: "GET" })
            if (req.status) {
                setTeaching_assignment(req.data)
            }
        }
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

                <section className="statBoxContainer">
                    <div className="statBox">
                        <Stat border={"border_right"} Icon={UserRound} iconStyle={"purple"} header={"Total Students"} label={students ? students.length : "N/A"} />
                        <Stat border={"border_right"} Icon={UserRound} iconStyle={"blue"} header={"Total Parents"} label={parents ? parents.length : "N/A"} />
                        <Stat Icon={School} iconStyle={"green"} header={"Total Sections"} label={sections ? sections.length : "N/A"} />
                        <Stat border={"border_left"} Icon={UserRound} iconStyle={"orange"} header={"Total Teachers"} label={teachers ? teachers.length : "N/A"} />
                    </div>
                </section>

                <section className="quickUpdateContainer">
                    <section className="leftBox animation_right">
                        <div className="quickActionBTNBox">
                            <button className="quickAction">
                                <UserRoundPlus className="btnIcon" />
                                Add Teacher
                            </button>
                            <button className="quickAction">
                                <MessageSquareMore className="btnIcon" />
                                Add a Notice
                            </button>
                            <Link className="quickAction" to="/admin/profile">
                                <UserPen className="btnIcon" />
                                Edit Profile
                            </Link>
                        </div>

                        <div className="assigned_teachersBox">
                            <div className="nav_asT">
                                <p className="title">Assigned Teachers</p>
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
                                                <div className="assigned">
                                                    <p className="teacher_name">{e.teacher.user.first_name} {e.teacher.user.last_name}</p>
                                                    <p className="teacher_section"><strong>Section:</strong>{e.section.section}</p>
                                                    <p className="teacher_subject">{e.subject.subject}</p>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <Loader />
                                    )
                                }
                            </div>
                        </div>
                    </section>

                    <section className="rightBox animation_left">
                        <div className="nav_n">
                            <p className="noticeHead">Recent Notice</p>
                        </div>
                        <div className="noticeBox">
                            {
                                notice ? (
                                    notice.slice(0, 5).map(e => {
                                        return (
                                            <div className="notice">
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