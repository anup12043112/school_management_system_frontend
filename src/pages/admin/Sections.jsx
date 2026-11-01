import "../../styles/admin/sections.css"
import { useState, useEffect, useContext } from "react"
import { request } from "../../services/apiClient"
import { SquarePen, School, Trash, BookOpen } from "lucide-react"
import { DataContext } from "../../context/DataContext"

import { HeadingLg, OverlayHead } from "../../components/Headings"
import { SearchBar } from "../../components/Loader"
import { NewRecordButton, ActionButton, FormButton } from "../../components/Buttons"
import Loader from "../../components/Loader"
import { Input, Status } from "../../components/Loader"



function AddNewRecord({ close, instance, status, isDone, setMsg, adding, reflectChange }) {
    const [dataObj, setDataObj] = useState(instance || {})


    async function performAction() {
        if (dataObj.section || (dataObj.code && dataObj.subject)) {
            let res
            if (Object.keys(instance || {}).length === 0) {
                // CREATING
                res = await request({ url: adding === "section" ? "/api/sections/" : "/api/subjects/", method: "POST", body: dataObj })
            } else {
                // UPDATING
                res = await request({ url: adding === "section" ? `/api/sections/${dataObj.id}/` : `/api/subjects/${dataObj.id}/`, method: "PATCH", body: dataObj })
            }
            status()
            if (adding === "section") {   //CHECKING VALID SECTION CREATION
                if (res.status && res.data.id) {
                    isDone()
                    setMsg(`Section [${res.data.section}] is created successfully.`)
                    setDataObj({})
                    reflectChange({ type: "section", url: "/api/sections/" })
                } else {
                    res.data.section[0] ? setMsg(res.data.section[0]) : setMsg("Unable to create the section")
                }
            } else {
                //CREATING VALID SUBJECT CREATION
                if (res.status && res.data.id) {
                    isDone()
                    setMsg(`Subject [${res.data.subject}] is created successfully.`)
                    setDataObj({})
                    reflectChange({ type: "subject", url: "/api/subjects/" })
                } else {
                    res.data.subject[0] ? setMsg(res.data.subject[0]) : setMsg("Unable to create the subject")
                }
            }

        } else {
            setMsg("Every field is required.")
        }
    }

    function setValue(e) {
        setDataObj(prev => (
            { ...prev, [e.target.name]: e.target.value }
        ))
    }
    return (
        <main className="newRecordSecSub">
            <div className="headSecSub">
                <OverlayHead Icon={adding == "section" ? School : BookOpen} label={adding == "section" ? "Add Section" : "Add Subject"} onClick={close} />
            </div>
            <form className="bodySecSub">
                {
                    adding == "section" ? (
                        <div className="inputSet">
                            <Input name={"section"} onChange={e => setValue(e)} placeholder={"Enter Section e.g. 8A, 10C etc"} label={"Section"} value={dataObj.section ?? ""} />
                        </div>
                    ) : (
                        <div className="inputSet">
                            <Input name={"code"} onChange={e => setValue(e)} placeholder={"Enter Subject Code"} label={"Subject Code"} value={dataObj.code ?? ""} />
                            <Input name={"subject"} onChange={e => setValue(e)} placeholder={"Enter Subject Name"} label={"Subject Name"} value={dataObj.subject ?? ""} />
                        </div>
                    )
                }

                <FormButton onClick={performAction} label={Object.keys(instance || {}).length === 0 ? `Create ${adding === "section" ? "Section" : "Subject"}` : "Update"} />
            </form>
        </main>
    )
}


