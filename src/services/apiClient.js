// apiClient.js 

import { refreshToken, removeTokens } from "./utils"

const BASE_URL = import.meta.env.VITE_BASE_URL
export async function request({ url, method, body }) {

    let headers = {
        "Content-type": "application/json",
    }

    const access_token = localStorage.getItem("access_token")

    if (access_token) {
        headers = {
            ...headers,
            "authorization": `Bearer ${access_token}`
        }
    }
    try {
        let req
        if (body) {
            req = await fetch(`${BASE_URL}${url}`, {
                method,
                headers,
                body: JSON.stringify(body)
            })
        } else {
            req = await fetch(`${BASE_URL}${url}`, {
                method,
                headers
            })
        }
        let res = await req.json()
        if (req.status === 401) {
            console.log("Invalid token")
            const r = await refreshToken()
            if (!r.status) {
                removeTokens()
                return ({
                    status: false,
                    data: {
                        message: "Login expired, Please Log in again !"
                    }
                })
            }
            if (body) {
                req = await fetch(`${BASE_URL}${url}`, {
                    method,
                    headers: {
                        "Content-type": "application/json",
                        "authorization": `Bearer ${localStorage.getItem("access_token")}`
                    },
                    body: JSON.stringify(body)
                })
            } else {
                req = await fetch(`${BASE_URL}${url}`, {
                    method,
                    headers: {
                        "Content-type": "application/json",
                        "authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                })
            }
            res = await req.json()
            return ({
                status: true,
                data: res
            })
        }
        return {
            status: true,
            data: res
        }

    } catch (error) {
        console.log("error: ", error)
    }
}
