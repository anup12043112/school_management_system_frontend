// utils.js 

import { request } from "./apiClient"


const BASE_URL = "http://127.0.0.1:8000"
export async function getToken(user, pass){
    return request({
        url: "/api/access/",
        method: "POST",
        body: {
            username: user,
            password: pass
        }
    })
}


export function saveTokens(access, refresh){
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
}


export function removeTokens(){
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
}


export async function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token")
    const req = await fetch(`${BASE_URL}/api/refresh/`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            refresh: refresh_token
        }) 
    })

    const res = await req.json()
    if (res.access){
        localStorage.setItem("access_token", res.access)
        return ({
            status: true,
            data: res.access
        })
    } else {
        return ({
            status: false,
            data: {message: "Something went wrong"}
        })
    }
}


export function capitalize(name){
    const first_char = name.slice(0, 1)
    const rest_name = name.slice(1, name.length)
    const newName = first_char.toUpperCase().concat(rest_name)
    return newName
}

