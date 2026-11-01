import "../../styles/admin/adminSubjects.css"
import "../../styles/commonCSS.css"
import { useState, useEffect} from "react"
import { request } from "../../services/apiClient"
import { CircleUserIcon, Trash, BookText, SquarePen } from "lucide-react"

import { NewRecordButton, ActionButton, FormButton, ChangePageButton } from "../../components/Buttons"
import Loader from "../../components/Loader"
import { HeadingLg, OverlayHead } from "../../components/Headings"
import { Input } from "../../components/Loader"
import { Status } from "../../components/Loader"



function AddNewRecord({ close, instance, status, isDone, setMsg, reflectChange }) {
    const [userObj, setUserObj] = useState(instance || {})
    const { students } = useContext(DataContext)


    async function performAction() {
        console.log(userObj)
        console.log(instance)
        console.log(userObj === instance)
        if (userObj.student_id && typeof userObj.attendance === "boolean" && userObj.date && userObj.date) {
            if (Object.keys(instance || {}).length === 0) {
                // CREATION 
                const res = await request({ url: "/api/attendance/", method: "POST", body: userObj })
                console.log(res)
                status()
                if (res.status && res.data.id) {
                    console.log(res.data.id)
                    isDone()
                    close()
                    setMsg(`Attendance is created successfully.`)
                    reflectChange()
                    setUserObj({})
                } else {
                    status()
                    setMsg("Something went wrong")
                }
            } else {
                // MODIFICATION 
                const res = await request({ url: `/api/attendance/${userObj.id}/`, method: "PATCH", body: userObj })
                console.log(res)
                status()
                if (res.data.id) {
                    isDone()
                    close()
                    setMsg(`Attendance is updated successfully.`)
                    reflectChange()
                } else {
                    setMsg(`Can't update the User right now, try again later.`)
                }
            }

        } else {
            setMsg("Every field is required.")
        }
    }

    function setValue(e) {
        setUserObj(prev => (
            { ...prev, [e.target.name]: e.target.value }
        ))
    }
    function setBooleanValue(e) {
        if (e.target.value === "true") {
            setUserObj(prev => (
                { ...prev, [e.target.name]: true }
            ))
        } else {
            setUserObj(prev => (
                { ...prev, [e.target.name]: false }
            ))
        }
    }
    return (
        <main className="newRecordAtt">
            <div className="headAtt">
                <OverlayHead Icon={BookText} label={"Add Attendance"} onClick={close} />
            </div>

            <form className="bodyAtt">

                <div className="inputSet">
                    {
                        Object.keys(instance || {}).length === 0 ? (
                            <span>
                                <p>Select Student</p>
                                <select name="student_id" onChange={e => setValue(e)}>
                                    <option value="" disabled selected>Select Student</option>
                                    {
                                        students ? (
                                            students.map(stu => {
                                                return <option value={stu.id} >{stu.user.username}</option>
                                            })
                                        ) : (
                                            <option value="" disabled>Unable to fetch student list</option>
                                        )
                                    }
                                </select>
                            </span>
                        ) : (
                            <Input name={"student_id"} label={"Student"} value={userObj.student ?? ""} readOnly={true} />
                        )
                    }
                    <span>
                        <p>Attendance</p>
                        <select name="attendance" onChange={e => setBooleanValue(e)} value={userObj.attendance ?? ""}>
                            <option value="" disabled hidden>Status</option>
                            <option value="true" >Present</option>
                            <option value="false" >Absent</option>
                        </select>
                    </span>
                </div>

                <div className="inputSet">
                    <Input name={"date"} onChange={e => setValue(e)} placeholder={""} label={"Date"} value={userObj.date ?? ""} type={"date"} />
                </div>

                <FormButton onClick={performAction} label={Object.keys(instance || {}).length === 0 ? "Create Attendance" : "Update"} />
            </form>
        </main>
    )
}

