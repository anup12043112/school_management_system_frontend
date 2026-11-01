import "../styles/components/buttons.css"



export function NewRecordButton({ onClick, buttonStyle, Icon, iconStyle, label }) {
    return (
        <button className={`addNewRecordBTN ${buttonStyle ? buttonStyle : ""}`} onClick={onClick}>
            <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />
            {label}
        </button>
    )
}

export function ChangePageButton({ onClick, buttonStyle, label }) {
    return (
        <button
            style={{ backgroundColor: buttonStyle }}
            className={`changePG ${buttonStyle ? buttonStyle : ""}`}
            onClick={onClick}>
            {label}
        </button>
    )
}

export function ActionButton({ Icon, iconStyle, onClick, buttonStyle }) {
    return (
        <button className={`actionBTN ${buttonStyle ? buttonStyle : ""}`} onClick={onClick}>
            <Icon className={`actionBTNIcon ${iconStyle ? iconStyle : ""}`} />
        </button>
    )
}

export function FormButton({Icon, iconStyle, buttonStyle, onClick, label}){
    return (
        <button className={`formBTN ${buttonStyle ? buttonStyle : ""}`} onClick={onClick} type="button">
            {label}
            {Icon && <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />}
        </button>
    )
}