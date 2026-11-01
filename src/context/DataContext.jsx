import { createContext } from "react";
import { useState } from "react";
import { request } from "../services/apiClient"

export const DataContext = createContext()

export function DataProvider({ children }) {
    const [sections, setSections] = useState("")
    const [parents, setParents] = useState("")
    const [subjects, setSubjects] = useState("")
    const [students, setStudents] = useState("")
    const [teachers, setTeachers] = useState("")
    const [teaching_assignment, setTeaching_assignment] = useState("")
    const [teaching_assignmentFiltered, setTeaching_assignmentFiltered] = useState("")
    const [profile, setProfile] = useState("")
    const [notice, setNotice] = useState("")
    
    async function fetchSections(){
        const res = await request({url: "/api/sections/", method: "GET"})
        if (res.status){
            setSections(res.data)
        }
    }

    async function fetchSubjects(){
        const res = await request({url: "/api/subjects/", method: "GET"})
        if (res.status){
            setSubjects(res.data)
        }
    }

    async function fetchStudents(){
        const res = await request({url: "/api/students/", method: "GET"})
        if (res.status){
            setStudents(res.data)
        }
    }

    async function fetchTeachers(){
        const res = await request({url: "/api/teachers/", method: "GET"})
        if (res.status){
            setTeachers(res.data)
        }
    }

    async function fetchParents(){
        const res = await request({url: "/api/parents/", method: "GET"})
        if (res.status){
            setParents(res.data)
        }
    }

    async function fetchTeachingAssignment(e){
        let val = ""
        if (e){
             val = e.target.value
        }
        if (val === "all" || val === "") {
            const req = await request({ url: "/api/teaching-assignments/", method: "GET" })
            if (req.status) {
                setTeaching_assignment(req.data)
            }
        } else {
            const req = await request({ url: `/api/teaching-assignments/?section=${val}`, method: "GET" })
            if (req.status) {
                setTeaching_assignment(req.data)
            }
        }
    }

    async function fetchProfile(){
        const res = await request({url: "/api/auth/me/", method: "GET"})
        if (res.status){
            setProfile(res.data)
        }
    }

    async function fetchNotice(){
        const res = await request({url: "/api/notices/", method: "GET"})
        if (res.status){
            setNotice(res.data)
        }
    }

    function clearData(){
        setParents("")
        setProfile("")
        setSections("")
        setSubjects("")
        setTeachers("")
        setTeaching_assignment("")
   }

    return (
        <DataContext.Provider value={{ sections, fetchSections, subjects, fetchSubjects, students, fetchStudents, teachers, fetchTeachers, teaching_assignment, fetchTeachingAssignment, setTeaching_assignment, teaching_assignmentFiltered, setTeaching_assignmentFiltered, profile, fetchProfile, parents, fetchParents, notice, fetchNotice, clearData}}>
            {children}
        </DataContext.Provider>
    )
}