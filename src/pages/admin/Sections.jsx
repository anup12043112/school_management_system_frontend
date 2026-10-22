import "../../styles/admin/sections.css"
import { useState, useContext } from "react"
import { request } from "../../services/apiClient"
import { DataContext } from "../../context/DataContext"
import { SquarePen, CopyPlusIcon, School, Trash, X, BookOpen } from "lucide-react"

const Adding = ({ close, adding }) => {
    const [data, setData] = useState(null)
    const [data2, setData2] = useState(null)

    async function createSec() {
        const req = await request({ url: "/api/sections/", method: "POST", body: { name: sec } })
        if (req.status) {
            close()
            alert("Created Sucessfully !")
        }
    }

    return (
        <section className="adding_sub_sec">
            <div className="header">
                <span className="span">
                    {
                        adding == "section" ? (
                            <>
                                <School className="addNewSection_icon" />
                                <p className="addNewSecLabel">Add New Section</p>
                            </>
                        ) : (
                            <>
                                <BookOpen className="addNewSection_icon" />
                                <p className="addNewSecLabel">Add New Subject</p>
                            </>
                        )
                    }
                </span>
                <span className="span">
                    <button className="closeFormBTN_addNewSec fb_sec" onClick={close}>
                        <X className="closeFormBTN_addNewSec_icon" />
                    </button>
                </span>
            </div>
            <form className="addNewSectionForm fb_sec">
                <span className="span">
                    <School className="icon" />
                    <input
                        type="text"
                        className="newSectionInput"
                        placeholder="Section e.g. 7B, 9C etc."
                        onChange={e => setSec(e.target.value)}
                    />
                </span>
                <button type="button" className="addSectionBTN fb_sec" onClick={() => createSec()}>
                    <CopyPlusIcon className="addClassSectionIcon" />
                    Add
                </button>
            </form>
        </section>
    )
}


function AddSubject({ subList }) {
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
                            <button className="actionBTN">
                                <SquarePen className="actionBTNIcon" />
                            </button>
                            <button className="actionBTN">
                                <Trash className="actionBTNIcon" />
                            </button>
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
    const { sections } = useContext(DataContext)
    const { subjects } = useContext(DataContext)

    const [searchKeyword, setSearchKeyword] = useState("")
    const [searchResult, setSearchResult] = useState("")

    const [adding, setAdding] = useState("")
    const [deleting, setDeleting] = useState(null)
    const [updating, setUpdating] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    function closeForm() {
        setIsFormClosing(true)
        setTimeout(() => {
            setShowForm(false)
            setIsFormClosing(false)
        }, 300)
    }

    async function searchSubject(e) {
        const val = e.target.value
        setSearchKeyword(val)
        const res = await request({ url: `/api/subjects/?search=${val}`, method: "GET" })
        if (res.status) {
            setSearchResult(res.data)
        }
    }

    return (
        <>
            <main className="sections_admin fb_sec">
                <section className="nav animation_left">
                    <button className="addSectionBTN" onClick={() => {
                        setShowForm(true)
                        setAdding("subject")
                        console.log("Adding Subject")
                    }}>
                        <BookOpen className="icon" />
                        Add Subject
                    </button>
                    <button className="addSectionBTN" onClick={() => {
                        setShowForm(true)
                        setAdding("section")
                        console.log("Adding Section")
                    }}>
                        <School className="icon" />
                        Add Section
                    </button>
                </section>

                <span className="section_attend_Intro animation_left">
                    <p className="section_attend__greet">Manage Section & Subjects</p>
                </span>

                <section className="subject_section_container">
                    <section className="leftBox animation_right">
                        <div className="nav_box">
                            <p className="title">Subjects</p>
                            <input type="text" className="searchBar" placeholder="Search subject" onChange={e => searchSubject(e)} />
                        </div>
                        {
                            subjects ? (
                                <div className="subjectBox">
                                    {
                                        searchKeyword == "" ? (
                                            <AddSubject subList={subjects} />
                                        ) : (
                                            <AddSubject subList={searchResult} />
                                        )
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

                    <section className="rightBox animation_left">
                        <div className="nav_box">
                            <p className="title">Sections</p>
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
                                                        <button className="actionBTN">
                                                            <SquarePen className="actionBTNIcon" />
                                                        </button>
                                                        <button className="actionBTN">
                                                            <Trash className="actionBTNIcon" />
                                                        </button>
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
                showForm && <div className={`overlay_addSec fb_sec ${isFormClosing ? "overlay_addSec_closing" : ""}`}>
                    <Adding close={closeForm} adding={adding} />
                </div>
            }
        </>
    )
}