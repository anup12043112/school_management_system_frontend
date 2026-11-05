import "../styles/components/dialogueBox.css"
import { AlertTriangle } from "lucide-react"
import { useState, useContext } from "react"
import { DataContext } from "../context/DataContext"


export function ConfirmationBox({ confirm }) {
    const { showConf, setShowConf, isConfClosing, setIsConfClosing, confLabel } = useContext(DataContext)

    function proceed() {
        setIsConfClosing(true)
        confirm()
    }

    function closeNdReset(){
        setShowConf(false)
        setIsConfClosing(false)
    }
    return (
        <>
            {showConf &&
                <section className={`confBox_bg ${isConfClosing ? "closeConfBox" : ""}`}>
                    <section className="confBox">
                        <div className="head_confBox">
                            <AlertTriangle className="icon_confBox" />
                        </div>
                        <p className="confMsg">{confLabel}</p>
                        <div className="buttons_confBox">
                            <button onClick={closeNdReset} className="confBTN1">Cancel</button>
                            <button onClick={proceed} className="confBTN2">Confirm</button>
                        </div>
                    </section>
                </section>
            }
        </>
    )
}