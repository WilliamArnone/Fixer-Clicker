import { useRef } from "react";
import { MatrixMaterial } from "../materials/MatrixMaterial";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useGame } from "../hooks/useGame";

const CITIES = {
  city1: "/City1.glb",
  city2: "/City1.glb",
};

(Object.keys(CITIES) as Array<keyof typeof CITIES>).forEach((key) =>
  useGLTF.preload(CITIES[key]),
);

export default function MatrixCity({
  model,
  color,
  ...props
}: {
  model: keyof typeof CITIES;
  color: string;
}) {
  const materialRef = useRef<MatrixMaterial>(null);
  const materialSpeedRef = useRef<number>(0);
  const glitch = useGame((state) => state.glitch);
  const phase = useGame((state) => state.phase);
  const cityModel = useGLTF(CITIES[model]);

  const geometry =
    cityModel.scene.children[0] instanceof Mesh &&
    cityModel.scene.children[0].geometry;

  /**
   * CONTROLS
   */
  const { materialSpeed } = useControls("Matrix City", {
    materialSpeed: { value: 1, min: 0, max: 20 },
  });

  /**
   * UPDATE
   */
  useFrame((_, delta) => {
    let speedTarget = 0;

    if (phase === "game")
      speedTarget = glitch ? materialSpeed * 50 : materialSpeed;

    materialSpeedRef.current +=
      (speedTarget - materialSpeedRef.current) * delta * 0.5;

    if (materialRef.current)
      materialRef.current.uniforms.uTime.value +=
        delta * materialSpeedRef.current;
  });

  return (
    <mesh geometry={geometry} {...props}>
      <matrixMaterial ref={materialRef} color={color} />
    </mesh>
  );
}
