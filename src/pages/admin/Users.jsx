import "../../styles/admin/adminUsers.css"
import "../../styles/animation.css"
import { SquarePen, Trash, UserPlus, Users2, LucidePersonStanding, User2 } from "lucide-react"
import { useState, useEffect, use } from "react"
import { capitalize } from "../../services/utils"
import { request } from "../../services/apiClient"

import { SearchBar } from "../../components/Loader"
import { NewRecordButton, FormButton, ActionButton } from "../../components/Buttons"
import { HeadingMd } from "../../components/Headings"
import Loader from "../../components/Loader"
import { OverlayHead } from "../../components/Headings"
import { Input, Status } from "../../components/Loader"


const ListUsers = ({ users, setMsg, status, isDone, setInst, reflectChange }) => {
    const deleteUser = async (id) => {
        const res = await request({ url: `/api/users/${id}/`, method: "DELETE" })
        status()
        if (res.data === null) {
            isDone()
            setMsg("User is deleted successfully")
            reflectChange()
        } else {
            setMsg("Deletion unsuccessful.")
        }
    }
    return (
        users ? (users.map(user => {
            return (
                <>
                    <div className="user" key={user.id}>
                        <p className="user_name">{user.first_name} {user.last_name} ({user.username})</p>
                        <p className={`user_role ${user.role}`}>{String(capitalize(user.role))}</p>
                        <span className="user_actions">
                            <ActionButton Icon={SquarePen} onClick={() => setInst(user)} />
                            <ActionButton Icon={Trash} onClick={() => deleteUser(user.id)} />
                        </span>
                    </div>
                </>
            )
        })) : (
            <h1>Loading</h1>
        )
    )
}

function FilterBTN({ label, onClick }) {
    return (
        <button className="filterRoleBTN" onClick={onClick}>
            <Users2 className="icon" />
            {label}
        </button>
    )
}

function AddNewRecord({ close, instance, status, isDone, setMsg, reflectChange }) {
    const [userObj, setUserObj] = useState(instance || {})


    async function performAction() {
        if (userObj.username && userObj.first_name && userObj.last_name && userObj.password && userObj.role) {
            if (Object.keys(instance || {}).length === 0) {
                const res = await request({ url: "/api/users/", method: "POST", body: userObj })
                status()
                if (res.status && res.data.first_name) {
                    isDone()
                    setMsg(`User with username [${res.data.username}] is created successfully.`)
                    setUserObj({})
                    reflectChange()
                } else {
                    status()
                    setMsg(res.data.username[0])
                }
            } else {
                const res = await request({ url: `/api/users/${userObj.id}/`, method: "PATCH", body: userObj })
                status()
                if (res.data.first_name) {
                    isDone()
                    setMsg(`User (${userObj.first_name} ${userObj.last_name}) is updated successfully. Refresh the page to reflect the change.`)
                } else {
                    setMsg(`Can't update the User (${userObj.first_name} ${userObj.last_name}) right now, try again later.`)
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
            <div className="headUser">
                <OverlayHead Icon={UserPlus} label={"Add User"} onClick={close} />
            </div>
            <form className="bodyUser">

                <div className="inputSet">
                    <Input name={"first_name"} onChange={e => setValue(e)} placeholder={"Enter First Name"} label={"First Name"} value={userObj.first_name ?? ""} />
                    <Input name={"last_name"} onChange={e => setValue(e)} placeholder={"Enter Last Name"} label={"Last Name"} value={userObj.last_name ?? ""} />
                </div>

                <div className="inputSet">
                    <Input name={"username"} onChange={e => setValue(e)} placeholder={"Create Username"} label={"Username"} value={userObj.username ?? ""} />
                    {
                        Object.keys(instance || {}).length === 0 && <Input name={"password"} onChange={e => setValue(e)} placeholder={"Create Password"} label={"Password"} value={userObj.password ?? ""} />
                    }
                </div>

                <div className="inputSet">
                    <span>
                        <p>Select Role</p>
                        <select name="role" onChange={e => setValue(e)} required value={userObj.role ?? ""}>
                            <option value="" disabled>Role</option>
                            <option value="teacher">Teacher</option>
                            <option value="parent">Parent</option>
                            <option value="student">Student</option>
                        </select>
                    </span>
                </div>

                <FormButton onClick={performAction} label={Object.keys(instance || {}).length === 0 ? "Create User" : "Update"} />
            </form>
        </main>
    )
}


export default function Users() {
    const [users, setUsers] = useState("")
    const [usersBackup, setUsersBackup] = useState("")

    const [selectedCategory, setSelectedCategory] = useState("all")

    const [searchKeyword, setSearchKeyword] = useState("")
    const [searchResult, setSearchResult] = useState("")

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
        setInstance(e)
        setShowForm(true)
    }

    useEffect(() => {
        async function getData() {
            const user = await request({ url: "/api/users/", method: "GET" })
            if (user.status) {
                setUsers(user.data)
                setUsersBackup(user.data)
            }
        }
        getData()
    }, [])


    async function handleSearch(e) {
        const val = e.target.value
        setSearchKeyword(val)
        const res = await request({ url: `/api/users/?search=${val}`, method: "GET" })

        if (res.status) {
            setSearchResult(res.data)
        }
    }

    async function handleFilter(e) {
        if (e === "all") {
            setSelectedCategory("all")
            setUsers(usersBackup)
        } else {
            setSelectedCategory(e)
            const res = await request({ url: `/api/users/?role=${e}`, method: "GET" })
            if (res.status) {
                setUsers(res.data)
            }
        }
    }

    async function reflectChange(){
        const res = await request({url: "/api/users/", method: "GET"})
        if (res.status ){
            setUsers(res.data)
            setUsersBackup(res.data)
        } 
    }

    return (
        <>
            <main className="users_admin">
                <section className="nav animation_left">
                    <NewRecordButton Icon={UserPlus} onClick={() => setShowForm(true)} label={"Add User"} />
                </section>

                <span className="usersIntro animation_left">
                    <p className="users_greet">Manage Users</p>
                </span>

                <div className="filterButtons animation_left">
                    <div className="searchContainer">
                        <SearchBar searchFunc={handleSearch} placeholder={"Search an User"} />
                    </div>

                    <div className="filterBTNBox">
                        <FilterBTN onClick={() => handleFilter("all")} label="All Users" />
                        <FilterBTN onClick={() => handleFilter("student")} label="Students" />
                        <FilterBTN onClick={() => handleFilter("teacher")} label="Teachers" />
                        <FilterBTN onClick={() => handleFilter("parent")} label="Parents" />
                    </div>
                </div>

                <section className="usersBox animation_right">
                    <div className="head">
                        <HeadingMd Icon={Users2} label={selectedCategory == "student" ? "Students" : selectedCategory == "teacher" ? "Teachers" : selectedCategory == "parent" ? "Parents" : "All Users"} />
                    </div>
                    {
                        users ? (
                            <section className="usersListBox">
                                {
                                    searchKeyword ? (
                                        <ListUsers users={searchResult} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} setInst={setInstanceObj} reflectChange={reflectChange} />
                                    ) : (
                                        <ListUsers users={users} status={updateStatus} isDone={updateDoneStatus} setMsg={setMsg} setInst={setInstanceObj} reflectChange={reflectChange} />
                                    )
                                }
                            </section>
                        ) : (
                            <Loader />
                        )
                    }
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