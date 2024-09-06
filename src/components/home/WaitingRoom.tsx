import { ReactElement, useEffect, useState } from "react"
import { socket } from "../../socket/socket";
import {v4 as uuidV4} from   "uuid"
import { GameStartPhase, PLAY_MODES, PlayerInfo, PlayMode, SIMPLE_GOD_POWERS } from "../../types/Types";
import { JSX } from "react/jsx-runtime";
import HeaderMessage from "./HeaderMessager";

interface WaitingRoomProps{
    playerInfo:PlayerInfo,
    opponents: PlayerInfo[],
    setPlayerInfo: (playerInfo: PlayerInfo) => void,    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOpponents: (arg0: any) => void,
    setPhase: (phase:GameStartPhase) => void
}

function WaitingRoom({playerInfo, opponents, setPhase, setPlayerInfo, setOpponents}:WaitingRoomProps) {
    const [roomPath, ] = useState(window.location.origin + `/${playerInfo.roomId}`);
    const [playersDisplay, setPlayersDisplay] = useState<ReactElement[]>([])
    const [ready, setReady] = useState(false)
    const [playerCount , setPlayerCount] = useState(1);
    const [playMode, setPlayMode] = useState<PlayMode>("No Powers")

    socket.off('updatePlayer')
    socket.on('updatePlayer', (data) => {
        const updated:PlayerInfo = {name:playerInfo.name, roomId:playerInfo.roomId, 
            type:data.type, identifier: null}
        setPlayerInfo(updated);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // setPlayers((p: any) => [...p, updated])        
        setPlayersDisplay(p => [...p, <li key={uuidV4()}>{playerInfo.name} (you)</li> ])
    })

    socket.off('updatePlayerPower')
    socket.on('updatePlayerPower', (data) => {
        
        const updated:PlayerInfo = {name:data.name, roomId:data.roomId, 
            type:data.type, identifier: data.identifier}

        if(data.type === playerInfo.type){           
            setPlayerInfo(updated)
        }
        else
        {
            const updatedOpponents = [...opponents.filter(o => o.type !== updated.type), updated]
            setOpponents(updatedOpponents)
        }
    })

    socket.off('getUsersInRoom')
    socket.on('getUsersInRoom', (data) => {
        // console.log("getUsersInRoom" , data)
        const otherPlayers: JSX.Element[] = []
        let pCount = 0;
        data.forEach((p: { type: string; name: string}) => {
            if(p.type !== "S") pCount++
            otherPlayers.push(<li key={uuidV4()}>{p.name}</li>)
        })
        setPlayersDisplay(p => [...p,...otherPlayers])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOpponents((p: any) => [...p, ...data])     
        if(pCount > 0) setPlayerCount((c: number) => c + pCount)
    })

    socket.off('userJoined')
    socket.on('userJoined', data => {
        // console.log("userJoined", data)
        setPlayersDisplay(p=> [...p, <li key={uuidV4()}>{data.name}</li>])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOpponents((p: any) => [...p, data])      
        if(data.type !== "S") setPlayerCount((c: number) => c + 1)
        if(playerInfo.type === "X" && data.type !== "S") setReady(true)
    })

    socket.off('startGame')
    socket.on('startGame', () => {
        // console.log("startGame")
        // setPickPower(true)
        setPhase("StartGame")
    })

    socket.off('pickPower')
    socket.on('pickPower', () => {
        // console.log("startGame")
        // setPickPower(true)
        setPhase("PickPowers")
    })

    const handlePickPower = () => {
        // console.log("Emit Start")
        // socket.emit('pickPower')        
        if(playMode === "No Powers"){
            // setStart(true)
            setPhase("StartGame")
            socket.emit('startGame')
        }
        else if(playMode === "Pick Powers"){
            // setPickPower(true)
            setPhase("PickPowers")
            socket.emit('pickPower')
        }
        else {
            let simple_powers = [...SIMPLE_GOD_POWERS]
            const first_pick = Math.floor(Math.random() * 9)
            const first_power = simple_powers[first_pick]
            simple_powers = simple_powers.filter(p => p !== first_power)
            const second_pick = Math.floor(Math.random() * 8)
            const second_power = simple_powers[second_pick]
            
            const  updated:PlayerInfo = {name:playerInfo.name, roomId:playerInfo.roomId, 
                type:playerInfo.type, identifier: first_power}
            setPlayerInfo(updated)
            socket.emit("updatePlayerPower", updated)
            
            let updated_y
            opponents.map(o => {
                if(o.type === "Y"){
                    updated_y = {name:o.name, roomId:o.roomId, type:o.type, identifier: second_power}
                    socket.emit("updatePlayerPower", updated_y)
                }
            })
            if(opponents.length === 1){
                setOpponents([updated_y])
            }
            if(opponents.length === 2){
                const third_pick = Math.floor(Math.random() * 7)
                simple_powers = simple_powers.filter(p => p !== second_power)
                const third_power = simple_powers[third_pick]
                let updated_z
                opponents.map(o => {
                    if(o.type === "Z"){
                        updated_z = {name:o.name, roomId:o.roomId, type:o.type, identifier: third_power}
                        socket.emit("updatePlayerPower", updated_z)
                    }
                })
                setOpponents([updated_y,updated_z])
            }
            setPhase("StartGame")
            socket.emit('startGame')
        }
    }
    useEffect(()=> {
        // console.log(playerInfo)
        const enterRoom = () => {
            if(playerInfo.type === "X"){
                socket.emit('createRoom', playerInfo)
                setPlayersDisplay([<li key={uuidV4()}>{playerInfo.name} (you)</li>])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // setPlayers((p: any) => [...p, playerInfo])      
            }
            else{
                socket.emit('enterRoom', playerInfo)
                // if(playerInfo.type === "S"){
                //     socket.emit('getBoardState', playerInfo.roomId)
                // }
            }
        }
        // const rmId = playerInfo.roomId
        // console.log(playerInfo.name, rmId)
        // setRoomPath(window.location.origin + `/${playerInfo.roomId}`)
        socket.connect()
        enterRoom()       
    
    }, [])

    // const onPlayModeChange = (e) => {
    //     setPlayMode(e.target.value)
    // }

    return(
        <div className="container">
            {/* <h1>Waiting on other players to join</h1><br/> */}
            <HeaderMessage playerCount={playerCount} player={playerInfo.type} ready/>
            <h3 className="header">Send the link to a friend to invite to your game.</h3>
            <input className="link-lbl" type="text" readOnly value={roomPath} />
            {/* <div className="link-lbl">{roomPath}</div> */}
            <button className="create-btn" onClick={() => {navigator.clipboard.writeText(roomPath)}}>copy</button>
            
            <div>
                <ul className="player-list">{playersDisplay}</ul><br/>
                {ready && 
                    <div>
                        
                        <h4>Select a Play Mode</h4>
                            {
                                PLAY_MODES.map(m => ( 
                                    m === "No Powers" &&
                                    <div key={uuidV4()}>    
                                        <input type="radio" id={m} name="play_mode" value={m} key={uuidV4()}                                                     
                                                checked={m===playMode} 
                                                onChange={(e) => setPlayMode(e.target.value as PlayMode)}/>
                                        <label key={uuidV4()} htmlFor={m} >{m}</label>
                                        <br/>
                                    </div>                                        
                                ))
                            }
                            
                        <br/>
                        <button className="start-btn" onClick={() => handlePickPower()}>Start Game</button> 
                    </div>}
            </div>
        </div>
    )
}

export default WaitingRoom