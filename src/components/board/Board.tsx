import { ReactNode } from "react"

interface BProps{
    children?:ReactNode
}
function Board({children}:BProps) {
    return (
        <>
        <mesh position={[0,-1.9,0]} >
            <boxGeometry args={[6,0.5,6]}/>
            <meshBasicMaterial color={"cyan"} />                

            {children}
        </mesh>
        </>
    )
}

export default Board