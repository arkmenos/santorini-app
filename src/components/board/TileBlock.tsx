import { Edges } from "@react-three/drei"
import { BlockProp } from "../../types/Types"

function TileBlock({position, size=[1,0.25,1], color="green"}: BlockProp) {
    
    return(
        <>
            <mesh position={position} >
                <boxGeometry args={size} />
                <Edges linewidth={2} threshold={1} />
                <meshBasicMaterial color={color}/>
            </mesh>
        </>
    )
}

export default TileBlock