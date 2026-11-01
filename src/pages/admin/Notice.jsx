import "../../styles/admin/adminNotice.css"
import "../../styles/commonCSS.css"
import { useState, useEffect } from "react"
import { request } from "../../services/apiClient"
import { capitalize } from "../../services/utils"
import { Trash, Megaphone } from "lucide-react"

import Loader from "../../components/Loader"
import { Input, Status } from "../../components/Loader"
import { HeadingLg, OverlayHead } from "../../components/Headings"
import { FormButton, ActionButton, NewRecordButton } from "../../components/Buttons"



function AddNewRecord({ close, status, isDone, setMsg, reflectChange }) {
    const [userObj, setUserObj] = useState({})
    const [profile, setProfile] = useState("")

    useEffect(() => {
        async function getProfile() {
            const res = await request({ url: "/api/auth/me/", method: "GET" })
            if (res.status) {
                const by = `${res.data.first_name} ${res.data.last_name} (${capitalize(String(res.data.role))})`
                setUserObj(prev => ({ ...prev, posted_by: by }))
            }
        }
        getProfile()
    }, [])

    async function performAction() {
        console.log(userObj)
        if (userObj.header && userObj.description && userObj.posted_by) {
            const res = await request({ url: "/api/notices/", method: "POST", body: userObj })
            console.log(res)
            status()
            if (res.status && res.data.id) {
                console.log(res.data.id)
                isDone()
                setMsg(`Notice is created successfully.`)
                setUserObj({})
                reflectChange()
                close()
            } else {
                status()
                setMsg("Something went wrong")
            }

        } else {
            status()
            setMsg("Every field is required.")
        }
    }

    function setValue(e) {
        setUserObj(prev => (
            { ...prev, [e.target.name]: e.target.value }
        ))
    }
    return (
        <main className="newRecordNotice">
            <div className="headNotice">
                <OverlayHead Icon={Megaphone} label={"Add Notice"} onClick={close} />
            </div>

            <form className="bodyNotice">
                <div className="inputSet">
                    <Input name={"header"} label={"Header"} value={userObj.header} onChange={e => setValue(e)} placeholder={"Notice Header"} />
                    <Input name={"description"} label={"Description"} value={userObj.description} onChange={e => setValue(e)} placeholder={"Notice Description"} />
                </div>

                <div className="inputSet">
                    <Input name={"posted_by"} label={"Posted By"} value={userObj.posted_by} readOnly={true} />
                </div>

                <FormButton onClick={performAction} label={"Create Notice"} />
            </form>
        </main>
    )
}

export default function Notice() {
    const [notice, setNotice] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)

    const [creationStatus, setCreationStatus] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [popMssg, setPopMsg] = useState("Something went wrong")

    function closeForm() {
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

    useEffect(() => {
        async function getData() {
            const res = await request({ url: "/api/notices/", method: "GET" })
            if (res.status) {
                setNotice(res.data)
            }
        }
        getData()
    }, [])

    async function reflectChange() {
        const res = await request({ url: "/api/notices/", method: "GET" })
        if (res.status) {
            setNotice(res.data)
        }
    }

    const deleteNotice = async (id) => {
        const res = await request({ url: `/api/notices/${id}/`, method: "DELETE" })
        updateStatus()
        if (res.data === null) {
            updateDoneStatus()
            setMsg("Notice is deleted successfully")
            reflectChange()
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }

    return (
        <>
            <main className="notice_admin">
                <section className="nav animation_left">
                    <NewRecordButton label={"Add Notice"} Icon={Megaphone} onClick={() => setShowForm(true)} />
                </section>

                <span className="marksIntro animation_left">
                    <p className="marks_greet">Manage Notice</p>
                </span>

                <section className="bottomBox animation_right">
                    <div className="header">
                        <HeadingLg Icon={Megaphone} label={"All Notice"} />
                    </div>
                    {
                        notice ? (
                            <div className="body">
                                {
                                    notice.map(n => {
                                        return (
                                            <div className="notice" key={n.id}>
                                                <div className="head">
                                                    <p className="noticeHeader">{n.header}</p>
                                                    <ActionButton Icon={Trash} onClick={() => deleteNotice(n.id)} />
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
                showForm && <div className={`overlayBox ${isFormClosing ? "overlayBoxClosing" : ""}`}>
                    <AddNewRecord close={closeForm} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} reflectChange={reflectChange} />
                </div>
            }
            {
                creationStatus && <div className="statusOverlay"><Status label={popMssg ? popMssg : ""} status={isDone} /></div>
            }
        </>
    )
}