export default function Subjects() {
    const [sections, setSections] = useState("")
    const [attendance, setAttendance] = useState(null)

    const [presentPage, setPresentPage] = useState("")
    let [currentPage, setCurrentPage] = useState(1)
    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")

    const [order, setOrder] = useState("")
    const [filter1, setFilter1] = useState("")
    const [filter2, setFilter2] = useState("")

    const [showForm, setShowForm] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    const [creationStatus, setCreationStatus] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [popMssg, setPopMsg] = useState("Something went wrong")

    const [instance, setInstance] = useState({})

    function closeForm() {
        setInstance({})
        setIsFormClosing(true)
        setTimeout(() => {
            setShowForm(false)
            setIsFormClosing(false)
        }, 300)
    }

    function updateStatus() {
        setCreationStatus(true)
        setTimeout(() => {
            setCreationStatus(false)
            setIsDone(false)
            setPopMsg("Something went wrong")
        }, 2000)
    }
    function updateDoneStatus() {
        setIsDone(true)
    }
    function setMsg(msg) {
        setPopMsg(msg)
    }
    function setInstanceObj(e) {
        const obj = {
            id: e.id,
            attendance: e.attendance,
            date: e.date,
            student_id: e.student.id,
            student: e.student.user.username
        }
        setInstance(obj)
        setShowForm(true)
    }


    useEffect(() => {
        const getData = async () => {
            setPresentPage("/api/attendance/")
            const res = await request({ url: "/api/attendance/", method: "GET" })
            const sec = await request({ url: "/api/sections/", method: "GET" })

            if (res.data.previous) {
                setPrev(res.data.previous)
            }

            if (res.data.next) {
                setNext(res.data.next)
            }

            if (res.status) {
                setAttendance(res.data.results)
            }
            if (sec.status) {
                setSections(sec.data)
            }
        }
        getData()
    }, [])

    async function reflectChange() {
        const res = await request({ url: presentPage, method: "GET" })
        if (res.status) {
            setAttendance(res.data.results)
        }
    }

    const deleteAtt = async (id) => {
        const res = await request({ url: `/api/attendance/${id}/`, method: "DELETE" })
        updateStatus()
        if (res.data === null) {
            updateDoneStatus()
            setMsg("Attendance is deleted successfully")
            reflectChange()
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }

    async function prevPage(url) {
        const u = new URL(url)
        const params = u.search
        setPresentPage(`/api/attendance/${params}`)
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
        setPresentPage(`/api/attendance/${params}`)
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

        setPresentPage(`/api/attendance/?${params.toString()}`)
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
                    <NewRecordButton onClick={() => setShowForm(true)} Icon={BookText} label={"Add Attendance"} />
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
                                        return <option value={sec.section} className="sortOptions" key={sec.id}>{sec.section}</option>
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
                        <HeadingLg Icon={BookText} label={"Attendance Record"} />
                    </div>
                    {
                        attendance ? (
                            <section className="atten_box">
                                {
                                    attendance.map(att => {
                                        return (
                                            <div className={`attendance ${att.attendance ? "presentBox" : "absentBox"}`} key={att.id}>
                                                <CircleUserIcon className="icon_att" />
                                                <span className="att_span">
                                                    <p className="name">{att.student.user.first_name} {att.student.user.last_name}</p>
                                                    <p className="section"> <strong>Section: </strong> {att.student.section}</p>
                                                </span>
                                                <p className="date">{att.date}</p>
                                                <p className={`status ${att.attendance ? "present" : "absent"}`}>{att.attendance ? "Present" : "Absent"}</p>
                                                <span className="act_span">
                                                    <ActionButton Icon={SquarePen} onClick={() => {
                                                        setInstanceObj(att)
                                                        console.log(att)
                                                    }} />
                                                    <ActionButton Icon={Trash} onClick={() => deleteAtt(att.id)} />
                                                </span>
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
                            prev && <ChangePageButton onClick={() => prevPage(prev)} label={currentPage - 1} />
                        }
                        <ChangePageButton buttonStyle={"rgba(255, 255, 255, 1)"} label={currentPage} />
                        {
                            next && <ChangePageButton onClick={() => nextPage(next)} label={currentPage + 1} />
                        }
                    </div>
                </section>
            </main>
            {
                showForm && <div className={`overlayBox ${isFormClosing ? "overlayBoxClosing" : ""}`}>
                    <AddNewRecord close={closeForm} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} instance={instance} reflectChange={reflectChange} />
                </div>
            }
            {
                creationStatus && <div className="statusOverlay"><Status label={popMssg ? popMssg : ""} status={isDone} /></div>
            }
        </>
    )
}