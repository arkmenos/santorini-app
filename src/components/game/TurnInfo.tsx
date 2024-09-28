import { Player, PlayerInfo } from "../../types/Types"
import "./TurnInfo.css"

interface TurnInfoProp {
    opponents:PlayerInfo[],
    player: PlayerInfo,
    currentPlayerTurn: Player | undefined,
    message?: string
}
function TurnInfo({opponents, player, currentPlayerTurn, message}:TurnInfoProp){
    
    const turnMsg = () => {
        if(currentPlayerTurn === player.type) return "Your Turn";
        let msg = ""
        opponents.map(o => {
            if(currentPlayerTurn === o.type) msg = o.name + "'s Turn"
        })        
        return msg

    }

    return (
        <div className="turn-info">
            <span><p className="turn-msg">{turnMsg()}</p></span>
            { message && <span><p className="turn-msg-sub">{message}</p></span>}
        </div>
    )
}

export default TurnInfo