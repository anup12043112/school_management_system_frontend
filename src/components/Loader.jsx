import "../styles/loader.css"
import "../styles/commonCSS.css"
import { LucideSearch, CheckCircle, MessageCircleWarning } from "lucide-react"

export default function Loader() {
    return (
        <section className="loaderBox">
            <div className="loadingCircle"></div>
            <p className="loadingText">Loading</p>
        </section>
    )
}

export function SearchBar({ searchFunc, boxStyle, searchStyle, placeholder }) {
    return (
        <div className={`searchBox ${boxStyle ? boxStyle : ""}`}>
            <LucideSearch className="searchIcon" />
            <input type="text" className={`search ${searchStyle ? searchStyle : ""}`} placeholder={placeholder} onChange={e => searchFunc(e)} />
        </div>
    )
}

export function Input({ type, placeholder, name, onChange, label, value, readOnly }) {
    return (
        <div className="inputWithValueBox">
            {label && <p>{label}</p>}
            {readOnly ? (
                <input
                    type={type ? type : "text"}
                    required
                    value={value}
                    name={name}
                    className="readOnly"
                    readOnly />
            ) : (
                <input
                    type={type ? type : "text"}
                    required
                    value={value}
                    placeholder={placeholder}
                    name={name}
                    onChange={onChange} />
            )}
        </div>
    )
}

export function Status({ label, status }) {
    return (
        <section className="statusMain">
            {
                status ? (
                    <>
                        <CheckCircle className="icon" />
                        <p>{label}</p>
                    </>
                ) : (
                    <>
                        <MessageCircleWarning className="icon" style={{ color: "red" }} />
                        <p>{label}</p>
                    </>
                )
            }
        </section>
    )
}