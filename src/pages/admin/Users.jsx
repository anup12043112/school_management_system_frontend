import "../../styles/admin/adminUsers.css"
import "../../styles/animation.css"
import { SquarePen, Trash, UserPlus, Users2 } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { DataContext } from "../../context/DataContext"
import { capitalize } from "../../services/utils"
import { request } from "../../services/apiClient"
import { SearchBar } from "../../components/Loader"
import { NewRecordButton } from "../../components/Buttons"


const ListUsers = ({ users }) => {
    return (
        users ? (users.map(user => {
            return (
                <>
                    <div className="user">
                        <p className="user_name">{user.first_name} {user.last_name} ({user.username})</p>
                        <p className={`user_role ${user.role}`}>{String(capitalize(user.role))}</p>
                        <span className="user_actions">
                            <button className="actionBTN">
                                <SquarePen className="actionBTNIcon" />
                            </button>
                            <button className="actionBTN">
                                <Trash className="actionBTNIcon" />
                            </button>
                        </span>
                    </div>
                </>
            )
        })) : (
            <h1>Loading</h1>
        )
    )
}

function FilterBTN({ label, click }) {
    return (
        <button className="filterRoleBTN" onClick={click}>
            <Users2 className="icon" />
            {label}
        </button>
    )
}

export default function Users() {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [user_parent, setUser_parent] = useState(null)
    const [user_teacher, setUser_teacher] = useState(null)
    const [user_student, setUser_student] = useState(null)

    const [searchKeyword, setSearchKeyword] = useState("")
    const [searchResult, setSearchResult] = useState("")
    const [searchStatus, setSearchStatus] = useState(true)

    const { users } = useContext(DataContext)

    useEffect(() => {
        var parent = []
        var teacher = []
        var student = []

        if (users) {
            users.forEach(user => {
                if (user.role === "student") {
                    student.push(user)
                } else if (user.role === "teacher") {
                    teacher.push(user)
                } else if (user.role === "parent") {
                    parent.push(user)
                }
            });
            setUser_parent(parent)
            setUser_teacher(teacher)
            setUser_student(student)
        }

    }, [users])


    async function handleSearch(e) {
        const val = e.target.value
        setSearchKeyword(val)
        const res = await request({ url: `/api/users/?search=${val}`, method: "GET" })

        if (res.status) {
            setSearchResult(res.data)
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
                    <SearchBar searchFunc={handleSearch} />

                    <div className="filterBTNBox">
                        <FilterBTN click={() => setSelectedCategory("all")} label="All Users" />
                        <FilterBTN click={() => setSelectedCategory("student")} label="Students" />
                        <FilterBTN click={() => setSelectedCategory("teacher")} label="Teachers" />
                        <FilterBTN click={() => setSelectedCategory("parent")} label="Parents" />
                    </div>
                </div>

                <section className="usersBox animation_right">
                    <div className="userHeader">
                        <Users2 className="userBoxIcon" />
                        <p>
                            {
                                selectedCategory == "student" ? "Students" : selectedCategory == "teacher" ? "Teachers" : selectedCategory == "parent" ? "Parents" : "All Users"
                            }
                        </p>
                    </div>
                    {
                        users ? (
                            <section className="usersListBox">
                                {
                                    searchKeyword ? (
                                        <ListUsers users={searchResult} />
                                    ) : (
                                        selectedCategory == "all" ? (
                                            <ListUsers users={users} />
                                        ) : (
                                            selectedCategory == "teacher" ? (
                                                <ListUsers users={user_teacher} />
                                            ) : (
                                                selectedCategory == "student" ? (
                                                    <ListUsers users={user_student} />
                                                ) : (
                                                    selectedCategory == "parent" ? (
                                                        <ListUsers users={user_parent} />
                                                    ) : (
                                                        !searchStatus ? (
                                                            <div className="noResult">
                                                                No Result Found
                                                            </div>
                                                        ) : (
                                                            <h2>Loading</h2>
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                }
                            </section>
                        ) : (
                            <section className="loaderBox">
                                <div className="loadingCircle"></div>
                                <p className="loadingText">Loading</p>
                            </section>
                        )
                    }
                </section>
            </main>
        </>
    )
}