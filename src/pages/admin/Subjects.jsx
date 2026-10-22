import "../../styles/admin/adminSubjects.css"
import "../../styles/commonCSS.css"
import Loader from "../../components/Loader"
import { useState, useEffect, useContext } from "react"
import { request } from "../../services/apiClient"
import { DataContext } from "../../context/DataContext"
import { CircleUserIcon, SquarePen, Trash, X, Pen, BookSearch, BookText } from "lucide-react"

const AddNewSubject = ({ close }) => {
    const [sub, setSub] = useState(null)
    const [subCode, setSubCode] = useState(null)

    async function createSub() {
        if (sub && subCode) {
            const req = await request({ url: "/api/subject/", method: "POST", body: { code: subCode, subject: sub } })
            if (req.status) {
                close()
                alert("Created Sucessfully !")
            }
        } else {
            alert("Fill all required fields !")
            return
        }
    }

    return (
        <section className="addAttendanceBox"></section>
    )
}


export default function Subjects() {
    const { sections } = useContext(DataContext)
    const [attendance, setAttendance] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    let [currentPage, setCurrentPage] = useState(1)
    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")

    const [order, setOrder] = useState("")
    const [filter1, setFilter1] = useState("")
    const [filter2, setFilter2] = useState("")


    useEffect(() => {
        const getData = async () => {
            const res = await request({ url: "/api/attendance/", method: "GET" })

            if (res.data.previous) {
                setPrev(res.data.previous)
            } 

            if (res.data.next) {
                setNext(res.data.next)
            }

            if (res.status) {
                console.log("Attendance", res.data)
                setAttendance(res.data.results)
            }
        }
        getData()
    }, [])

    function closeForm() {
        setIsFormClosing(true)
        setTimeout(() => {
            setShowForm(false)
            setIsFormClosing(false)
        }, 300)
    }

    async function deleteAtt() {
        const del = await request({ url: `/api/attendance/${deleting}/`, method: "DELETE" })
        if (del.status) {
            alert("Deletion sucessful !")
        }
    }

    async function prevPage(url) {
        const u = new URL(url)
        const params = u.search
        const res = await request({ url: `/api/attendance/${params}`, method: "GET" })
        if (res.status) {
            setAttendance(res.data.results)
        }
        setCurrentPage(currentPage - 1)
        console.log(res.data.results)
        setPrev(res.data.previous)
        setNext(res.data.next)
    }

    async function nextPage(url) {
        const u = new URL(url)
        const params = u.search
        const res = await request({ url: `/api/attendance/${params}`, method: "GET" })
        if (res.status) {
            setAttendance(res.data.results)
        }
        setCurrentPage(currentPage + 1)
        console.log(res.data.results)
        setPrev(res.data.previous)
        setNext(res.data.next)
    }

    async function sortFilterList(order, filter1, filter2) {
        const params = new URLSearchParams()

        if (order) params.append("order", order)
        if (filter1) params.append("section", filter1)
        if (filter2) params.append("present", filter2)

        const res = await request({
            url: `/api/attendance/?${params.toString()}`
        })
        if (res.status) {
            setAttendance(res.data.results)
            setPrev(res.data.previous)
            setNext(res.data.next)
            setCurrentPage(1)
        }
    }

    return (
        <>
            <main className="attendance_admin">
                <section className="nav animation_left">
                    <button className="addNewRecordBTN" onClick={() => setShowForm(true)}>
                        <BookText className="icon" />
                        Add Attendance
                    </button>
                </section>

                <span className="attendanceIntro animation_left">
                    <p className="attendance_greet">Manage Attendance</p>
                </span>

                <div className="filterButtons animation_left">
                    <div className="sortBy">
                        <select onChange={(e) => {
                            const v = e.target.value 
                            setOrder(v)
                            sortFilterList(v, filter1, filter2)
                        }}>
                            <option value="-date" className="sortOptions">Date ↓</option>
                            <option value="date" className="sortOptions">Date ↑</option>
                            <option value="name" className="sortOptions">Name (A-Z)</option>
                            <option value="-name" className="sortOptions">Name (Z-A)</option>
                        </select>
                    </div>

                    <div className="filterBTNBox">
                        <select onChange={(e) => {
                            const v = e.target.value 
                            setFilter1(v)
                            sortFilterList(order, v, filter2)
                        }}>
                            <option value="" className="filterBySec">All Sections</option>
                            {
                                sections ? (
                                    sections.map(sec => {
                                        return <option value={sec.section} className="sortOptions">{sec.section}</option>
                                    })
                                ) : (
                                    <option value="" className="sortOptions">No options</option>
                                )
                            }
                        </select>
                        <select onChange={(e) => {
                            const v = e.target.value 
                            setFilter2(v)
                            sortFilterList(order, filter1, v)
                        }}>
                            <option value="" className="sortOptions">Present/Absent</option>
                            <option value="true" className="sortOptions">Present</option>
                            <option value="false" className="sortOptions">Absent</option>
                        </select>
                    </div>
                </div>

                <section className="attendanceBox animation_right">
                    <div className="header">
                        <BookText className="icon" />
                        <p>Attendance Record</p>
                    </div>
                    {
                        attendance ? (
                            <section className="atten_box">
                                {
                                    attendance.map(att => {
                                        return (
                                            <div className={`attendance ${att.attendance ? "presentBox" : "absentBox"}`}>
                                                <CircleUserIcon className="icon_att" />
                                                <span>
                                                    <p className="name">{att.student.user.first_name} {att.student.user.last_name}</p>
                                                    <p className="section"> <strong>Section: </strong> {att.student.section}</p>
                                                </span>
                                                <p className="date">{att.date}</p>
                                                <p className={`status ${att.attendance ? "present" : "absent"}`}>{att.attendance ? "Present" : "Absent"}</p>

                                            </div>
                                        )
                                    })
                                }
                            </section>
                        ) : (
                            <Loader />
                        )
                    }

                    <div className="pageChangingButtons">
                        {
                            prev && <button className="changePG" onClick={() => prevPage(prev)}>{currentPage - 1}</button>
                        }
                        <button className="changePG" style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>{currentPage}</button>
                        {
                            next && <button className="changePG" onClick={() => nextPage(next)}>{currentPage + 1}</button>
                        }
                    </div>
                </section>
            </main>
            {
                showForm && <div className={`overlay_addSec fb_sec ${isFormClosing ? "overlay_addSec_closing" : ""}`}>
                    <AddNewSubject close={closeForm} />
                </div>
            }
        </>
    )
}