import { Affix, Radio, RadioGroup } from "rsuite"
import { Player, PlayerInfo } from "../../types/Types"
import {v4 as uuid}from "uuid"

interface TurnIndicatorProp {
    players:PlayerInfo[],
    player: PlayerInfo,
    currentPlayerTurn: Player | undefined
}
function TurnIndicator({players, player, currentPlayerTurn}: TurnIndicatorProp) {
    return(
        <Affix className="turn-ind">        
            <p>Player Turn</p>   
            <RadioGroup value={currentPlayerTurn}>
                {
                    players.map(p => {                        
                        const you = p.type === player.type ? "(you)" : "";
                     return  p.type && p.type !== "S" &&  
                        <Radio key={uuid()}  value={p.type} readOnly>
                            {p.name} {you}</Radio>                         
                        
                    })
                }
            </RadioGroup>
        </Affix>
    )
}

export default TurnIndicator