import { useState } from "react"
import { GameProp, SIMPLE_GOD_POWERS } from "../../types/Types"
import { ALL_GODS_INFO } from "../godCard/GodCardsInformation"
import Game from "./Game"
import PowerPopUp from "./Popups/PowerPopUp"
import Tips from "./Popups/Tips"
import "./GameBoard.css"


function GameBoard ({playerInfo, opponents}:GameProp){
    const [selectedIndex, setSelectedIndex] = useState("")

    // console.log("GameBoard", playerInfo.identifier, ALL_GODS_INFO[0])
    return(
        <div>
            <div className="player-info">
            {
                playerInfo.identifier && 
                <PowerPopUp name={"You"} 
                    godCardInfo={ALL_GODS_INFO.find((p) => {
                        return p.identifier === playerInfo.identifier
                })} index={playerInfo.type as string} selectedIndex ={selectedIndex} setSelectedIndex={setSelectedIndex}/>
            }
            </div>
            <div className="opponent-info">
                {
                    opponents.map(opponent => {
                        return  <PowerPopUp key={opponent.name+opponent.type} name={opponent.name} 
                        godCardInfo={ALL_GODS_INFO.find((p) => {
                            return p.identifier === opponent.identifier})} index={opponent.type as string} 
                            selectedIndex ={selectedIndex} setSelectedIndex={setSelectedIndex} />                    
                    })
                }
            </div>
                
            <Tips index="camera" selectedIndex ={selectedIndex} setSelectedIndex={setSelectedIndex}/>
            <Game playerInfo={playerInfo} opponents={opponents} /> 
        </div>
    )
}

export default GameBoard