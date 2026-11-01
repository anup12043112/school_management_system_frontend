import "../styles/components/heading.css"
import {X} from "lucide-react"


export function HeadingMd({ boxStyle, Icon, iconStyle, label }) {
    return (
        <div className={`headerMd ${boxStyle ? boxStyle : ""}`}>
            {Icon && <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />}
            <p>{label}</p>
        </div>
    )
}

export function HeadingLg({ boxStyle, Icon, iconStyle, label }) {
    return (
        <div className={`headerLg ${boxStyle ? boxStyle : ""}`}>
            {Icon && <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />}
            <p>{label}</p>
        </div>
    )
}


export function OverlayHead({Icon, label, onClick, height}) {
    return (
        <div className="header" style={{height: height}}>
            <div className="leftDiv">
                <HeadingMd Icon={Icon} label={label} />
            </div>
            <div className="rightDiv">
                <button className="closeBTN" onClick={onClick}>
                    <X className="closeIconStyle"/>
                </button>
            </div>
        </div>
    )
}