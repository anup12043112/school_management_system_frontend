import "../styles/components/buttons.css"



export function NewRecordButton({onClick, buttonStyle, Icon, iconStyle, label}) {
    return (
        <button className={`addNewRecordBTN ${buttonStyle ? buttonStyle : ""}`} onClick={onClick}>
            <Icon className={`icon ${iconStyle ? iconStyle : ""}`} />
            {label}
        </button>
    )
}