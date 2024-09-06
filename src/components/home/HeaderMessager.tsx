import { GamePlayer } from "../../types/Types"

interface HeaderMessageProp {
    playerCount: number,
    ready: boolean,
    player: GamePlayer | undefined
}

function HeaderMessage({ playerCount, ready, player}:HeaderMessageProp){

    if(player === "X"){
        if(playerCount === 1) return <h1 className="header">Waiting for players to join</h1>
        if(playerCount === 2) return <h1 className="header">Start a 2 player game or invite a third player to join</h1>
        if(playerCount === 3) return <h1 className="header">Start game</h1>
    }
   

    if(ready){
        if(playerCount === 2) return <h1 className="header">Waiting on game creator to start game.</h1>
        if(playerCount === 3 ) return <h1 className="header">Waiting on game creator to start a three player game</h1>
    }
   
    return <h1>Waiting for players to join</h1>
}

export default HeaderMessage