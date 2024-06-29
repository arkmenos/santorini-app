import { Edges } from "@react-three/drei"
import { BlockProp } from "../../types/Types"

function Large ({position, size=[0.95,0.5,0.95], color="lightgray"}: BlockProp) {
    return(
        <>
            <mesh position={position}>
                <boxGeometry args={size} />
                <Edges linewidth={2} threshold={1} />
                <meshBasicMaterial color={color}/>
            </mesh>
        </>
    )
}

export default Large