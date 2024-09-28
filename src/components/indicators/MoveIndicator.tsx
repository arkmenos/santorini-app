/* eslint-disable react/prop-types */
import { Edges } from "@react-three/drei"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore prop validation
function MoveIndicator({position, color,...props}) {
   
    return(
        <>
        <group  dispose={null} {...props} >
            <mesh position={position} rotation={[-1.54, 0, 0]}  >
                <circleGeometry args={[0.33,36]}  />
                <Edges linewidth={2} threshold={1} />
                <meshBasicMaterial  color={color} />
            </mesh>
        </group>            
        </>
    )
}

export default MoveIndicator