function SubjectList({ subList, setInst, status, setMsg, isDone, reflectChange }) {
    const deleteSub = async (id) => {
        const res = await request({ url: `/api/subjects/${id}/`, method: "DELETE" })
        status()
        if (res.data === null) {
            isDone()
            setMsg("Subject is deleted successfully")
            reflectChange({ type: "subject", url: "/api/subjects/" })
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }
    return (
        subList ? (
            subList.map(sub => {
                return (
                    <div className="subject" key={sub.id}>
                        <div className="infoBox_subject">
                            <p className="subName">{sub.subject}</p>
                            <p className="subCode"><strong>Subject Code:</strong> {sub.code}</p>
                        </div>
                        <div className="btnBox_subject">
                            <ActionButton Icon={SquarePen} onClick={() => setInst(sub)} />
                            <ActionButton Icon={Trash} onClick={() => deleteSub(sub.id)} />
                        </div>
                    </div>
                )
            })
        ) : (
            <h2>Loading</h2>
        )
    )
}


export default function Section() {
    const {sections, fetchSections} = useContext(DataContext)
    const [subjects, setSubjects] = useState("")

    const [searchKeyword, setSearchKeyword] = useState("")
    const [searchResult, setSearchResult] = useState("")

    const [adding, setAdding] = useState("subject")

    const [showForm, setShowForm] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    const [creationStatus, setCreationStatus] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [popMssg, setPopMsg] = useState("Something went wrong")

    const [instance, setInstance] = useState({})

    function closeForm() {
        setInstance({})
        setAdding("subject")
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
        setInstance(e)
        setShowForm(true)
    }

    async function searchSubject(e) {
        const val = e.target.value
        setSearchKeyword(val)
        const res = await request({ url: `/api/subjects/?search=${val}`, method: "GET" })
        if (res.status) {
            setSearchResult(res.data)
        }
    }

    async function reflectChange({ type, url }) {
        const res = await request({ url: url, method: "GET" })
        if (res.status) {
            type === "subject" ? setSubjects(res.data) : setSections(res.data)
        }
    }

    const deleteSec = async (id) => {
        const res = await request({ url: `/api/sections/${id}/`, method: "DELETE" })
        updateStatus()
        if (res.data === null) {
            updateDoneStatus()
            setMsg("Section is deleted successfully")
            reflectChange({ type: "section", url: "/api/sections/" })
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }

    useEffect(() => {
        if (!sections) fetchSections()
        const getData = async () => {
            const subject = await request({ url: "/api/subjects/", method: "GET" })

            if (subject.status) {
                setSubjects(subject.data)
            }
        }
        getData()
    }, [])

    
    return (
        <>
            <main className="sections_admin fb_sec">
                <section className="nav animation_left">
                    <NewRecordButton Icon={BookOpen} label={"Add a Subject"} onClick={() => {
                        setShowForm(true)
                        setAdding("subject")
                    }} />

                    <NewRecordButton Icon={School} label={"Add a Section"} onClick={() => {
                        setShowForm(true)
                        setAdding("section")
                    }} />
                </section>

                <span className="section_attend_Intro animation_left">
                    <p className="section_attend__greet">Manage Section & Subjects</p>
                </span>

                <section className="subject_section_container">
                    <section className="leftBox animation_right">
                        <div className="nav_box">
                            <span className="leftSpan">
                                <HeadingLg Icon={BookOpen} label={"Subjects"} />
                            </span>
                            <span className="rightSpan">
                                <SearchBar searchFunc={searchSubject} placeholder={"Search a subject"} />
                            </span>
                        </div>
                        {
                            subjects ? (
                                <div className="subjectBox">
                                    {
                                        searchKeyword == "" ? (
                                            <SubjectList subList={subjects} setInst={setInstanceObj} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} reflectChange={reflectChange} />
                                        ) : (
                                            <SubjectList subList={searchResult} setInst={setInstanceObj} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} reflectChange={reflectChange} />
                                        )
                                    }
                                </div>
                            ) : (
                                <Loader />
                            )
                        }
                    </section>

                    <section className="rightBox animation_left">
                        <div className="nav_box">
                            <HeadingLg Icon={School} label={"Sections"} />
                        </div>
                        {
                            sections ? (
                                <div className="sectionBox">
                                    {
                                        sections.map(sec => {
                                            return (
                                                <div className="section" key={sec.id}>
                                                    <div className="infoBox_section">
                                                        <p className="secName">{sec.section}</p>
                                                    </div>
                                                    <div className="btnBox_section">
                                                        <ActionButton Icon={SquarePen} onClick={() => {
                                                            setAdding("section")
                                                            setInstanceObj(sec)
                                                        }} />
                                                        <ActionButton Icon={Trash} onClick={() => deleteSec(sec.id)} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <section className="loaderBox">
                                    <div className="loadingCircle"></div>
                                    <p className="loadingText">Loading</p>
                                </section>
                            )
                        }
                    </section>
                </section >
            </main >
            {
                showForm && <div className={`overlayBox ${isFormClosing ? "overlayBoxClosing" : ""}`}>
                    <AddNewRecord close={closeForm} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} instance={instance} adding={adding} reflectChange={reflectChange} />
                </div>
            }
            {
                creationStatus && <div className="statusOverlay"><Status label={popMssg ? popMssg : ""} status={isDone} /></div>
            }
        </>
    )
}