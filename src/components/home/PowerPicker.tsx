import { useEffect, useState } from "react";
import { GamePlayer, GameStartPhase, GodCardInfo,  GodIdentifier,  PlayerInfo,  SIMPLE_GOD_POWERS } from "../../types/Types";
import { ALL_GODS_INFO } from "../godCard/GodCardsInformation";
import GodCard from "../godCard/GodCard";
import {v4 as uuid}from "uuid";
import "./PowerPicker.css"
import { socket } from "../../socket/socket";


interface PowerPickerProps{
    player:PlayerInfo,
    opponents: PlayerInfo[],
    // setPickPower: (pickPower:boolean) => void,
    setPlayerInfo: (playerInfo: PlayerInfo) => void,    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOpponents: (arg0: any) => void,
    setPhase:(phase:GameStartPhase) => void
}

function PowerPicker({player, opponents, setPlayerInfo: setPlayer, setOpponents,setPhase}:PowerPickerProps){
    const [godPowers, setGodPowers] = useState<GodCardInfo[]>([]) 
    const [selectedPower, setSelectedPower] = useState<GodIdentifier|null>(null);
    const [pickTurn, setPickTurn] = useState<GamePlayer | null>("X")     
    

    useEffect(()=> {
        const tempPowers:GodCardInfo[]  = [];
         SIMPLE_GOD_POWERS.filter(p => {
            const g = ALL_GODS_INFO.find(g => g.identifier === p)
           g && tempPowers.push(g)
        })
        setGodPowers(tempPowers);
        if(player.type === "X"){
            socket.emit("X-PowerPick");
            setPickTurn("X")
        }
    }, [])  

    socket.off('updatePlayerPower')
    socket.on('updatePlayerPower', (data:PlayerInfo) => {
        console.log("updated player",data)
        if(data.type === player.type){
            console.log("updating player with: ", data)
            setPlayer(data)
        }else{
            console.log("opponents,", opponents)
            const updatedOpponents = [...opponents.filter(o => o.type !== data.type), data]
            setOpponents(updatedOpponents)
        }        
    })

    socket.off('X-PowerPick')
    socket.on('X-PowerPick', () => {
        setPickTurn("X")
        console.log("Setting pickTurn X", pickTurn)
    })

    socket.off('Y-PowerPick')
    socket.on('Y-PowerPick', () => {
        setPickTurn("Y")
        console.log("Setting pickTurn Y", pickTurn)
    })

    socket.off('Z-PowerPick')
    socket.on('Z-PowerPick', () => {
        setPickTurn("Z")
        console.log("Setting pickTurn Z", pickTurn)
    })
    const handleSelectPowerClick = () => {
        console.log("handleSelectPowerClick", player)
        const updatedPlayer:PlayerInfo = {name:player.name, roomId:player.roomId,
            type:player.type, identifier: selectedPower}   
        console.log("updatedPlayer", updatedPlayer) 
        setPlayer(updatedPlayer)    
        socket.emit('updatePlayerPower', updatedPlayer)
        
        if(player.type === "X")
        {
            setPickTurn("Y")
            socket.emit("Y-PowerPick")
        }    
        else  if(player.type === "Y")
        {
            if(opponents.length === 1){
                socket.emit("startGame")
                setPhase("StartGame")
            }
            else {
                setPickTurn("Z")
                socket.emit("Z-PowerPick")

            }
        }
        else if(player.type === "Z")
        {
            socket.emit("startGame")
            setPhase("StartGame")
        }                    
    }

    // const canSelectPower = () => {
    //     if()

    //     return
    // }
    return (
        <div className="relative">
            <h1 className="power-header">Select a God Power</h1>
            <div className="godCards-container">
                {godPowers.map(power => {
                    return <GodCard key={uuid()} godCardInfo={power} player={player} 
                        opponents={opponents} selectedPower={selectedPower}
                        setSelectedPower={setSelectedPower} pickTurn={pickTurn}/>
                })}                
            </div> 
            {
                selectedPower &&  godPowers && 
                <div className="description-area">
                    <h4>Power Description</h4>
                    <p>{godPowers.find((g) => (g.identifier === selectedPower))?.description}</p>    
                    {
                        opponents.filter(o=> o.identifier !== selectedPower).length !== 0 && 
                        
                        pickTurn && pickTurn === player.type &&
                        <button className="select-power" onClick={handleSelectPowerClick}>Select Power</button>
                    }
                </div>
            }
        </div>
    )
}

export default PowerPicker