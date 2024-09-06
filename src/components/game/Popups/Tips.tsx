import "./Tips.css"
import { IconContext } from "react-icons";
import { isMobile, PopUpProp } from "../../../types/Types";
import {  useState } from "react";
import { AiOutlineVideoCamera } from "react-icons/ai";


function Tips({index, selectedIndex, setSelectedIndex}:PopUpProp){
    const [show, setShow] = useState(false)

    const handleOnClick = () => {
        setSelectedIndex(index)
        setShow(!show)
        console.log("Tips clicked", index, selectedIndex)

    }
    // console.log("Tips clicked", index, selectedIndex)

    // useEffect(() => {
    //     setSelectedIndex(index)
    //     console.log("Tips useEffect", index, selectedIndex)
    // },[show])

    const showTipPopUp = () => {
        return (index === selectedIndex &&  show) ? "tip-popup-show": "tip-popup"
    }
    return (
        isMobile() && 
        <IconContext.Provider value={{size:"30", color:"white"}}>
        
            <div className="tip-container" >
            {/* <button className="popup-button" onClick={handleOnClick}>camera tips</button> */}
                <AiOutlineVideoCamera  onClick={handleOnClick}/>
                <div className={showTipPopUp()} 
                  onClick={handleOnClick} >
                    <h3>Camera Tips:</h3>
                    <p>Pinch Gestures to Zoom In and Out <br/>
                        Swipe Gestures to rotate the camera <br/>
                        Two-Finger swipe to move the board
                    </p>
                </div>
            </div>
        </IconContext.Provider>
    )
}

export default Tips