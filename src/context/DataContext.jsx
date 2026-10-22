import { createContext, useState, useEffect } from "react";
import { request } from "../services/apiClient";

export const DataContext = createContext()

export function DataProvider({ children }) {
    const [marks, setMarks] = useState(null)
    const [notice, setNotice] = useState(null)
    const [profile, setProfile] = useState(null)
    const [parents, setParents] = useState(null)
    const [sections, setSections] = useState(null)
    const [subjects, setSubjects] = useState(null)
    const [users, setUsers] = useState(null)
    const [teachers, setTeachers] = useState(null)
    const [teaching_assignment, setTeaching_assignment] = useState(null)
    const [students, setStudents] = useState(null)




    useEffect(() => {
        const getData = async () => {
            const marks = await request({url: "/api/marks/", method: "GET"})
            const notice = await request({url: "/api/notices/", method: "GET"})
            const profile = await request({url: "/api/auth/me/", method: "GET"})
            const parent = await request({url: "/api/parents/", method: "GET"})
            const sections = await request({url: "/api/sections/", method: "GET"})
            const student = await request({url: "/api/students/", method: "GET"})
            const subject = await request({url: "/api/subjects/", method: "GET"})
            const teacher = await request({url: "/api/teachers/", method: "GET"})
            const teaching_assignment = await request({url: "/api/teaching-assignments/", method: "GET"})
            const user = await request({url: "/api/users/", method: "GET"})
           
            if (marks.status){
                // console.log("Marks", marks.data)
                setMarks(marks.data)
            }
            if (notice.status){
                // console.log("Notice", notice.data)
                setNotice(notice.data)
            }
            if (profile.status){
                // console.log("Profile", profile.data)
                setProfile(profile.data)
            }
            if (parent.status){
                // console.log("Parent", parent.data)
                setParents(parent.data)
            }
            if (sections.status){
                // console.log("Sections", sections.data)
                setSections(sections.data)
            }
            if (teacher.status){
                // console.log("Sections", sections.data)
                setTeachers(teacher.data)
            }
            if (teaching_assignment.status){
                // console.log(teaching_assignment.data)
                setTeaching_assignment(teaching_assignment.data)
            }
            if (subject.status){
                // console.log("Subjects", subject.data)
                setSubjects(subject.data)
            }
            if (student.status){
                // console.log("Students", student.data)
                setStudents(student.data)
            }
            if (user.status){
                // console.log("Users", user.data)
                setUsers(user.data)
            }
        }
        getData()
    }, [])
    return <DataContext.Provider value={{marks, setMarks, notice, setNotice, profile, setProfile, sections, setSections, subjects, setSubjects, users, setUsers, teachers, setTeachers, students, setStudents, teaching_assignment, setTeaching_assignment, parents, setParents}}>
        {children}
    </DataContext.Provider>
}