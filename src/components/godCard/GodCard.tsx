import { useEffect, useState } from "react"
import { GamePlayer, GodCardInfo, GodIdentifier, PlayerInfo } from "../../types/Types"
import "./GodCard.css"

interface GodCardProp {
    godCardInfo: GodCardInfo,
    selectedPower: GodIdentifier | null,
    pickTurn:GamePlayer| null,
    player:PlayerInfo,
    opponents: PlayerInfo[],
    setSelectedPower: (power: GodIdentifier|null) => void,
    // setOpponents: (players: PlayerInfo[]) => void,
}
function GodCard({godCardInfo, selectedPower, pickTurn, player, opponents, setSelectedPower}:GodCardProp){
    const [opponentPowers, setOpponentPowers] = useState<GodIdentifier[]>([]);

    const handleClick = () => {

        console.log("Pick turn in GodCard", pickTurn, player)
        
        // if(pickTurn === player.type){
        
            if(selectedPower === godCardInfo.identifier){ 
                setSelectedPower(null) 
                // const updatedPlayer:PlayerInfo = {name:player.name, roomId:player.roomId,
                //     type:player.type, identifier: null}    
                // setPlayer(updatedPlayer)    
                // socket.emit('updatePlayerPower', updatedPlayer)   
            }
            else{
                setSelectedPower(godCardInfo.identifier)         
            }
        // }
    }

    useEffect(()=> {
        const powers:GodIdentifier[] = []
        opponents && opponents.forEach(o => {
            if(o.identifier !== null) powers.push(o.identifier)
        })
        setOpponentPowers(powers)
    },[opponents])
    
    const determineDecoration = () => {

        if(godCardInfo.identifier && opponentPowers.includes(godCardInfo.identifier)){            
            return "godcard-container-opponent"
        }
        else if(selectedPower === godCardInfo.identifier){            
            return "godCard-container-selected"
        }

        return "godcard-container"
    }
    

    return(
        <div  className={determineDecoration()} onClick={()=>handleClick()}  >            
            <p>{godCardInfo.name}</p>   
            <img src={"/godCards/" + godCardInfo.name + ".png"}  />
            <p>{godCardInfo.flavorText}</p>
                    
        </div>
    )
}

export default GodCard