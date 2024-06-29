import { Edges } from "@react-three/drei"
import { BlockProp } from "../../types/Types"

function Small ({position, size=[0.5,0.35,0.5], color="lightgray"}: BlockProp) {
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

export default Small