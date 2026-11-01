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
        let req = await fetch(`${BASE_URL}${url}`, {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        })

        if (req.status === 401) {
            const r = await refreshToken()

            if (!r.status) {
                removeTokens()
                return {
                    status: false,
                    data: {
                        message: "Login expired, Please Log in again !"
                    }
                }
            }

            req = await fetch(`${BASE_URL}${url}`, {
                method,
                headers: {
                    "Content-type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                ...(body && { body: JSON.stringify(body) })
            })
        }

        const res = req.status === 204 ? null : await req.json()

        return {
            status: req.ok,
            data: res
        }

    } catch (error) {
        console.log("error: ", error)
        return {
            status: false,
            data: {
                message: error.message
            }
        }
    }
}