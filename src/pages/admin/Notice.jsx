import "../../styles/admin/adminNotice.css"
import "../../styles/commonCSS.css"
import { useState, useEffect, useContext } from "react"
import { request } from "../../services/apiClient"
import { DataContext } from "../../context/DataContext"
import { capitalize } from "../../services/utils"
import { X, Trash, ScrollText, ClipboardPlus, Megaphone, UserShield, BellRing } from "lucide-react"
import Loader from "../../components/Loader"


function AddNotice({ close }) {
    const [title, setTitle] = useState(null)
    const [desc, setDesc] = useState(null)
    const [postedBy, setPostedBy] = useState(null)
    const { profile } = useContext(DataContext)

    useEffect(() => {
        if (profile) {
            const role = capitalize(String(profile.role))
            setPostedBy(role)
        }
    }, [profile])

    async function createNotice() {
        if (title && desc) {
            const req = await request({
                url: "/api/notice/", method: "POST", body: {
                    header: title,
                    description: desc,
                    posted_by: postedBy
                }
            })

            if (req.status) {
                alert("Notice Created")
            } else {
                alert("Something went wrong")
            }
        }
    }
    return (
        <main className="noticeForm_admin">

            <nav className="nav">
                <span>
                    <ClipboardPlus className="icon" />
                    <p className="noticeFormTitle">Create Notice</p>
                </span>
                <span>
                    <button className="closeForm" onClick={close}>
                        <X className="close" />
                    </button>
                </span>
            </nav>

            <form className="body">

                <div className="firstSet">
                    <span className="firstInputSet">
                        <p className="inputLabel">Title</p>
                        <input
                            type="text"
                            className="input1"
                            placeholder="Title of the notice"
                            required
                            onChange={e => setTitle(e.target.value)}
                        />
                    </span>

                    <span className="firstInputSet">
                        <p className="inputLabel">Posted By</p>
                        <input
                            type="text"
                            className="input1"
                            value={postedBy}
                        />
                    </span>
                </div>

                <div className="secondSet">
                    <span className="secondInputSet">
                        <p className="inputLabel">Description</p>
                        <textarea
                            type="text"
                            className="input2"
                            placeholder="Description of the notice"
                            required
                            onChange={e => setDesc(e.target.value)}
                        />
                    </span>
                </div>

                <span className="buttonSpan">
                    <button type="button" onClick={() => createNotice()} className="createBTN">Create</button>
                </span>
            </form>
        </main>
    )
}

export default function Notice() {
    const [notice, setNotice] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        async function getData() {
            const res = await request({ url: "/api/notices/", method: "GET" })
            console.log(res.data)
            if (res.status) {
                setNotice(res.data)
            }
        }
        getData()
    }, [])


    function close() {
        setIsClosing(true)
        setTimeout(() => {
            setShowForm(false)
            setIsClosing(false)
        }, 300)
    }
    return (
        <>
            <main className="notice_admin">
                <section className="nav animation_left">
                    <button className="addNewRecordBTN" onClick={() => setShowForm(true)}>
                        <Megaphone className="icon" />
                        Add Notice
                    </button>
                </section>

                <span className="marksIntro animation_left">
                    <p className="marks_greet">Manage Notice</p>
                </span>

                <section className="bottomBox animation_right">
                    <div className="header">
                        <Megaphone className="icon" />
                        <p>All Notice</p>
                    </div>
                    {
                        notice ? (
                            <div className="body">
                                {
                                    notice.map(n => {
                                        return (
                                            <div className="notice">
                                                <div className="head">
                                                    <p className="noticeHeader">{n.header}</p>
                                                    <button><Trash className="icon" /></button>
                                                </div>
                                                <div className="noticeBody">
                                                    <p className="desc">{n.description}</p>
                                                    <div>
                                                        <p className="by"><strong>Posted By:</strong>{n.posted_by}</p>
                                                        <p className="on">{n.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        ) : (
                            <Loader />
                        )
                    }
                </section>
            </main>
            {
                showForm && <div className={`overlay_noticeForm_admin ${isClosing ? "closing" : ""}`}>
                    <AddNotice close={close} />
                </div>
            }
        </>
    )
}