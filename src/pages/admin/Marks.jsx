import "../../styles/admin/adminMarks.css"
import "../../styles/commonCSS.css"
import { request } from "../../services/apiClient"
import { useState, useEffect, useContext } from "react"
import { DataContext } from "../../context/DataContext"
import Loader from "../../components/Loader"
import { SearchBar } from "../../components/Loader"
import { SquarePercent, Trash, SquarePen, NotebookDotIcon, LucideSquircleDashed } from "lucide-react"

function RenderMarks({ list }) {
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
                                <button>
                                    <SquarePen className="icon" />
                                </button>
                                <button>
                                    <Trash className="icon" />
                                </button>
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

export default function Marks() {
    const { sections } = useContext(DataContext)
    const { subjects } = useContext(DataContext)
    const [marks, setMarks] = useState("")

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

    useEffect(() => {
        const getData = async () => {
            const res = await request({ url: "/api/marks/", method: "GET" })

            if (res.data.previous) {
                setPrev(res.data.previous)
            }

            if (res.data.next) {
                setNext(res.data.next)
            }

            if (res.status) {
                setMarks(res.data.results)
            }
        }
        getData()
    }, [])

    async function prevPage(url) {
        const u = new URL(url)
        const params = u.search
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
        // console.log(res.data[0].subject.subject)

        res.data.forEach(e => {
            const m = Number(e.marks)
            if (m > initialAnalysis.max){
                initialAnalysis.max = m
                initialAnalysis.maxSub = e.subject.subject
            } 
            if (m < initialAnalysis.min){
                initialAnalysis.min = m
                initialAnalysis.minSub = e.subject.subject
            } 
            const exam = e.exam
            if (exam == "unit test"){
                initialAnalysis.total_unitTest += m
            } else if (exam == "mid term exam"){
                initialAnalysis.total_midTerm += m
            } else if (exam == "annual exam"){
                initialAnalysis.total_annual += m
            }
        });
        setSelectedStudentAnalysis(v)
        setAnalysisData({...initialAnalysis})
    }
    return (
        <>
            <main className="marks_admin">
                <section className="nav animation_left">
                    <button className="addNewRecordBTN" onClick={() => setShowForm(true)}>
                        <SquarePercent className="icon" />
                        Add Marks
                    </button>
                </section>

                <span className="marksIntro animation_left">
                    <p className="marks_greet">Manage Student's Marks</p>
                </span>

                <section className="bottomBox">
                    <section className="leftBox">
                        <div className="filterBox">
                            <SearchBar searchFunc={manageSearch} />

                            <div className="filterBTNS">
                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter1(v)
                                    sortFilterList(v, filter2, filter3)
                                }}>
                                    <option value="" className="sortOptions">Subjects</option>
                                    {
                                        subjects ? (
                                            subjects.map(sub => {
                                                return <option value={sub.subject} className="sortOptions" key={sub.id}>{sub.subject}</option>
                                            })
                                        ) : (<option value="" className="sortOptions">No Options</option>)
                                    }
                                </select>

                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter2(v)
                                    sortFilterList(filter1, v, filter3)
                                }}>
                                    <option value="" className="sortOptions">Sections</option>
                                    {
                                        sections ? (
                                            sections.map(sec => {
                                                return <option value={sec.section} className="sortOptions" key={sec.id}>{sec.section}</option>
                                            })
                                        ) : (<option value="" className="sortOptions">No Options</option>)
                                    }
                                </select>

                                <select onChange={e => {
                                    const v = e.target.value
                                    setFilter3(v)
                                    sortFilterList(filter1, filter2, v)
                                }}>
                                    <option value="" className="sortOptions">Exams</option>
                                    <option value="1" className="sortOptions">Unit Test</option>
                                    <option value="2" className="sortOptions">Mid Term Exam</option>
                                    <option value="3" className="sortOptions">Annual Exam</option>
                                </select>
                            </div>
                        </div>

                        <section className="marksBox">
                            {
                                marks ? (
                                    searchKey ? (
                                        <RenderMarks list={searchResult} />
                                    ) : (
                                        <RenderMarks list={marks} />
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
                                            <button
                                                className="changePG"
                                                onClick={() => prevPageSearch(prevSearch)}
                                            >
                                                {currentPageSearch - 1}
                                            </button>
                                        )}

                                        <button
                                            className="changePG"
                                            style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                                        >
                                            {currentPageSearch}
                                        </button>

                                        {nextSearch && (
                                            <button
                                                className="changePG"
                                                onClick={() => nextPageSearch(nextSearch)}
                                            >
                                                {currentPageSearch + 1}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {prev && (
                                            <button
                                                className="changePG"
                                                onClick={() => prevPage(prev)}
                                            >
                                                {currentPage - 1}
                                            </button>
                                        )}

                                        <button
                                            className="changePG"
                                            style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                                        >
                                            {currentPage}
                                        </button>

                                        {next && (
                                            <button
                                                className="changePG"
                                                onClick={() => nextPage(next)}
                                            >
                                                {currentPage + 1}
                                            </button>
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
                                                            width: `${analysisData.total_unitTest/10}%`
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
                                                            width: `${analysisData.total_midTerm/10}%`
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
                                                            width: `${analysisData.total_annual/10}%`
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
        </>
    )
}