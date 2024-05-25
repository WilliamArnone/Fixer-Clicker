import { useEffect, useRef } from "react";
import { MatrixMaterial } from "../materials/MatrixMaterial";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
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
  const phase = useGame((state) => state.phase);

  const speed = useRef<number>(0);

  const materialRef = useRef<MatrixMaterial>(null);

  const cityModel = useGLTF(CITIES[model]);
  const geometry =
    cityModel.scene.children[0] instanceof Mesh &&
    cityModel.scene.children[0].geometry;

  useEffect(() => {
    if (phase === "intro") speed.current = 18;
  }, [phase]);

  useFrame((_, delta) => {
    let speedTarget = 0;
    const glitch = useGame.getState().glitch;

    if (phase === "intro" || phase === "game") speedTarget = glitch ? 50 : 0.6;

    speed.current += (speedTarget - speed.current) * delta * 0.5;

    if (materialRef.current)
      materialRef.current.uniforms.uTime.value += delta * speed.current;
  });

  return (
    <mesh geometry={geometry} {...props}>
      <matrixMaterial ref={materialRef} color={color} />
    </mesh>
  );
}
