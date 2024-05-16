import { useMemo, useRef } from "react"
import { MatrixMaterial } from "../materials/MatrixMaterial"
import { useGLTF } from "@react-three/drei"
import { Mesh} from "three"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"

export default function MatrixCity( { model, ...props } : { model: "city1" | "city2" } ) {
	const materialRef = useRef<MatrixMaterial>(null)
	const city1 = useGLTF("/city.glb")
	const city2 = useGLTF("/city.glb")

	const geometry = useMemo(() => {
		return (model == "city1" && city1.scene.children[0] instanceof Mesh && city1.scene.children[0].geometry)
		|| (model == "city2" && city2.scene.children[0] instanceof Mesh && city2.scene.children[0].geometry)
	}, [city1, city2, model])
	
	/**
	 * CONTROLS
	 */
	const {materialSpeed, color} = useControls("Matrix City", {
		materialSpeed: {value: 1, min: 0, max: 20},
		//color: {value: "#339919"}
		color: {value: "#1e56ff"}
	})

	/**
	 * UPDATE
	 */
	useFrame((_, delta)=>{
		if(materialRef.current)
			materialRef.current.uniforms.uTime.value += delta * materialSpeed; 
	})

	return (
		<mesh
			geometry={geometry}
			{...props}
		>
			<matrixMaterial ref={materialRef} color={color} />
		</mesh>
	)
}