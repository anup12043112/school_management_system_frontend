import "../../styles/admin/adminMarks.css"
import "../../styles/commonCSS.css"
import { request } from "../../services/apiClient"
import { useState, useEffect } from "react"
import { SquarePercent, Trash, SquarePen, NotebookDotIcon, LucideSquircleDashed } from "lucide-react"

import Loader from "../../components/Loader"
import { SearchBar, Status, Input } from "../../components/Loader"
import { OverlayHead, HeadingMd, HeadingLg } from "../../components/Headings"
import { FormButton, ActionButton, ChangePageButton, NewRecordButton } from "../../components/Buttons"




function RenderMarks({ list, setInst, reflectChange, status, isDone, setMsg }) {
    const deleteMarks = async (id) => {
        const res = await request({ url: `/api/marks/${id}/`, method: "DELETE" })
        status()
        if (res.data === null) {
            isDone()
            setMsg("Marks Record is deleted successfully")
            reflectChange()
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }
    return (
        list ? (
            list.map(m => {
                return (
                    <div className="marks" key={m.id}>
                        <div className="gradeActionsBox">
                            <div className="gradeBox">
                                <p className="grade">
                                    {m.marks >= 90 ? "A+" : m.marks >= 80 ? "A" : m.marks >= 70 ? "B+" : m.marks >= 60 ? "B" : m.marks >= 50 ? "C+" : m.marks > 40 ? "C" : "D"}
                                </p>
                            </div>
                            <div className="actionsBox">
                                <ActionButton Icon={SquarePen} onClick={() => setInst(m)} />
                                <ActionButton Icon={Trash} onClick={() => deleteMarks(m.id)} />
                            </div>
                        </div>
                        <div className="studentInfo">
                            <p className="name">{m.student.user.first_name} {m.student.user.last_name}</p>
                            <p className="sec">{m.student.section}</p>
                            <p className="sub">{m.subject.subject}</p>
                            <p className="examType">{m.exam}</p>
                        </div>
                        <div className="marksScreen">
                            <p className="mark">{Math.floor(m.marks)}</p>
                            <p className="perc">{(m.marks / 100) * 100} %</p>
                        </div>
                    </div>
                )
            })
        ) : (
            <Loader />
        )
    )
}

function AddNewRecord({ close, instance, status, isDone, setMsg, reflectChange, subjects, students }) {
    const [userObj, setUserObj] = useState(instance || {})

    async function performAction() {
        if (userObj.student_id && userObj.subject_id && userObj.exam && userObj.marks) {
            if (Object.keys(instance || {}).length === 0) {
                const res = await request({ url: "/api/marks/", method: "POST", body: userObj })
                status()
                if (res.status && res.data.id) {
                    isDone()
                    setMsg(`Marks record is created successfully.`)
                    setUserObj({})
                    reflectChange()
                } else {
                    status()
                    setMsg("You can't create duplicate marks record. Try updating the existing one.")
                }
            } else {
                const res = await request({ url: `/api/marks/${userObj.id}/`, method: "PATCH", body: userObj })
                status()
                if (res.data.id) {
                    isDone()
                    setMsg(`Marks record of (${userObj.student} is updated successfully.`)
                    reflectChange()
                } else {
                    setMsg(`Can't update the record right now, try again later.`)
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
    return (
        <main className="newRecordUser">
            <div className="headMarks">
                <OverlayHead Icon={NotebookDotIcon} label={"Add Marks"} onClick={close} />
            </div>

            <form className="bodyUser">

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
                    {
                        Object.keys(instance || {}).length === 0 ? (
                            <span>
                                <p>Select Subject</p>
                                <select name="subject_id" onChange={e => setValue(e)}>
                                    <option value="" disabled selected>Select Subject</option>
                                    {
                                        subjects ? (
                                            subjects.map(sub => {
                                                return <option value={sub.id} >{sub.subject}</option>
                                            })
                                        ) : (
                                            <option value="" disabled>Unable to fetch Subject list</option>
                                        )
                                    }
                                </select>
                            </span>
                        ) : (
                            <Input name={"subject_id"} label={"Subject"} value={userObj.subject ?? ""} readOnly={true} />
                        )
                    }
                </div>

                <div className="inputSet">
                    <Input name={"marks"} onChange={e => setValue(e)} placeholder={"Marks Obtained"} label={"Marks"} value={userObj.marks ?? ""} />
                    <Input name={"total_marks"} onChange={e => setValue(e)} placeholder={"Maximum Marks (default value 100)"} label={"Maximum Marks"} value={userObj.total_marks ?? ""} />
                </div>

                <div className="inputSet">
                    <span>
                        <p>Select Exam</p>
                        <select name="exam" onChange={e => setValue(e)} required value={userObj.exam ?? ""}>
                            <option value="" disabled>Exam Type</option>
                            <option value="unit test">Unit Test</option>
                            <option value="mid term exam">Mid Term Exam</option>
                            <option value="annual exam">Annual Exam</option>
                        </select>
                    </span>
                </div>

                <FormButton onClick={performAction} label={Object.keys(instance || {}).length === 0 ? "Create Marks" : "Update"} />
            </form>
        </main>
    )
}

export default function Marks() {
    const [sections, setSections] = useState("")
    const [subjects, setSubjects] = useState("")
    const [students, setStudents] = useState("")
    const [marks, setMarks] = useState("")

    const [presentPage, setPresentPage] = useState("")
    let [currentPage, setCurrentPage] = useState(1)
    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")

    const [searchKey, setSearchKey] = useState("")
    const [searchResult, setSearchResult] = useState("")
    let [currentPageSearch, setCurrentPageSearch] = useState(1)
    const [prevSearch, setPrevSearch] = useState("")
    const [nextSearch, setNextSearch] = useState("")

    const [filter1, setFilter1] = useState("")
    const [filter2, setFilter2] = useState("")
    const [filter3, setFilter3] = useState("")

    const [studentAnalysis, setStudentAnalysis] = useState("")
    const [foundStudents, setFoundStudents] = useState("")
    const [selectedStudentAnalysis, setSelectedStudentAnalysis] = useState("")

    const initialAnalysis = {}
    const [analysisData, setAnalysisData] = useState(initialAnalysis)

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
            student_id: e.student.id,
            student: `${e.student.user.first_name} ${e.student.user.last_name}`,
            subject_id: e.subject.id,
            subject: e.subject.subject,
            marks: e.marks,
            total_marks: e.total_marks,
            exam: e.exam
        }
        setInstance(obj)
        setShowForm(true)
    }
    async function reflectChange() {
        const res = await request({ url: presentPage, method: "GET" })
        if (res.status) {
            if (searchKey){
                setSearchResult(res.data.results)
            } else {
                setMarks(res.data.results)
            }
        }
    }


    useEffect(() => {
        const getData = async () => {
            setPresentPage("/api/marks/")
            const res = await request({ url: "/api/marks/", method: "GET" })
            const section = await request({ url: "/api/sections/", method: "GET" })
            const subject = await request({ url: "/api/subjects/", method: "GET" })
            const student = await request({ url: "/api/students/", method: "GET" })

            if (res.data.previous) {
                setPrev(res.data.previous)
            }

            if (res.data.next) {
                setNext(res.data.next)
            }

            if (res.status) {
                setMarks(res.data.results)
            }
            if (section.status) {
                setSections(section.data)
            }
            if (subject.status) {
                setSubjects(subject.data)
            }
            if (student.status) {
                setStudents(student.data)
            }
        }
        getData()
    }, [])

    async function prevPage(url) {
        const u = new URL(url)
        const params = u.search
        setPresentPage(`/api/marks/${params}`)
        const res = await request({ url: `/api/marks/${params}`, method: "GET" })
        if (res.status) {
            setMarks(res.data.results)
        }
        setCurrentPage(currentPage - 1)
        setPrev(res.data.previous)
        setNext(res.data.next)
    }

    async function nextPage(url) {
        const u = new URL(url)
        const params = u.search
        setPresentPage(`/api/marks/${params}`)
        const res = await request({ url: `/api/marks/${params}`, method: "GET" })
        if (res.status) {
            setMarks(res.data.results)
        }
        setCurrentPage(currentPage + 1)
        setPrev(res.data.previous)
        setNext(res.data.next)
    }

    async function sortFilterList(filter1, filter2, filter3) {
        const params = new URLSearchParams()

        if (filter1) params.append("subject", filter1)
        if (filter2) params.append("section", filter2)
        if (filter3) params.append("exam", filter3)

        setPresentPage(`/api/marks/?${params.toString()}`)
        const res = await request({
            url: `/api/marks/?${params.toString()}`
        })
        if (res.status) {
            setMarks(res.data.results)
            setPrev(res.data.previous)
            setNext(res.data.next)
            setCurrentPage(1)
        }
    }

    async function manageSearch(e) {
        const val = e.target.value
        setFilter3("")
        setSearchKey(val)
        setPresentPage(`/api/marks/?search=${val}`)
        const res = await request({ url: `/api/marks/?search=${val}`, method: "GET" })
        if (res.status) {
            setSearchResult(res.data.results)
            if (res.data.previous) {
                setPrevSearch(res.data.previous)
            }
            if (res.data.next) {
                setNextSearch(res.data.next)
            }
        }

    }

    async function prevPageSearch(url) {
        const u = new URL(url)
        const params = u.search
        setPresentPage(`/api/marks/${params}`)
        const res = await request({ url: `/api/marks/${params}`, method: "GET" })
        if (res.status) {
            setSearchResult(res.data.results)
        }
        setCurrentPageSearch(currentPageSearch - 1)
        setPrevSearch(res.data.previous)
        setNextSearch(res.data.next)
    }

    async function nextPageSearch(url) {
        const u = new URL(url)
        const params = u.search
        setPresentPage(`/api/marks/${params}`)
        const res = await request({ url: `/api/marks/${params}`, method: "GET" })
        if (res.status) {
            setSearchResult(res.data.results)
        }
        setCurrentPageSearch(currentPageSearch + 1)
        setPrevSearch(res.data.previous)
        setNextSearch(res.data.next)
    }

    async function manageAnalysis(e) {
        const v = e.target.value
        setStudentAnalysis(v)
        const res = await request({ url: `/api/students/?search=${v}`, method: "GET" })
        if (res.status) {
            setFoundStudents(res.data)
        }
    }

    async function analyzeStudent(v) {
        setStudentAnalysis("")
        setSelectedStudentAnalysis("")
        setAnalysisData(initialAnalysis)
        const res = await request({ url: `/api/marks-summary/?search=${v}`, method: "GET" })
        initialAnalysis.name = `${res.data[0].student.user.first_name} ${res.data[0].student.user.last_name}`
        initialAnalysis.section = res.data[0].student.section
        initialAnalysis.max = 0
        initialAnalysis.maxSub = ""
        initialAnalysis.min = 110
        initialAnalysis.minSub = ""
        initialAnalysis.total_unitTest = 0
        initialAnalysis.total_midTerm = 0
        initialAnalysis.total_annual = 0

        res.data.forEach(e => {
            const m = Number(e.marks)
            if (m > initialAnalysis.max) {
                initialAnalysis.max = m
                initialAnalysis.maxSub = e.subject.subject
            }
            if (m < initialAnalysis.min) {
                initialAnalysis.min = m
                initialAnalysis.minSub = e.subject.subject
            }
            const exam = e.exam
            if (exam == "unit test") {
                initialAnalysis.total_unitTest += m
            } else if (exam == "mid term exam") {
                initialAnalysis.total_midTerm += m
            } else if (exam == "annual exam") {
                initialAnalysis.total_annual += m
            }
        });
        setSelectedStudentAnalysis(v)
        setAnalysisData({ ...initialAnalysis })
    }

    return (
        <>
            <main className="marks_admin">
                <section className="nav animation_left">
                    <NewRecordButton Icon={SquarePercent} onClick={() => setShowForm(true)} label={"Add Marks"} />
                </section>

                <span className="marksIntro animation_left">
                    <p className="marks_greet">Manage Student's Marks</p>
                </span>

                <section className="bottomBox">
                    <section className="leftBox">
                        <div className="filterBox">
                            <div className="searchCont">
                                <SearchBar searchFunc={manageSearch} />
                            </div>

                            <div className="filterBTNS">
                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter1(v)
                                    sortFilterList(v, filter2, filter3)
                                }}>
                                    <option value="" >Subjects</option>
                                    {
                                        subjects ? (
                                            subjects.map(sub => {
                                                return <option value={sub.subject} key={sub.id}>{sub.subject}</option>
                                            })
                                        ) : (<option value="" >No Options</option>)
                                    }
                                </select>

                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter2(v)
                                    sortFilterList(filter1, v, filter3)
                                }}>
                                    <option value="" >Sections</option>
                                    {
                                        sections ? (
                                            sections.map(sec => {
                                                return <option value={sec.section} key={sec.id}>{sec.section}</option>
                                            })
                                        ) : (<option value="" >No Options</option>)
                                    }
                                </select>

                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter3(v)
                                    sortFilterList(filter1, filter2, v)
                                }}>
                                    <option value="" >Exams</option>
                                    <option value="1" >Unit Test</option>
                                    <option value="2" >Mid Term Exam</option>
                                    <option value="3" >Annual Exam</option>
                                </select>
                            </div>
                        </div>

                        <section className="marksBox">
                            {
                                marks ? (
                                    searchKey ? (
                                        <RenderMarks list={searchResult} setInst={setInstanceObj} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} reflectChange={reflectChange} students={students} subjects={subjects} />
                                    ) : (
                                        <RenderMarks list={marks} setInst={setInstanceObj} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} reflectChange={reflectChange} students={students} subjects={subjects} />
                                    )
                                ) : (
                                    <Loader />
                                )
                            }
                        </section>

                        <div className="changePGBox">
                            {
                                searchKey.trim() ? (
                                    <>
                                        {prevSearch && (
                                            <ChangePageButton onClick={() => prevPageSearch(prevSearch)} label={currentPageSearch - 1} />
                                        )}

                                        <button
                                            className="changePG"
                                            style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                                        >
                                            {currentPageSearch}
                                        </button>

                                        {nextSearch && (
                                            <ChangePageButton onClick={() => nextPageSearch(nextSearch)} label={currentPageSearch + 1} />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {prev && (
                                            <ChangePageButton onClick={() => prevPage(prev)} label={currentPage - 1} />
                                        )}

                                        <button
                                            className="changePG"
                                            style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                                        >
                                            {currentPage}
                                        </button>

                                        {next && (
                                            <ChangePageButton onClick={() => nextPage(next)} label={currentPage + 1} />
                                        )}
                                    </>
                                )
                            }
                        </div>
                    </section>

                    <section className="rightBox">
                        <div className="head">
                            <NotebookDotIcon className="icon" />
                            Student Analysis
                        </div>
                        <SearchBar searchFunc={manageAnalysis} boxStyle={"analysisSearchBar"} />
                        {
                            studentAnalysis && <div className="searchResult">
                                {
                                    foundStudents ? (
                                        foundStudents.map(e => {
                                            return (
                                                <p onClick={() => analyzeStudent(e.user.first_name)}>
                                                    {e.user.first_name}
                                                </p>
                                            )
                                        })
                                    ) : (
                                        <h2>Fetching the student</h2>
                                    )
                                }
                            </div>
                        }
                        {
                            selectedStudentAnalysis ? (
                                <div className="analysisBox">
                                    <div className="header">
                                        <p className="stName">{analysisData.name}</p>
                                        <p className="stSection">{analysisData.section}</p>
                                    </div>
                                    <div className="statsBox">
                                        <span className="stat">
                                            <p className="statName">Overall Average</p>
                                            <p className="statValue">{(((analysisData.total_unitTest + analysisData.total_midTerm + analysisData.total_annual) / 3000) * 100).toFixed(2)} %</p>
                                        </span>
                                        <span className="stat">
                                            <p className="statName">Maximum</p>
                                            <p className="statValue">{analysisData.maxSub} ({analysisData.max})</p>
                                        </span>
                                        <span className="stat">
                                            <p className="statName">Minimum</p>
                                            <p className="statValue">{analysisData.minSub} ({analysisData.min})</p>
                                        </span>
                                    </div>
                                    <div className="byExamBox">
                                        <div className="byExamHead">
                                            <p>Performance By Exam</p>
                                        </div>
                                        <div className="byExamBody">
                                            <div className="byExam">
                                                <div className="namePerc">
                                                    <p className="examName">Unit Test ({(analysisData.total_unitTest / 1000 * 100).toFixed(2)} %)</p>
                                                </div>
                                                <div className="graphBox">
                                                    <div className="graph">
                                                        <div className="line" style={{
                                                            backgroundColor: `${analysisData.total_unitTest > 850 ? "rgb(12, 187, 0)" : analysisData.total_unitTest > 800 ? "rgb(251, 217, 0)" : "rgb(251, 171, 0)"}`,
                                                            width: `${analysisData.total_unitTest / 10}%`
                                                        }}></div>
                                                    </div>
                                                    <p className="marksObtained">{analysisData.total_unitTest}</p>
                                                </div>
                                            </div>

                                            <div className="byExam">
                                                <div className="namePerc">
                                                    <p className="examName">Mid Term ({(analysisData.total_midTerm / 1000 * 100).toFixed(2)} %)</p>
                                                </div>
                                                <div className="graphBox">
                                                    <div className="graph">
                                                        <div className="line" style={{
                                                            backgroundColor: `${analysisData.total_midTerm > 860 ? "rgb(12, 187, 0)" : analysisData.total_unitTest > 830 ? "rgb(251, 171, 0)" : "rgb(251, 217, 0)"}`,
                                                            width: `${analysisData.total_midTerm / 10}%`
                                                        }}></div>
                                                    </div>
                                                    <p className="marksObtained">{analysisData.total_midTerm}</p>
                                                </div>
                                            </div>

                                            <div className="byExam">
                                                <div className="namePerc">
                                                    <p className="examName">Annual Exam ({(analysisData.total_annual / 1000 * 100).toFixed(2)} %)</p>
                                                </div>
                                                <div className="graphBox">
                                                    <div className="graph">
                                                        <div className="line" style={{
                                                            backgroundColor: `${analysisData.total_annual > 850 ? "rgb(12, 187, 0)" : analysisData.total_unitTest > 800 ? "rgb(251, 217, 0)" : "rgb(251, 171, 0)"}`,
                                                            width: `${analysisData.total_annual / 10}%`
                                                        }}></div>
                                                    </div>
                                                    <p className="marksObtained">{analysisData.total_annual}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="noStudentBox">
                                    <LucideSquircleDashed className="noStudentIcon" />
                                    <p className="noStudent">Select a student to view their performance analytics</p>
                                </div>
                            )
                        }
                    </section>
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