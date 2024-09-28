import { useState } from "react"
import { GodCardInfo, PopUpProp } from "../../../types/Types"
import "./PowerPopUp.css"

interface PowerPopupsProps extends PopUpProp {
    name:string,
    godCardInfo: GodCardInfo | undefined,

}
function PowerPopUp({name, godCardInfo, index,selectedIndex, setSelectedIndex}:PowerPopupsProps){
    const [show, setShow] = useState(false)

    const handleOnClick = () => {
        setSelectedIndex(index)
        setShow(show => !show)
        console.log("PowerPopUp", index, selectedIndex)
    }
    
    // useEffect(() => {
    //     setSelectedIndex(index)
    //     console.log("PowerPopUp useEffect", index, selectedIndex)
    // },[show])

    const showPopUp = () => {
        return (index === selectedIndex && show) ? "popup-power-show": "popup-power"
    }
    if(godCardInfo !== null && godCardInfo !== undefined ){
        return (                
            <div className="popup-container">
                <button className="popup-button" onClick={handleOnClick}>{name} - {godCardInfo.name}</button>
                <div className={showPopUp()}  
                    onClick={handleOnClick} >
                    <h3 className="god-name-header">{godCardInfo.name} : {godCardInfo.flavorText}</h3>
                    <p>{godCardInfo.description}</p>
                </div>
            </div>
        )
    }    
}

export default PowerPopUp