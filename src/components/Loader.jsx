import "../styles/loader.css"
import "../styles/commonCSS.css"
import { LucideSearch } from "lucide-react"

export default function Loader() {
    return (
        <section className="loaderBox">
            <div className="loadingCircle"></div>
            <p className="loadingText">Loading</p>
        </section>
    )
}


export function SearchBar({ searchFunc, boxStyle, searchStyle }) {
    return (
        <div className={`searchBox ${boxStyle ? boxStyle : ""}`}>
            <LucideSearch className="searchIcon" />
            <input type="text" className={`search ${searchStyle ? searchStyle : ""}`}placeholder="Search a student" onChange={e => searchFunc(e)} />
        </div>
    )
}