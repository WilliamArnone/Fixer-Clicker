import { useRef } from "react";
import { MatrixMaterial } from "../materials/MatrixMaterial";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

const CITIES = {
  city1: "/City1.glb",
  city2: "/City1.glb",
};

(Object.keys(CITIES) as Array<keyof typeof CITIES>).forEach((key) =>
  useGLTF.preload(CITIES[key]),
);

export default function MatrixCity({
  model,
  ...props
}: {
  model: keyof typeof CITIES;
}) {
  const materialRef = useRef<MatrixMaterial>(null);
  const cityModel = useGLTF(CITIES[model]);

  const geometry =
    cityModel.scene.children[0] instanceof Mesh &&
    cityModel.scene.children[0].geometry;

  /**
   * CONTROLS
   */
  const { materialSpeed, color } = useControls("Matrix City", {
    materialSpeed: { value: 1, min: 0, max: 20 },
    //color: {value: "#339919"}
    color: { value: "#1e56ff" },
  });

  /**
   * UPDATE
   */
  useFrame((_, delta) => {
    if (materialRef.current)
      materialRef.current.uniforms.uTime.value += delta * materialSpeed;
  });

  return (
    <mesh geometry={geometry} {...props}>
      <matrixMaterial ref={materialRef} color={color} />
    </mesh>
  );
}
