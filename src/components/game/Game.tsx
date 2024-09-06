import { useEffect, useRef, useState } from "react"
import SantoriniBoard from "../board/SantoriniBoard"
import Santorini from "../system/Santorini"
import { GameProp, Move, Player, Turn } from "../../types/Types"
import { Button, Message, Modal, useToaster } from "rsuite"
import { socket } from "../../socket/socket"
import './Game.css'
import "rsuite/dist/rsuite-no-reset.min.css"
import "rsuite/dist/rsuite.min.css";
import TurnInfo from "./TurnInfo"
// import 'rsuite/useToaster/styles/index.css';
// import 'rsuite/Message/styles/index.css'

function Game({playerInfo, opponents}:GameProp){
    const santorini = useRef<Santorini>(null!)
    const [san, setSan] = useState("")
    const [isturn, setIsTurn] = useState(false)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [currentPlayerTurn, setCurrentPlayerTurn] = useState<Player>("X")
    const toaster = useToaster()

    useEffect(() => {

        let powerX, powerY, powerZ 
        let powers = ""
        if(playerInfo.type === "X") powerX = playerInfo.identifier
        else if(playerInfo.type === "Y") powerY = playerInfo.identifier
        else if(playerInfo.type === "Z") powerZ = playerInfo.identifier

        opponents.forEach(o => {
            if(o.type === "X") powerX = o.identifier
            else if(o.type === "Y") powerY = o.identifier
            else if(o.type === "Z") powerZ = o.identifier
        })
        console.log("Powers...", powerX, powerY, powerZ, opponents)
        if(powerX){
            powers = `${powerX}/${powerY}`
            if(opponents.length === 2){
                powers += `/${powerZ}`
            }

        }else {
            powers = "-"
        }
        console.log("Powers", powers, playerInfo, opponents)
        santorini.current = new Santorini("5/5/5/5/5 X - " + powers + " L22/M18/S14/D18 - - 1", opponents.length + 1);
        if(playerInfo.type === "X") setIsTurn(playerInfo.type === santorini.current.getPlayerTurn());
        
    },[])



    // function updateMove(){
    //     const santoriniRef: Santorini = santorini.current;
    //     if(santoriniRef){
    //         santorini.current.turn(((document.getElementById("move") as HTMLInputElement).value));
    //         // setUpdatedSan(santorini.current.getSAN())           
    //         (document.getElementById("move") as HTMLInputElement).value = "";
    //         setSan(santoriniRef.getSAN())
    //         // setPreviousTurn(santorini.current.getSAN().trim())
    //         // if(santorini.current.isGameOver()){
    //             // if(santoriniRef.getWinner()) setWinner(santoriniRef.getWinner())
    //         // }
    //         // setCanUndo(true)
    //     }
    // }


    // function updateSAN(){
    //     santorini.current.load(((document.getElementById("san") as HTMLInputElement).value));
    //     setSan(santorini.current.getSAN().trim());
    //     (document.getElementById("san") as HTMLInputElement).value = "";
    // }

    // function getPlayerTurn():string {
    //     const pturn = santorini.current.getPlayerTurn();
    //     const foundPlayer = players.find(p => p.type === pturn)
    //     if(!foundPlayer) return "";
    //     return foundPlayer.name;
    // }

    function getWinner():string {
        if(!santorini.current) return ""
        const pturn = santorini.current.getWinner();
        if(playerInfo.type === pturn) return playerInfo.name

        const foundPlayer = opponents.find(p => p.type === pturn)        
        if(!foundPlayer) return "";
        return foundPlayer.name;
    }

    function opponentTurn(turn: Turn){
        // console.log("opponent Move", turn )
        santorini.current.takeTurn(turn);
        setSan(santorini.current.getSAN())
        setCurrentPlayerTurn(santorini.current.getPlayerTurn());
        if(santorini.current.isGameOver()){            
            // toaster.push(<Message type="warning" >{winner} has won the game!!! </Message>, {placement: 'topCenter'})
            handleOpen();
            setIsTurn(false)
        }else if(playerInfo.type !== "S"){           
            setIsTurn(playerInfo.type === santorini.current.getPlayerTurn())
        }
    }

    socket.off('takeTurn')
    socket.on('takeTurn', turn => {
        opponentTurn(turn)
    })

    function turnEnd(turn:Turn):boolean{
        // console.log("Turn end in game: ", turn)
        turn.gameActions.forEach(action => {
            const tempMove = action as Move
            if(tempMove.worker && tempMove.worker.toLocaleUpperCase() !== santorini.current.getPlayerTurn()){
                return false
            }
        })        
        let newTurn 
        try {
             newTurn =  santorini.current.takeTurn(turn);

        }catch(err){
            console.log((err as Error).message, err);
            toaster.push(<Message type="warning" ><strong>{(err as Error).message}</strong></Message>, {placement: 'topCenter'})
            return false
        }

        if(newTurn === null) return false
        setSan(santorini.current.getSAN())
        setCurrentPlayerTurn(santorini.current.getPlayerTurn());
        socket.emit('takeTurn', turn)
        socket.emit('boardState', santorini.current.getSAN())
        setIsTurn(playerInfo.type === santorini.current.getPlayerTurn())

        if(santorini.current.isGameOver()){
            // const winner = santorini.current.getWinner()
            handleOpen();
            return true;
            // toaster.push(<Message>{winner} has won the game!!! </Message>, {placement: 'topCenter'})
         
        }
        return true
    }

    return (
        <div>
            <TurnInfo opponents={opponents} player={playerInfo} 
                currentPlayerTurn={currentPlayerTurn} />
            
            <SantoriniBoard SAN={san} onTurnEnd={turnEnd} areWorkersMoveable={isturn}/>
            
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>
                <Modal.Body>{getWinner()} is the Winner!!!!</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="primary">Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Game